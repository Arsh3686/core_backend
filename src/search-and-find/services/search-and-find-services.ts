import type { Knex } from "knex";
import { DatabaseError } from '@core/errors/BasicError.js';

const searchUsersWithinLocation = async (knex: Knex) => {
    try {
        const query = `select * from users limit 10`
        const result = await knex.raw(query);
        return result.rows;
    } catch (error) {
        throw new Error();
    }
}

const searchUsersWithinRangeByUserID = async (knex: Knex, user_id: string, limit: number) => {
    try {
        const query = `
            WITH pivot AS (
                SELECT latitude::float8, longitude::float8
                FROM raksha.user_locations
                WHERE user_id = '${user_id}'  -- pivot user
            )
            SELECT 
                u.user_id,
                u.latitude::float8,
                u.longitude::float8,
                earth_distance(
                    ll_to_earth(u.latitude::float8, u.longitude::float8),
                    ll_to_earth(p.latitude::float8, p.longitude::float8)
                ) / 1000 AS distance_km,
                earth_distance(
                    ll_to_earth(u.latitude::float8, u.longitude::float8),
                    ll_to_earth(p.latitude::float8, p.longitude::float8)
                ) AS distance_m
            FROM raksha.user_locations u
            CROSS JOIN pivot p
            WHERE u.user_id <> '${user_id}'
            ORDER BY distance_m ASC
            limit ${limit};
`
        const result = await knex.raw(query);
        return result.rows;
    } catch (error) {
        throw new Error();
    }
}

async function findNearbyUsers(knex: Knex, user_id: string, pivotLat: number, pivotLon: number, radius: number) {
    try {
        // Find up to 50 users within a given radius (meters)
        const query = `
            SELECT u.user_id,
                us.full_name,
                earth_distance(ll_to_earth(u.latitude, u.longitude), ll_to_earth(?, ?)) AS dist_m
            FROM raksha.user_locations u
            inner join raksha.users us on us.user_id = u.user_id and us.is_active
            WHERE earth_box(ll_to_earth(?, ?), ?) @> ll_to_earth(u.latitude, u.longitude)
            and u.user_id <> ?
            ORDER BY dist_m
            LIMIT 50;
            `
        const result = await knex.raw(query, [pivotLat, pivotLon, pivotLat, pivotLon, radius, user_id]);
        return result?.rows ?? [];

    } catch (error) {
        throw new DatabaseError('Error while finding nearby users', error, 'DBError');
    }
}


export { searchUsersWithinLocation, findNearbyUsers }