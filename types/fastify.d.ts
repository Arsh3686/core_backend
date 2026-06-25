import "fastify";
import "@fastify/cookie";
import type Redis from "ioredis";
import type { Knex } from "knex";

declare module "fastify" {
    interface FastifyInstance {
        knex: Knex;
        redis: Redis
    }
    interface FastifyRequest {
        knex: Knex;
        redis: Redis;
        userInfo: {
            id: string;
            username: string;
            email: string;
            password_hash: string;
            pepper_type: 'CURRENT' | 'OLD' | '';
        };

    }
}