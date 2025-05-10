import { AppDataSource } from "../data-source";
import { Booking } from "../models/booking";

const BookingRepository = AppDataSource.getRepository(Booking);

export default BookingRepository;
