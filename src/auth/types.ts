import type { FromSchema } from "json-schema-to-ts";
import type { CREATE_USER_SCHEMA, FORGET_PASSWORD_SCHEMA, LOGIN_USER_SCHEMA, ME_USER_SCHEMA, RESET_PASSWORD_SCHEMA } from "./schemas/auth-schemas.js";

export type CREATE_USER_SCHEMA_TYPE = {
    Body: FromSchema<typeof CREATE_USER_SCHEMA.body>
};

export type LOGIN_USER_SCHEMA_TYPE = {
    Body: FromSchema<typeof LOGIN_USER_SCHEMA.body>
};

export type ME_USER_SCHEMA_TYPE = {
    Body: FromSchema<typeof ME_USER_SCHEMA.body>
};

export type FORGET_PASSWORD_TYPE = {
    Body: FromSchema<typeof FORGET_PASSWORD_SCHEMA.body>
};

export type RESET_PASSWORD_TYPE = {
    Body: FromSchema<typeof RESET_PASSWORD_SCHEMA.body>
};