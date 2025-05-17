import { EventMap } from "./event";
export interface Booking {
    id: number;
    bookedAt: string;
    status: string;
    event: Omit<EventMap, "isBooked">;
}
