import type { FastifyInstance } from "fastify"
import { FIND_NEARBY_USERS, GET_USERS } from "./controllers/search-and-find.js"
import { FIND_USERS_IN_RANGE_SCHEMA } from "./schemas/search-and-find-schema.js"

export default async function searchAndFindRoutes(fastify: FastifyInstance) {
    fastify.route({ method: 'GET', url: '/', handler: GET_USERS })
    fastify.route({ method: 'POST', url: '/inrange/:user_id', schema: FIND_USERS_IN_RANGE_SCHEMA, handler: FIND_NEARBY_USERS })
}