"use client";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import { EventMap } from "@/interface/event";
import { BsCalendar2Minus, BsGeoAlt } from "react-icons/bs";
import { useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import ModalComponent from "./modal";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
interface EventCardProps {
    event: EventMap;
}

export default function EventCard({ event }: EventCardProps) {
    const router = useRouter();
    const { userToken } = useContext(UserContext);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState("success");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const handleBooking = async () => {
        if (!userToken) {
            onOpen();
            return;
        }
        if (isLoading) return;
        setIsLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        };
        try {
            const { data } = await axios.post(
                "api/booking",
                { eventId: event.id },
                config
            );
            setFeedbackMessage(data.result.message);
            setFeedbackType("success");
            console.log("Booking successful");
            router.push(
                `/booking-confirmation?eventId=${event.id}&eventName=${encodeURIComponent(event.name)}`
            );
        } catch (error: any) {
            setFeedbackMessage(
                error?.response?.data?.result?.message || "Booking failed"
            );
            setFeedbackType("error");
            console.log("Booking failed", error);
        }
    };
    return (
        <>
            <Link href={`/event-details/${event.id}`}>
                <Card
                    key={event.id}
                    shadow="lg"
                    className="mb-4 group relative"
                >
                    <CardBody className="overflow-hidden p-0">
                        <div className=" h-[180px] ">
                            <Image
                                alt={event.name}
                                className="w-full object-cover object-center h-full block"
                                src={`http://localhost:8000/${event.imageUrl}`}
                                width={500}
                                height={180}
                            />
                        </div>
                        {event.isBooked ? (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="bg-green-600 text-white font-bold py-2 px-6 rounded-full">
                                    Booked
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Button
                                    radius="full"
                                    className="bg-violet-800 hover:bg-primary-dark text-white font-bold py-2 px-6  transform transition-transform duration-300 hover:scale-105"
                                    disabled={isLoading}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleBooking();
                                    }}
                                >
                                    {isLoading ? "Booking..." : "Book Now"}
                                </Button>
                            </div>
                        )}

                        <div className="absolute top-0 right-0 bg-violet-800 text-white text-xs px-2 py-1 rounded-br-lg">
                            {event.category}
                        </div>
                    </CardBody>

                    <CardFooter className="text-small flex flex-col items-start">
                        <div className="flex justify-between w-full">
                            <b>{event.name}</b>
                            <p className="text-default-500">${event.price}</p>
                        </div>

                        <div className="w-full mt-2 text-sm text-foreground-500">
                            <p className="flex items-center">
                                <BsCalendar2Minus className="w-3 h-3 mr-1" />
                                {event.eventDate &&
                                    new Date(
                                        event.eventDate
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                            </p>
                            <p className="flex items-center mt-1">
                                <BsGeoAlt className="w-3 h-3 mr-1" />
                                {`${event.venue.slice(0, 30)}${
                                    event.venue.length > 30 ? "..." : ""
                                }`}
                            </p>
                        </div>
                    </CardFooter>
                </Card>
            </Link>
            <ModalComponent isOpen={isOpen} onOpenChange={onOpenChange} />
        </>
    );
}
