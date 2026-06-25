

const TABLE_FETCH_SCHEMA = {
    body: {
        type: "object",
        properties: {
                table: {type: "string"},
                select: {
                    type: "array",
                    additionalProperties: true
                },
                joins: {
                    type: "array",
                    additionalProperties: true
                },
                where: {
                    type: "object",
                    additionalProperties: true
                },
                whereRaw: {type: "string"},
                whereIn: {
                    type: "object",
                    additionalProperties: true
                },
                whereBetween: {
                    type: "object",
                    additionalProperties: true
                },
                orderBy: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            column: {type: "string"},
                            direction: {
                                type: "string",
                                enum: ['asc', 'desc']
                            }
                        }
                    }
                },
                limit: {type: "number"},
                offset: {type: "number"}
        }

    },
} as const;

export { TABLE_FETCH_SCHEMA };