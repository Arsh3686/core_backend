import type { FastifyReply, FastifyRequest } from "fastify";
import { findNearbyUsers, searchUsersWithinLocation } from "../services/search-and-find-services.js";
import type { FIND_USERS_IN_RANGE_TYPE } from "../types/searc-and-find-types.js";
import { getDistanceInMeters } from "@core/helper/core-helper.js";

async function GET_USERS(req: FastifyRequest, reply: FastifyReply) {
    try {
        // const { knex } = req;

        // const result = await searchUsersWithinLocation(knex);
        // req.log.info({ result }, 'Search users within location');
        return reply.send({ message: 'I am a get Users', data: "result" })
    } catch (error) {
        return new Error("Error while getting users");
    }
}


// IT will help users to find users within a specific range
async function FIND_USERS_IN_RANGE(req: FastifyRequest, reply: FastifyReply) {
    try {
        const { knex } = req.server;
        // const { user_id } = req.body;

        const result = await searchUsersWithinLocation(knex);
        req.log.info({ result }, 'Search users within location');
        return reply.send({ message: 'I am a get Users', data: result })
    } catch (error) {
        return new Error();
    }
}

// async function findNearbyUsers(pivotLat:number, pivotLon:number) {
//   let radius = 500; // start with 500m
//   let results = [];

//   while (results.length < 50 && radius < 50000) { // max 50 km
//     results = await db('user_locations')
//       .select(
//         'user_id',
//         db.raw(
//           'earth_distance(ll_to_earth(lat, lon), ll_to_earth(?,?)) as dist_m',
//           [pivotLat, pivotLon]
//         )
//       )
//       .whereRaw(
//         'earth_box(ll_to_earth(?, ?), ?) @> ll_to_earth(lat, lon)',
//         [pivotLat, pivotLon, radius]
//       )
//       .orderBy('dist_m')
//       .limit(50);

//     radius *= 2; // expand search radius
//   }

//   return results;
// }


async function FIND_NEARBY_USERS(req: FastifyRequest<FIND_USERS_IN_RANGE_TYPE>, reply: FastifyReply) {
    try {
        const { body, knex, params } = req;
        const { longitude, latitude } = body;
        const { user_id } = params;
        let radius = 500;
        let userCount = 50;
        let result: any = [];

        const cachedResponse = await req.redis.get(`USER_IN_RANGE_${user_id}`)
        if (cachedResponse) {
            const cachedData = JSON.parse(cachedResponse);
            if (cachedData && cachedData.user_id === user_id) {
                const data = getDistanceInMeters(latitude, longitude, cachedData.latitude, cachedData.longitude);
                if (data < 250) { // if distance changed is less than 250 meters, use cached data
                    return cachedData.result;
                }
            }
        }

        while (userCount > result?.length && radius < 50000) { // max 50km
            result = await findNearbyUsers(knex, user_id, latitude, longitude, radius);
            radius *= 2;
        }
        req.redis.set(`USER_IN_RANGE_${user_id}`, JSON.stringify({
            user_id,
            longitude,
            latitude,
            result
        }));
        return result;

    } catch (error) {
        return reply.code(400).send({ message: 'Error while finding nearby Users', error });
    }
}

export { GET_USERS, FIND_NEARBY_USERS }