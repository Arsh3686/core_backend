const config = {
    PSQL_DB: {
        client: "pg",
        connection: {
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 5432,
            user: process.env.DB_USER || "postgres",
            password: process.env.DB_PASSWORD || "root",
            database: process.env.DB_NAME || "Amora",
        },
    }
}

export default config;