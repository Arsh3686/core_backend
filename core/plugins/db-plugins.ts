import fp from "fastify-plugin";
import knex from "knex";
import config from "../../config/db-config.js";

export default fp(async (fastify) => {

    const db = knex(config.PSQL_DB);
    await db.raw('Select 1+1');
    console.log("Db connection started ✅");
    
    fastify.decorate('knex',db);
    fastify.decorateRequest('knex', db);

    fastify.addHook('onRequest',(req, reply, done)=>{
        req.knex = fastify.knex;
        done();
    })

    fastify.addHook('onClose',async ()=>{
        await db.destroy();
        console.log("❌ Database connection closed");
    });
})