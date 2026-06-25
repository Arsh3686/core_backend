import type { defaultResponseType } from "@core/core-types";
import type { Knex } from "knex";

const checkIfUniqueConstraintsExistOrNot = async (knex: Knex ,username: string, email: string) : Promise<defaultResponseType> => { 
    try {   
        let query = ""
        if(username){
            // check in db if username exists
            query = `select username from amora.users where username = '${username}' limit 1`;
        }else if(email){
            // check in db if email exists
            query = `select email from amora.users where email = '${email}' limit 1`;
        }
        const result = await knex.raw(query);
        if(result.rows.length > 0){
            return { data: result.rows }; // exists
        }
        
        return { data: null }; // does not exist
    } catch (error) {
        return {
            data : null,
            error: "Error in checking unique constraints"
        };
    }
}

export { checkIfUniqueConstraintsExistOrNot };