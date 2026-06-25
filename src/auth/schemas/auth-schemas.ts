const CREATE_USER_SCHEMA = {
    body: {
        type: "object",
        properties: {
            username: { type: "string", minLength: 3 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
        },
        required: ["username", "email", "password"],
    },
} as const;

const LOGIN_USER_SCHEMA = {
    body: {
        type: "object",
        properties: {
            username: { type: "string", minLength: 3 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
        },
        anyOf: [{ required: ["username"] }, { required: ["email"] }],
        required: ["password"],
    },
} as const;

const ME_USER_SCHEMA = {
    body: {
        type: "object",
    },
} as const;

const FORGET_PASSWORD_SCHEMA = {
    body: {
        type: "object",
        properties: {
            email: { type: "string", format: "email" },
            username: { type: "string", minLength: 3 },
        },
        required: ["email", "username"],
    },
} as const;

const RESET_PASSWORD_SCHEMA = {
    body: {
        type: "object",
        properties: {
            otp: { type: "string", minLength: 6 },
            password: { type: "string", minLength: 6 },
            username: { type: "string", minLength: 3 },
        },
        required: ["otp", "username", "password"],
    },
} as const;

export { CREATE_USER_SCHEMA, LOGIN_USER_SCHEMA, ME_USER_SCHEMA, FORGET_PASSWORD_SCHEMA, RESET_PASSWORD_SCHEMA };