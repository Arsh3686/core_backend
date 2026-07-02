
import fp from "fastify-plugin"
import { Redis } from "ioredis"
// import { Redis as RedisUpstash } from "@upstash/redis";

export default fp(async (fastify) => {
    let redis: Redis;
    if (process.env.NODE_ENV === 'development') {
        redis = new Redis({
            host: process.env.REDIS_HOST! || 'localhost',
            port: Number(process.env.REDIS_PORT || 1099),
            password: process.env.REDIS_PASSWORD || '12345'
        })
    } else {
        redis = new Redis(process.env.REDIS_URL!)
    }

    redis.on('connect', () => {
        console.log('Redis is connected successfully');
    })

    redis.on('error', (err: any) => {
        console.log("Some error occured:", err);
    })

    fastify.decorate("redis", redis)
    // fastify.decorateRequest("redis",null);

    fastify.addHook('onRequest', (req, reply, done) => {
        req.redis = fastify.redis;
        done();
    })

    fastify.addHook('onClose', async (instance) => {
        await instance.redis.quit();
    })
})