import type { FastifyInstance } from "fastify"
import { CREATE_USER_SCHEMA, FORGET_PASSWORD_SCHEMA, ME_USER_SCHEMA, RESET_PASSWORD_SCHEMA } from "./schemas/auth-schemas.js"
import { CREATE_USER, FORGOT_PASSWORD, LOGIN_USER, LOGOUT, ME_API, RESET_PASSWORD } from "./controllers/auth-controllers.js"

export default async function searchAndFindRoutes(fastify: FastifyInstance) {
    fastify.route({ method: 'POST', url: '/create', schema: CREATE_USER_SCHEMA, handler: CREATE_USER })
    fastify.route({ method: 'POST', url: '/login', schema: CREATE_USER_SCHEMA, handler: LOGIN_USER })
    fastify.route({ method: 'POST', url: '/refresh-token', schema: CREATE_USER_SCHEMA, handler: LOGIN_USER })
    fastify.route({ method: 'POST', url: '/me', schema: ME_USER_SCHEMA, handler: ME_API })
    fastify.route({ method: 'POST', url: '/logout', schema: ME_USER_SCHEMA, handler: LOGOUT })
    fastify.route({ method: 'POST', url: '/forget-password', schema: FORGET_PASSWORD_SCHEMA, handler: FORGOT_PASSWORD })
    fastify.route({ method: 'POST', url: '/reset-password', schema: RESET_PASSWORD_SCHEMA, handler: RESET_PASSWORD });
}