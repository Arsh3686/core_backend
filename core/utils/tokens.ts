import { AuthError } from "@core/errors/BasicError";
import type { FastifyReply, FastifyRequest } from "fastify";
import jwt, { type SignOptions } from "jsonwebtoken"

const accessSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET!;

type returnType = {
  accessToken?: string;
  refreshToken?: string;
  error ?: Error | undefined;
}

type verifyReturnType = {
  userInfo: {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    pepper_type: 'CURRENT' | 'OLD' | '';
  };
  error?: Error | undefined;
}

const generateTokens = (payload: object): returnType => {
  try {
    const jti = crypto.randomUUID();

    return {
      accessToken: generateAccessToken({...payload, jti}),
      refreshToken: generateRefreshToken({...payload, jti}),
      error: undefined
    };
  } catch (error) {
    return { error: new Error("Error in generating access token") };
  }
};


function generateAccessToken(payload: object) {

  const options: SignOptions = {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRES || "15m") as any,
  };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, options);
}

function generateRefreshToken(payload: object) {
  const options: SignOptions = {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRES || "1d") as any,
  };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, options);
}

async function verifyAccessToken(request : FastifyRequest): Promise<verifyReturnType> {
  try {
   console.log("Verify Access token on onRequest hook for endpoint", request.url);
  
  if(!request.headers.authorization){
    throw new AuthError("Authorization headers missing", new Error("Authorization headers missing"));
  }

  if(request.headers.authorization?.split(" ")[0] !== "Bearer" || request.headers.authorization?.split(" ").length !== 2){
    throw new AuthError("Unauthorized", new Error("Invalid token"));
  }

  const token = request.headers.authorization?.split(' ')[1] as string
  const isValidToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;

  if(!isValidToken){
    throw new AuthError("Unauthorized", isValidToken);
  }

  if(isValidToken instanceof Error){
    throw new AuthError("Unauthorized", isValidToken); 
  }

  const jti = isValidToken.jti;

  const isLogout = await request.redis.get(`logout_${jti}`);
  if(isLogout){
    throw new AuthError("Token expired", isLogout);
  }

  return { userInfo: isValidToken.userInfo || {}, error: undefined }; 
  } catch (error) {
    throw new AuthError("Invalid token", error);
  }
}

function verifyRefreshToken(request : FastifyRequest) {
  console.log("Verify Refresh token on onRequest hook for endpoint", request.url);
  
  if(!request.cookies.refreshToken){
    throw new Error("Refresh token missing");
  }

  const token = request.cookies.refreshToken
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!)
}

export { generateTokens, generateRefreshToken, generateAccessToken, verifyAccessToken, verifyRefreshToken };