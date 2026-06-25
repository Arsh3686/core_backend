import type { FastifyInstance } from "fastify";
import { PROCESS_WALLET, WALLET_RECEIPT } from "./controllers/wallet-controllers";

export default async function walletRoutes(fastify: FastifyInstance) {
    fastify.route({ method: 'POST', url: '/process', handler: PROCESS_WALLET });
    fastify.route({ method: 'POST', url: '/receipt/:transactionId', handler: WALLET_RECEIPT });
}
