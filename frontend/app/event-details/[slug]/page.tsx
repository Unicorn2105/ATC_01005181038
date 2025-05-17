"use client";
import { UserContext } from "@/context/user-context";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Divider,
    Spinner,
    useDisclosure,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { use, useContext, useState } from "react";
import Image from "next/image";
import {
    BsCalendar2Minus,
    BsCurrencyDollar,
    BsGeoAlt,
    BsTag,
} from "react-icons/bs";
import { useRouter } from "next/navigation";
import ModalComponent from "@/components/modal";
import { EventMap } from "@/interface/event";

export default function EventDetails({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const router = useRouter();
    const { userToken } = useContext(UserContext);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState("success");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isBooking, setIsBooking] = useState(false);
    const handleBooking = async (eventObj: EventMap) => {
        if (!userToken) {
            onOpen();
            return;
        }
        setIsBooking(true);
        const config = {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        };
        try {
            const { data } = await axios.post(
                "/api/booking",
                { eventId: eventObj.id },
                config
            );
            setFeedbackMessage(data.result.message);
            setFeedbackType("success");
            console.log("Booking successful");
            router.push(
                `/booking-confirmation?eventId=${eventObj.id}&eventName=${encodeURIComponent(eventObj.name)}`
            );
        } catch (error: any) {
            setFeedbackMessage(
                error?.response?.data?.result?.message || "Booking failed"
            );
            setFeedbackType("error");
            console.log("Booking failed", error);
            setIsBooking(false);
        }
    };

    const fetchEventDeatails = async () => {
        const config = userToken
            ? { headers: { Authorization: `Bearer ${userToken}` } }
            : {};
        return axios.get(`/api/event/${slug}`, config);
    };
    const { data, isLoading, isError } = useQuery({
        queryKey: ["event-details", slug],
        queryFn: fetchEventDeatails,
    });
    const event = data?.data?.result?.data;
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size="lg" variant="spinner" />
            </div>
        );
    }
    if (isError) {
        return (
            <div className="text-center py-12">
                <div className="bg-red-100 p-4 rounded-lg max-w-lg mx-auto">
                    <h2 className="text-xl font-semibold text-red-800">
                        Error
                    </h2>
                    <p className="text-red-600">
                        Failed to load event details. Please try again later.
                    </p>
                </div>
            </div>
        );
    }
    if (!event) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Event details not available.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card key={event.id} shadow="lg" className="mb-4 group relative">
                <CardBody className="overflow-hidden p-0">
                    <div className="relative h-72">
                        <Image
                            alt={event.name}
                            className="w-full object-cover object-center h-full block"
                            src={`http://localhost:8000/${event.imageUrl}`}
                            width={1200}
                            height={400}
                        />
                        <div className="absolute top-0 right-0 bg-violet-800 text-white text-xs px-2 py-1 rounded-br-lg">
                            {event.category}
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h1 className="text-3xl font-bold light:text-gray-800 dark:text-gray-100">
                                {event.name}
                            </h1>
                            <div className="text-xl font-semibold text-violet-800">
                                ${event.price}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 mb-6">
                            <div className="flex items-center text-foreground-500">
                                <BsCalendar2Minus className="w-4 h-4 mr-2" />
                                <span>
                                    {" "}
                                    {event.eventDate &&
                                        new Date(
                                            event.eventDate
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                </span>
                            </div>

                            <div className="flex items-center text-foreground-500">
                                <BsGeoAlt className="w-4 h-4 mr-2" />
                                <span>{event.venue}</span>
                            </div>

                            <div className="flex items-center text-foreground-500">
                                <BsCurrencyDollar className="w-4 h-4 mr-2" />
                                <span>{event.price}</span>
                            </div>

                            <div className="flex items-center text-foreground-500">
                                <BsTag className="w-4 h-4 mr-2" />
                                <span>{event.category}</span>
                            </div>
                        </div>
                        <Divider className="my-4" />
                        <div className="my-6">
                            <h2 className="text-xl font-semibold mb-2">
                                About This Event
                            </h2>
                            <p className="light:text-gray-600 leading-relaxed dark:text-gray-400">
                                {event.description}
                            </p>
                        </div>
                        <div className="mt-8">
                            {event.isBooked ? (
                                <Button
                                    radius="full"
                                    className="w-full bg-green-600 text-white font-bold py-3"
                                    disabled
                                >
                                    Booked
                                </Button>
                            ) : (
                                <Button
                                    radius="full"
                                    className="w-full bg-violet-800 hover:bg-violet-900 text-white font-bold py-3 transform transition-transform duration-300 hover:scale-105"
                                    onPress={() => handleBooking(event)}
                                >
                                    {isBooking ? (
                                        <>
                                            <Spinner size="sm" color="white" />
                                            <span className="ml-2">
                                                Processing...
                                            </span>
                                        </>
                                    ) : (
                                        "Book Now"
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="light:bg-gray-50 border-t light:border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <Button
                        radius="full"
                        variant="light"
                        className="border border-gray-300"
                        onPress={() => router.push("/")}
                    >
                        Back to Events
                    </Button>
                    {feedbackMessage && (
                        <div
                            className={`text-sm ${feedbackType === "success" ? "text-green-600" : "text-red-600"}`}
                        >
                            {feedbackMessage}
                        </div>
                    )}
                </CardFooter>
            </Card>
            <ModalComponent isOpen={isOpen} onOpenChange={onOpenChange} />
        </div>
    );
}
