import { Entity, OneToMany } from "typeorm";
import { Column, PrimaryGeneratedColumn } from "typeorm";
import { Booking } from "./booking";
@Entity({ name: "events" })
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @Column()
    category: string;

    @Column("timestamp")
    eventDate: Date;

    @Column()
    venue: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price: number;

    @Column({ nullable: true })
    imageUrl: string;

    @OneToMany(() => Booking, (booking) => booking.event, {
        onDelete: "CASCADE",
    })
    bookings: Booking[];
}
