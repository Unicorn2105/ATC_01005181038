import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { Column, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Event } from "./event";
import { on } from "events";
@Entity({ name: "bookings" })
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.bookings)
    user: User;

    @ManyToOne(() => Event, (event) => event.bookings, { onDelete: "CASCADE" })
    event: Event;

    @Column("timestamp")
    bookedAt: Date;

    @Column({ default: "Booked" })
    status: string;
}
