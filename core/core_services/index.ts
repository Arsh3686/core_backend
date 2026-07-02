import { verifyAccessToken, verifyRefreshToken } from "@core/utils/tokens.js"
import fastify, { type FastifyInstance } from "fastify"

const addHooks = (app: FastifyInstance) => {


    app.addHook('onRequest', (req, reply) => {
        return verifyAccessToken(req);
    })
    app.addHook("onResponse", (req, reply) => {
        return verifyRefreshToken(req);
    })

    return app
}

export { addHooks }