import type { FromSchema } from "json-schema-to-ts";
import type { TABLE_FETCH_SCHEMA } from "./schemas/amora-core-schemas";


export type FETCH_TABLE_DETAILS_SCHEMA_TYPE = {
    Body: FromSchema<typeof TABLE_FETCH_SCHEMA.body>
};