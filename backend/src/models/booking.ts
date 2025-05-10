import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { Column, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Event } from "./event";
@Entity({ name: "bookings" })
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.bookings)
    user: User;

    @ManyToOne(() => Event, (event) => event.bookings)
    event: Event;

    @Column({ default: 1 })
    ticketCount: number;

    @Column("timestamp")
    bookedAt: Date;

    @Column({ default: "Booked" })
    status: string;
}
