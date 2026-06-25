
const FIND_USERS_IN_RANGE_SCHEMA = {
    params: {
        type: "object",
        properties: {
            user_id: { type: "string", format : "uuid"},
        },
        required: ["user_id"],
    },
    body: {
        type: "object",
        properties: {
            longitude: { type: "number" },
            latitude: { type: "number" },
        },
        required: ["longitude", "latitude"]
    }
} as const;

export { FIND_USERS_IN_RANGE_SCHEMA };