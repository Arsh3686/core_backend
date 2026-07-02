import type { FastifyInstance } from "fastify"
import { CHAT_WITH_USER_SCHEMA } from "./schemas/chat-schemas.js"
import { CHAT_WITH_USER } from "./controllers/chat-controllers.js"
import { chatGuard } from "./middlewares/chat-guard.js"

export default async function chatRoutes(fastify: FastifyInstance) {
    fastify.route({
        method: 'POST',
        url: '/chat',
        schema: CHAT_WITH_USER_SCHEMA,
        preHandler: chatGuard,
        handler: CHAT_WITH_USER
    })
    // fastify.route({ method: 'GET', url: '/init', handler: ingestDocuments })

}