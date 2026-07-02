import "./config/env.js";
import fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import dbPlugins from "@core/plugins/db-plugins.js";
// import redisPlugins from "./core/plugins/redis-plugins";
import redisPlugins from "@core/plugins/redis-plugins.js";
import { setupSocket } from "@core/socket/setup.js";
import registerRoutes from "./routes.js";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { verifyAccessToken } from "@core/utils/tokens.js";
import { AuthError } from "@core/errors/BasicError.js";
import { ingestDocumentsByPinecone } from "rag/init.js";


const start = async () => {
  const server = fastify();
  try {
    server.register(cors, { origin: true });

    server.register(cookie, {
      secret: process.env.COOKIE_SECRET || "supersecret",
      hook: 'onRequest',
      parseOptions: {}
    });
    // server.register(dbPlugins);
    server.register(redisPlugins);

    server.addHook("onRequest", async (req: FastifyRequest, reply: FastifyReply) => {
      const nonValidatePaths = [
        "/api/v1/auth/login",
        "/api/v1/auth/create",
        "/api/v1/auth/forget-password",
        "/api/v1/auth/reset-password",
        "/api/v1/wallet/process",
        "/api/v1/wallet/receipt",
        "/api/collections",       // ← public: file-based collection storage
        "/ai/chat"                // ← public: AI chatbot endpoint
      ];

      const isPublic = nonValidatePaths.some(path => req.url.startsWith(path));
      if (isPublic) {
        return;
      }

      const verifyToken = await verifyAccessToken(req);

      if (!verifyToken) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      if (verifyToken instanceof AuthError) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      req.userInfo = verifyToken.userInfo;
      return;
    })

    registerRoutes(server);
    await ingestDocumentsByPinecone()

    await server.listen({ port: Number(process.env.PORT), host: "0.0.0.0" });
    console.log(`Server is running at port ${process.env.PORT} on host 0.0.0.0`);

    // setupSocket(server);

  } catch (error) {
    server.log.error(error);
    console.log(error);
    process.exit(1);
  }
};

start();
