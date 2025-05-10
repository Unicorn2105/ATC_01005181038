import { DataSource } from "typeorm";
import { User } from "./models/user";
import "./env";
import { Booking } from "./models/booking";
import { Event } from "./models/event";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.DB_SYNCHRONIZE === "true",
    logging: process.env.DB_LOGGING === "true",
    entities: [User, Event, Booking],
    subscribers: [],
    migrations: [],
});
