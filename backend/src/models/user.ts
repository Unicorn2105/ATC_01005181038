import { Entity, OneToMany } from "typeorm";
import { Column, PrimaryGeneratedColumn } from "typeorm";
import { Booking } from "./booking";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password?: string;

    @Column({ enum: ["admin", "user"], default: "user" })
    role: string;

    @OneToMany(() => Booking, (booking) => booking.user, {
        onDelete: "CASCADE",
    })
    bookings: Booking[];
}
