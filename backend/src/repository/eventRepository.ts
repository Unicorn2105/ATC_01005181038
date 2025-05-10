import { AppDataSource } from "../data-source";
import { Event } from "../models/event";

const EventRepository = AppDataSource.getRepository(Event);

export default EventRepository;
