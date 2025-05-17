"use client";

import { EventMap } from "@/interface/event";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Chip,
    Divider,
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    BsCalendarEvent,
    BsGeoAlt,
    BsCurrencyDollar,
    BsTag,
} from "react-icons/bs";

export default function ModelDetails({
    isOpen,
    onClose,
    event,
}: {
    isOpen: boolean;
    onClose: () => void;
    event: EventMap;
}) {
    // Format the date nicely
    const formattedDate = event?.eventDate
        ? new Date(event.eventDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
          })
        : "";
    const router = useRouter();
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {event?.name}
                    </h2>
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-4">
                        {/* Image Section */}
                        <div className="relative w-full h-64 rounded-lg overflow-hidden">
                            {event?.imageUrl ? (
                                <Image
                                    alt={event.name}
                                    className="w-full object-cover object-center h-full block"
                                    src={`http://localhost:8000/${event.imageUrl}`}
                                    width={700}
                                    height={300}
                                    priority
                                />
                            ) : (
                                <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                                    <p className="text-gray-500">
                                        No image available
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <BsCalendarEvent className="text-violet-600 text-lg" />
                                    <div>
                                        <p className="text-gray-900 font-medium">
                                            {formattedDate}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <BsGeoAlt className="text-violet-600 text-lg" />
                                    <div>
                                        <p className="text-gray-900 font-medium">
                                            {event?.venue || "Not specified"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <BsCurrencyDollar className="text-violet-600 text-lg" />
                                    <div>
                                        <p className="text-gray-900 font-medium">
                                            {event?.price}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <BsTag className="text-violet-600 text-lg" />
                                    <div>
                                        <p className="text-gray-900 font-medium capitalize">
                                            {event?.category}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Description
                            </h3>
                            <Divider className="mb-3" />
                            <p className="text-gray-700 leading-relaxed">
                                {event?.description ||
                                    "No description available for this event."}
                            </p>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        onPress={() => router.push(`/update-event/${event.id}`)}
                        variant="solid"
                        className="w-full sm:w-auto bg-violet-800 text-white hover:bg-violet-700"
                    >
                        Edit
                    </Button>
                    <Button
                        variant="flat"
                        color="default"
                        onPress={onClose}
                        className="w-full sm:w-auto"
                    >
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
