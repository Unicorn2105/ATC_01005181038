"use client";

import { useContext, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Spinner } from "@heroui/react";
import Link from "next/link";
import { BsCheckCircle } from "react-icons/bs";
import { UserContext } from "@/context/user-context";
import ProtectedRoute from "@/components/protected-route";

export default function BookingConfirmation() {
    const searchParams = useSearchParams();
    const eventId = searchParams.get("eventId");
    const eventName = searchParams.get("eventName");

    const { userToken, isLoading } = useContext(UserContext);
    const router = useRouter();
    useEffect(() => {
        if (!isLoading && (!eventId || !eventName || !userToken)) {
            router.push("/login");
        }
    }, [eventId, eventName, userToken, isLoading]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size="lg" variant="spinner" />
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen flex items-center justify-center light:bg-gray-50">
                <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800  rounded-lg shadow-lg text-center">
                    <div className="flex justify-center mb-6">
                        <div className="rounded-full bg-green-100 p-4">
                            <BsCheckCircle className="text-green-500 w-12 h-12" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold light:text-gray-800 dark:text-gray-100 mb-2">
                        Booking Confirmed!
                    </h1>
                    <p className="light:text-gray-600 dark:text-gray-400 mb-6">
                        Congratulations! You have successfully booked a ticket
                        to {eventName}.
                    </p>

                    <div className="light:bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                        <h2 className="font-medium light:text-gray-800 dark:text-gray-100 mb-2">
                            Booking Details
                        </h2>
                        <p className="light:text-gray-800 dark:text-gray-100 text-sm mb-1">
                            Event:{" "}
                            <span className="font-medium">{eventName}</span>
                        </p>
                        <p className="light:text-gray-600 dark:text-gray-400 text-sm">
                            Booking Reference:{" "}
                            <span className="font-medium">
                                #{eventId}-
                                {Math.floor(Math.random() * 10000)
                                    .toString()
                                    .padStart(4, "0")}
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <Link href="/user-booking">
                            <Button className="w-full bg-violet-800 text-white">
                                View My Bookings
                            </Button>
                        </Link>

                        <Link href="/">
                            <Button className="w-full bg-white border border-gray-300 text-gray-700">
                                Explore More Events
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
