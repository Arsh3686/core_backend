
import fp from "fastify-plugin"
import Redis from "ioredis"

export default fp(async (fastify) => {
    const redis = new Redis({
        host: 'localhost',
        port: 1099,
        password: '12345'
    });

    redis.on('connect', () => {
        console.log('Redis is connected successfully');
    })

    redis.on('error', (err) => {
        console.log("Some error occured:", err);
    })

    fastify.decorate("redis", redis)
    // fastify.decorateRequest("redis",null);

    fastify.addHook('onRequest', (req, reply,done)=>{
        req.redis = fastify.redis;
        done();
    })

    fastify.addHook('onClose', async (instance) => {
        await instance.redis.quit();
    })
})