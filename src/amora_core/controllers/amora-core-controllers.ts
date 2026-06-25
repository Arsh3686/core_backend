import type { FastifyReply, FastifyRequest } from "fastify";
import type { CREATE_USER_SCHEMA_TYPE, FORGET_PASSWORD_TYPE, LOGIN_USER_SCHEMA_TYPE, ME_USER_SCHEMA_TYPE, RESET_PASSWORD_TYPE } from "../types";
import { checkIfUniqueConstraintsExistOrNot } from "@core/utils/uniqueConstraints";
import { INSERT_DATA_IN_TABLE, UPDATE_DATA_IN_TABLE } from "../services/auth-services";
import { buildDynamicQuery } from "@core/helper/helper-function";
import { generateTokens } from "@core/utils/tokens";
import { ControllerError } from "@core/errors/BasicError";
import { hashPassword, verifyPassword } from "@core/utils/password-hashing";
import { generateOTP } from "@core/core_services/email";
import { sendEmail } from "@core/core_services/mailgun";
import jwt from "jsonwebtoken";

const CREATE_USER = async (req: FastifyRequest<CREATE_USER_SCHEMA_TYPE>, reply: FastifyReply) => {
    try {
        const { username, email, password } = req.body;
        const { knex } = req.server;

        let is_present = await checkIfUniqueConstraintsExistOrNot(knex, username, "");
        if (is_present?.error) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }

        if (is_present?.data) {
            return reply.status(409).send({ message: 'Username or Email already exists' });
        }

        is_present = await checkIfUniqueConstraintsExistOrNot(knex, "", email);
        if (is_present?.error) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
        if (is_present?.data) {
            return reply.status(409).send({ message: 'Username or Email already exists' });
        }

        const payload = {
            username,
            email,
            password_hash: await hashPassword(password),
            pepper_type: "CURRENT"
        };

        await INSERT_DATA_IN_TABLE(knex, payload, "amora.users");

        return reply.send({ message: 'User created successfully' });
    }
    catch (error) {
        return new Error("Error in auth route");
    }
};

const LOGIN_USER = async (req: FastifyRequest<LOGIN_USER_SCHEMA_TYPE>, reply: FastifyReply) => {
    try {
        const { username, email, password } = req.body;
        const { knex } = req.server;

        const result = await buildDynamicQuery(knex, {
            table: "amora.users",
            where: {
                username: username
            },
            select: ["id", "username", "email", "password_hash", "pepper_type"]
        }) as any;


        if (result.error) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }

        if (!result.data || result.data.length === 0) {
            return reply.status(404).send({ message: 'User not found' });
        }

        const isValidPassword = await verifyPassword(password, result?.data?.[0]?.password_hash!);
        if (!isValidPassword) {
            return reply.status(401).send({ message: 'Unauthorized' });
        }
        const payload = {
            userInfo: result.data?.[0] || [],
        }

        const response = generateTokens(payload);

        if (response && response.refreshToken) {
            reply.setCookie('refreshToken', response.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/',
            })
        }

        return reply.send({ message: 'Auth route is working', data: response });
    }
    catch (error) {
        throw new ControllerError("Error in auth route", error);
    }
};

// const LOGIN_USERS = async(req: FastifyRequest<LOGIN_USER_SCHEMA_TYPE>, reply: FastifyReply) => {
//     try {
//        const refreshToken = req.authorization.refreshToken;

//   const payload = jwt.verify(refreshToken, REFRESH_SECRET);

//   const newAccessToken = generateAccessToken({ userId: payload.userId });

//   return reply.send({ accessToken: newAccessToken });
//     }
//     catch (error) {
//         return new ControllerError("Error in auth route", error);
//     }
// };


const ME_API = async (req: FastifyRequest<ME_USER_SCHEMA_TYPE>, reply: FastifyReply) => {
    try {
        const { knex } = req.server;
        const id = req.userInfo?.id || "";

        const result = await buildDynamicQuery(knex, {
            table: "amora.users",
            where: {
                id: id
            },
            select: ["id", "username", "email", "password_hash"]
        });


        if (result.error) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
        return reply.send({ message: 'Auth route is working', data: result.data });
    }
    catch (error) {
        return new ControllerError("Error in auth route", error);
    }
};

const LOGOUT = async (req: FastifyRequest<ME_USER_SCHEMA_TYPE>, reply: FastifyReply) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return reply.status(401).send({ message: 'Unauthorized' });
        }

        const isValidToken = jwt.decode(token) as any;

        if (!isValidToken) {
            return reply.status(401).send({ message: 'Unauthorized' });
        }

        const jti = isValidToken.jti;
        const exp = isValidToken.exp

        const remainingTime = Math.floor(exp - Date.now() / 1000);

        await req.redis.set(`logout_${jti}`, "true", "EX", remainingTime);

        return reply.send({ message: 'Logout successfully' });
    }
    catch (error) {
        return new ControllerError("Error in auth route", error);
    }
};

const FORGOT_PASSWORD = async (req: FastifyRequest<FORGET_PASSWORD_TYPE>, reply: FastifyReply) => {
    try {

        const { email, username } = req.body;
        const { knex } = req.server;

        const result = await buildDynamicQuery(knex, {
            table: "amora.users",
            where: {
                email: email,
                username: username
            },
            select: ["id", "username", "email", "password_hash"]
        }, true) as any;

        if (result.error) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }

        if (!result.data) {
            return reply.status(404).send({ message: 'User not found' });
        }
        const OTP = generateOTP();
        await sendEmail(result.data.email, "Forgot Password", OTP);
        await req.redis.set(`otp_${result.data.username}`, OTP, "EX", 600);

        return reply.send({ message: 'Auth route is working', data: [] });
    } catch (error) {
        return new ControllerError("Error in Forgot password", error);
    }
}

const RESET_PASSWORD = async (req: FastifyRequest<RESET_PASSWORD_TYPE>, reply: FastifyReply) => {
    try {
        const { otp, password, username } = req.body;
        const { knex } = req.server;

        const result = await buildDynamicQuery(knex, {
            table: "amora.users",
            where: {
                username: username
            },
            select: ["id", "username", "email", "password_hash"]
        }, true) as any;

        if (result.error) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }

        if (!result.data) {
            return reply.status(404).send({ message: 'User not found' });
        }
        const isValidOTP = await req.redis.get(`otp_${result.data.username}`);
        if (!isValidOTP || isValidOTP !== otp) {
            return reply.status(401).send({ message: 'Incorrect OTP' });
        }

        const payload = {
            password_hash: await hashPassword(password),
            updated_at: new Date(),
        };

        await UPDATE_DATA_IN_TABLE(knex, payload, "amora.users", { username: username });

        return reply.send({ message: 'Auth route is working', data: payload });
    } catch (error) {
        return new ControllerError("Error in Reset password", error);
    }
}

export { CREATE_USER, LOGIN_USER, ME_API, LOGOUT, FORGOT_PASSWORD, RESET_PASSWORD };