const CHAT_WITH_USER_SCHEMA = {
    body: {
        type: "object",
        properties: {
            message: { type: "string", minLength: 2, maxLength: 500 }
        },
        required: ["message"],
    },
} as const;

export { CHAT_WITH_USER_SCHEMA };