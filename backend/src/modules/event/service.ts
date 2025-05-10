import { NextFunction, RequestHandler, Request, Response } from "express";
import {
    asyncHandler,
    RequestError,
} from "../../utils/errorHandler/errorHandler";
import EventRepository from "../../repository/eventRepository";
import BookingRepository from "../../repository/bookingRepository";
import { SuccessResponse } from "../../utils/responses/responses";
import upload from "../../utils/fileUploading/multerUpload";

const getAllEvents: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const category: string = (req.query.category as string) || "";
        const userId = req.user?.id;
        const page: number = parseInt(req.query.page as string) || 1;
        const limit: number = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const sort: string = (req.query.sort as string) || "eventDate";
        const order: "ASC" | "DESC" =
            req.query.order?.toString().toUpperCase() === "DESC"
                ? "DESC"
                : "ASC";
        let eventsQuery = EventRepository.createQueryBuilder("event").where(
            "event.isActive = :isActive",
            { isActive: true }
        );
        if (category) {
            eventsQuery = eventsQuery.andWhere("event.category = :category", {
                category,
            });
        }
        eventsQuery = eventsQuery
            .orderBy(`event.${sort}`, order)
            .skip(skip)
            .take(limit);
        const [events, total] = await eventsQuery.getManyAndCount();
        if (userId) {
            const userBookings = await BookingRepository.find({
                where: { user: { id: userId } },
                relations: ["event"],
            });
            const bookedEventIds = userBookings.map(
                (booking) => booking.event.id
            );
            const eventsWithBookingStatus = events.map((event) => ({
                ...event,
                isBooked: bookedEventIds.includes(event.id),
            }));
            SuccessResponse(res, {
                data: eventsWithBookingStatus,
                total,
                page,
                lastPage: Math.ceil(total / limit),
                message: "Events fetched successfully",
            });
            return;
        }
        SuccessResponse(res, {
            data: events,
            total,
            page,
            lastPage: Math.ceil(total / limit),
            message: "Events fetched successfully",
        });
    }
);

const getEventById: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const eventID = parseInt(req.params.id);
        const userId = req.user?.id;
        const event = await EventRepository.findOne({
            where: { id: eventID },
        });
        if (!event) {
            next(new RequestError("Event not found", 404));
            return;
        }
        let isBooked = false;
        if (userId) {
            const booking = await BookingRepository.findOne({
                where: { user: { id: userId }, event: { id: eventID } },
            });
            isBooked = !!booking;
        }

        SuccessResponse(res, {
            data: { ...event, isBooked },
            message: "Event fetched successfully",
        });
    }
);

const createEvent: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const eventData = req.body;

        if (req.file) {
            const fileExtension = req.file.originalname.split(".").pop();
            const currentDate = new Date().toISOString().split("T")[0];
            const uniqueFilename = `${currentDate}_${Date.now()}.${fileExtension}`;
            const filePath = `uploads/${uniqueFilename}`;
            eventData.imageUrl = filePath;
            const fs = require("fs");
            fs.renameSync(req.file.path, filePath);
        }

        const result = await EventRepository.insert(eventData);
        const newEvent = await EventRepository.findOne({
            where: { id: result.identifiers[0].id },
        });
        SuccessResponse(
            res,
            {
                data: newEvent,
                message: "Event created successfully",
            },
            201
        );
    }
);

const updateEvent: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const eventID = parseInt(req.params.id);
        const eventData = req.body;
        const result = await EventRepository.update(eventID, eventData);
        if (result.affected === 0) {
            next(new RequestError("Event not found", 404));
            return;
        }
        const updatedEvent = await EventRepository.findOne({
            where: { id: eventID },
        });
        SuccessResponse(res, {
            data: updatedEvent,
            message: "Event updated successfully",
        });
    }
);

const deleteEvent: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const eventID = parseInt(req.params.id);
        const result = await EventRepository.delete(eventID);
        if (result.affected === 0) {
            next(new RequestError("Event not found", 404));
            return;
        }
        SuccessResponse(res, {
            message: "Event deleted successfully",
        });
    }
);

export default {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
};
