import * as dotenv from "dotenv";

dotenv.config({ path: '.env' })

if (process.env.NODE_ENV !== "production") {
    dotenv.config({
        path: '.env.local',
        override: true
    });
}

