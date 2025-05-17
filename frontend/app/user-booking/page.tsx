"use client";
import { UserContext } from "@/context/user-context";
import { Booking } from "@/interface/booking";
import {
    Accordion,
    AccordionItem,
    Badge,
    Button,
    Divider,
    Spinner,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import Image from "next/image";
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaCreditCard,
    FaClock,
    FaTicketAlt,
    FaRegCalendarCheck,
} from "react-icons/fa";
import { HiOutlineCalendar } from "react-icons/hi";
import {
    BsClockFill,
    BsCreditCardFill,
    BsFillMapFill,
    BsFillTicketDetailedFill,
    BsGeoAlt,
} from "react-icons/bs";
import { useRouter } from "next/navigation";
export default function UserBooking() {
    const { userToken } = useContext(UserContext);
    const router = useRouter();
    function fetchUserBooking() {
        const config = {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        };
        return axios.get("/api/booking", config);
    }

    const { data, isLoading } = useQuery({
        queryKey: ["user-booking"],
        queryFn: fetchUserBooking,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <Spinner
                        size="lg"
                        variant="spinner"
                        className="text-primary mx-auto"
                    />
                    <p className="mt-4 text-foreground-500">
                        Loading your bookings...
                    </p>
                </div>
            </div>
        );
    }

    const bookings = data?.data?.result?.data || [];
    const isBookings = bookings.length > 0;

    return (
        <div className="bg-gradient-to-b from-background to-background/50 min-h-screen">
            <div className="container mx-auto py-12 px-4 md:px-8 lg:px-16 xl:px-32">
                <h2 className="text-3xl font-bold text-foreground">
                    Your Bookings
                </h2>
                <p className="text-foreground-500 text-lg">
                    View and manage your upcoming events
                </p>
                <Divider className="my-6" />

                {isBookings ? (
                    <div className="space-y-6">
                        <Accordion className="shadow-sm rounded-xl overflow-hidden">
                            {bookings.map((booking: Booking) => (
                                <AccordionItem
                                    key={booking.id}
                                    aria-label={booking.event.name}
                                    subtitle={
                                        <div className="flex items-center gap-2 text-foreground-400">
                                            <BsClockFill size={14} />
                                            <span>Click to view details</span>
                                        </div>
                                    }
                                    title={
                                        <span className="font-semibold text-lg">
                                            {booking.event.name}
                                        </span>
                                    }
                                    className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                                    startContent={
                                        <div className="relative overflow-hidden rounded-lg">
                                            <Image
                                                src={`http://localhost:8000/${booking.event.imageUrl}`}
                                                alt={booking.event.name}
                                                width={120}
                                                height={120}
                                                className="w-20 h-20 object-cover object-center rounded-lg shadow-md"
                                            />
                                        </div>
                                    }
                                >
                                    <div className="bg-card/50 rounded-lg p-6 mt-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-foreground-500 uppercase tracking-wider mb-2">
                                                        Event Details
                                                    </h4>
                                                    <p className="text-foreground leading-relaxed">
                                                        {
                                                            booking.event
                                                                .description
                                                        }
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-3 text-foreground-600">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                                        <BsGeoAlt size={14} />
                                                    </div>
                                                    <span className="text-foreground">
                                                        {booking.event.venue}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex flex-col gap-3">
                                                    <h4 className="text-sm font-medium text-foreground-500 uppercase tracking-wider">
                                                        Booking Information
                                                    </h4>

                                                    <div className="flex items-center gap-3 text-foreground-600">
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                                            <BsFillTicketDetailedFill
                                                                size={14}
                                                            />
                                                        </div>
                                                        <span>
                                                            Booking ID:{" "}
                                                            <span className="text-foreground font-medium">
                                                                {booking.id}
                                                            </span>
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-foreground-600">
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                                            <BsCreditCardFill
                                                                size={14}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-foreground font-medium text-lg">
                                                                $
                                                                {
                                                                    booking
                                                                        .event
                                                                        .price
                                                                }
                                                            </span>
                                                            <span className="text-xs text-foreground-400">
                                                                Payment
                                                                completed
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                ) : (
                    <div className="bg-card rounded-xl p-10 text-center shadow-sm border border-border">
                        <div className="w-20 h-20 rounded-full bg-violet/10 flex items-center justify-center text-violet-800 mx-auto mb-6">
                            <HiOutlineCalendar size={50} />
                        </div>
                        <h3 className="text-2xl font-medium mb-3">
                            No bookings found
                        </h3>
                        <p className="text-foreground-500 max-w-md mx-auto mb-6">
                            You haven't booked any events yet. Browse our
                            catalog to find exciting events that match your
                            interests.
                        </p>
                        <Button
                            size="lg"
                            onPress={() => router.push("/")}
                            className="bg-violet-800  text-white"
                        >
                            Browse Events
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
