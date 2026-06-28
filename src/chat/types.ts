import type { FromSchema } from "json-schema-to-ts";
import type { CHAT_WITH_USER_SCHEMA } from "./schemas/chat-schemas";

export type CHAT_WITH_USER_SCHEMA_TYPE = {
    Body: FromSchema<typeof CHAT_WITH_USER_SCHEMA.body>
};