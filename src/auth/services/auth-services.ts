import { DatabaseError } from "@core/errors/BasicError.js";
import type { Knex } from "knex";

const INSERT_DATA_IN_TABLE = async (knex: Knex, payload: any, table: string, returing?: string) => {
    try {

        const result = await knex(table).insert(payload);
        if (result) {
            return true;
        }
        throw new DatabaseError("Something went wrong while saving data", result);
    } catch (error) {
        throw new DatabaseError("Error in saving data", error, "INSERT_DATA_IN_TABLE_CATCH");
    }
}

const UPDATE_DATA_IN_TABLE = async (knex: Knex, payload: any, table: string, where: any, returing?: string) => {
    try {

        const result = await knex(table).update(payload).where(where);
        if (result) {
            return true;
        }
        throw new DatabaseError("Something went wrong while saving data", result);
    } catch (error) {
        throw new DatabaseError("Error in saving data", error, "INSERT_DATA_IN_TABLE_CATCH");
    }
}


export { INSERT_DATA_IN_TABLE, UPDATE_DATA_IN_TABLE };