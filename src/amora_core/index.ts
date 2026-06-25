import type { FastifyInstance } from "fastify"
import { TABLE_FETCH_SCHEMA } from "./schemas/amora-core-schemas"
import { ME_API } from "./controllers/amora-core-controllers"

export default async function searchAndFindRoutes(fastify: FastifyInstance) {
    fastify.route({ method: 'POST', url: '/fetch/table/', schema: TABLE_FETCH_SCHEMA, handler: ME_API })
}