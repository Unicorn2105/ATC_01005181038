import { NextFunction, RequestHandler, Request, Response } from "express";
import {
    asyncHandler,
    RequestError,
} from "../../utils/errorHandler/errorHandler";
import { SuccessResponse } from "../../utils/responses/responses";
import BookingRepository from "../../repository/bookingRepository";
import EventRepository from "../../repository/eventRepository";

const createBooking: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { eventId, ticketCount } = req.body;
        const userId = req.user?.id;
        const event = await EventRepository.findOne({
            where: { id: eventId },
        });
        if (
            !event ||
            event.capacity === undefined ||
            event.capacity - event.bookedCount < ticketCount
        ) {
            next(new RequestError("Not enough tickets available", 400));
            return;
        }
        const booking = await BookingRepository.create({
            user: { id: userId },
            event: { id: eventId },
            ticketCount,
            bookedAt: new Date(),
            status: "Booked",
        });
        await BookingRepository.save(booking);
        await EventRepository.increment(
            { id: eventId },
            "bookedCount",
            ticketCount
        );
        SuccessResponse(res, {
            data: booking,
            message: "Booking created successfully",
        });
    }
);

const getUserBookings: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id;
        const bookings = await BookingRepository.find({
            where: { user: { id: userId } },
            relations: ["event"],
            order: { bookedAt: "DESC" },
        });
        SuccessResponse(res, {
            data: bookings,
            message: "Bookings fetched successfully",
        });
    }
);

const cancelBooking: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const bookingId = parseInt(req.params.id);
        const booking = await BookingRepository.findOne({
            where: { id: bookingId },
            relations: ["event"],
        });
        if (!booking) {
            next(new RequestError("Booking not found", 404));
            return;
        }
        await BookingRepository.remove(booking);
        await EventRepository.decrement(
            { id: booking.event.id },
            "bookedCount",
            booking.ticketCount
        );

        SuccessResponse(res, {
            message: "Booking cancelled successfully",
        });
    }
);
const getBookingById: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const bookingId = parseInt(req.params.id);
        const booking = await BookingRepository.findOne({
            where: { id: bookingId },
            relations: ["event", "user"],
        });
        if (!booking) {
            next(new RequestError("Booking not found", 404));
            return;
        }
        SuccessResponse(res, {
            data: booking,
            message: "Booking fetched successfully",
        });
    }
);
export default {
    createBooking,
    getUserBookings,
    cancelBooking,
    getBookingById,
};
