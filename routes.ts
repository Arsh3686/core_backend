import { type FastifyInstance } from "fastify";
import SearchAndFindRoutes from './src/search-and-find'
import AuthRoutes from './src/auth'
import WalletRoutes from './src/wallet'
import CollectionsRoutes from './src/collections'
import ChatRoutes from './src/chat'

const registerRoutes = (fastify: FastifyInstance) => {
    // fastify.register(SearchAndFindRoutes, { prefix: '/api/v1/search' });
    // fastify.register(AuthRoutes, { prefix: '/api/v1/auth' });
    // fastify.register(WalletRoutes, { prefix: '/api/v1/wallet' });
    // fastify.register(CollectionsRoutes, { prefix: '/api/collections' });
    fastify.register(ChatRoutes, { prefix: '/ai' });
}

export default registerRoutes;