import { AuthError } from "@core/errors/BasicError";
import argon2 from "argon2";
import type { FastifyRequest } from "fastify";

export const hashPassword = async (password: string) => {
    return await argon2.hash(password + process.env.PEPPER_CURRENT);
}

export const verifyPassword = async (password: string, hash: string) => {
    // const pepper_type = req.userInfo?.pepper_type;
    // if(!["CURRENT", "OLD"].includes(pepper_type)){
    //     throw new AuthError("Invalid pepper type", new Error("Invalid pepper type"));
    // };

    return await argon2.verify(hash, password + process.env.PEPPER_CURRENT);
}