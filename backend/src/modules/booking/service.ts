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
        const { eventId } = req.body;
        const userId = req.user?.id;

        if (!eventId || !userId) {
            return next(new RequestError("Missing event ID or user ID", 400));
        }

        const event = await EventRepository.findOne({ where: { id: eventId } });

        if (!event) {
            return next(new RequestError("Event not found", 404));
        }

        const existingBooking = await BookingRepository.findOne({
            where: {
                user: { id: userId },
                event: { id: eventId },
            },
        });

        if (existingBooking) {
            return next(
                new RequestError("You have already booked this event", 400)
            );
        }

        const booking = BookingRepository.create({
            user: { id: userId },
            event: { id: eventId },
            bookedAt: new Date(),
            status: "Booked",
        });

        await BookingRepository.save(booking);

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
