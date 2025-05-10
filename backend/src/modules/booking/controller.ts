import { Router } from "express";
import BookingService from "./service";
import { authMiddleware } from "../../middleware/authMiddleware";
const bookingRouter = Router();
bookingRouter.post("/", authMiddleware(), BookingService.createBooking);
bookingRouter.get("/", authMiddleware(), BookingService.getUserBookings);
bookingRouter.delete("/:id", authMiddleware(), BookingService.cancelBooking);
bookingRouter.get("/:id", authMiddleware(), BookingService.getBookingById);
export default bookingRouter;
