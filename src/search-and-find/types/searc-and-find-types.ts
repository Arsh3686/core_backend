import type { FromSchema } from "json-schema-to-ts";
import { FIND_USERS_IN_RANGE_SCHEMA } from "../schemas/search-and-find-schema"

export type FIND_USERS_IN_RANGE_TYPE = {
    Body: FromSchema<typeof FIND_USERS_IN_RANGE_SCHEMA.body>,
    Params: FromSchema<typeof FIND_USERS_IN_RANGE_SCHEMA.params>,
};

