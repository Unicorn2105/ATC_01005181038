"use client";
import { UserContext } from "@/context/user-context";
import { getSortAndOrder } from "@/utils/sortUtils";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Chip,
    Tooltip,
    ChipProps,
    Spinner,
    Card,
    CardBody,
    CardHeader,
    Button,
    Pagination,
    useDisclosure,
} from "@heroui/react";
import SortDropdown from "@/components/sort";
import CategoryDropdown from "@/components/category-filter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import {
    BsEye,
    BsFillTrash3Fill,
    BsFilterSquare,
    BsPencilSquare,
    BsCheckCircleFill,
    BsXCircleFill,
} from "react-icons/bs";
import { EventMap } from "@/interface/event";
import DeleteModal from "@/components/delete-modal";
import ModelDetails from "@/components/details-modal";
import { useRouter } from "next/navigation";

export const columns = [
    { name: "NAME", uid: "name" },
    { name: "DATE", uid: "date" },
    { name: "CATEGORY", uid: "category" },
    { name: "PRICE", uid: "price" },
    { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
    concert: "primary",
    festival: "success",
    exhibition: "warning",
    conference: "danger",
};

export default function AdminPanel() {
    const { userToken } = useContext(UserContext);
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [sort, setSort] = useState("eventDate");
    const [order, setOrder] = useState("ASC");
    const [category, setCategory] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState<"success" | "error">(
        "success"
    );
    const [showFeedback, setShowFeedback] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<number | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventMap | null>(null);

    // Delete modal state
    const {
        isOpen: isDeleteModalOpen,
        onOpen: onOpenDeleteModal,
        onClose: onCloseDeleteModal,
    } = useDisclosure();

    // Details modal state
    const {
        isOpen: isDetailsModalOpen,
        onOpen: onOpenDetailsModal,
        onClose: onCloseDetailsModal,
    } = useDisclosure();

    const queryClient = useQueryClient();

    const handlePageChange = (newPage: number) => setPage(newPage);

    const handleSortChange = (sortOption: string) => {
        const { sort, order } = getSortAndOrder(sortOption);
        setSort(sort);
        setOrder(order);
        setPage(1);
    };

    const handleCategoryChange = (newCategory: string) => {
        setCategory(newCategory);
        setPage(1);
    };

    const confirmDelete = (eventId: number) => {
        setEventToDelete(eventId);
        onOpenDeleteModal();
    };

    const showEventDetails = (event: EventMap) => {
        setSelectedEvent(event);
        onOpenDetailsModal();
    };

    const handleDeleteEvent = async () => {
        if (!eventToDelete) return;

        try {
            const config = userToken
                ? { headers: { Authorization: `Bearer ${userToken}` } }
                : {};
            const { data } = await axios.delete(
                `api/event/${eventToDelete}`,
                config
            );

            setFeedbackMessage("Event successfully deleted!");
            setFeedbackType("success");
            setShowFeedback(true);

            // Close the modal
            onCloseDeleteModal();

            // Invalidate and refetch the events query to refresh the data
            queryClient.invalidateQueries({ queryKey: ["events"] });

            // Auto-hide feedback after 5 seconds
            setTimeout(() => {
                setShowFeedback(false);
            }, 5000);
        } catch (error: any) {
            console.error("Error deleting event:", error);
            setFeedbackMessage(
                error?.response?.data?.result?.message ||
                    "Failed to delete event. Please try again."
            );
            setFeedbackType("error");
            setShowFeedback(true);
            onCloseDeleteModal();

            // Auto-hide feedback after 5 seconds
            setTimeout(() => {
                setShowFeedback(false);
            }, 5000);
        }
    };

    const fetchEvents = async () => {
        const config = userToken
            ? { headers: { Authorization: `Bearer ${userToken}` } }
            : {};
        return axios.get(
            `api/event?page=${page}&limit=${limit}&sort=${sort}&order=${order}&category=${category}`,
            config
        );
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["events", page, limit, sort, order, category],
        queryFn: fetchEvents,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size="lg" variant="spinner" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card className="w-full max-w-lg bg-red-50">
                    <CardBody>
                        <p className="text-center text-red-600">
                            Failed to load events. Please try again later.
                        </p>
                    </CardBody>
                </Card>
            </div>
        );
    }

    const events = data?.data?.result?.data || [];
    const isEvents = events.length > 0;
    const totalPages = data?.data?.result?.lastPage || 1;
    const currentPage = data?.data?.result?.page || 1;
    const totalItems = data?.data?.result?.total || 0;

    return (
        <div className="px-4 py-6 md:px-6 lg:px-28">
            {showFeedback && (
                <div
                    className={`mb-4 p-4 rounded-md flex items-center justify-between ${
                        feedbackType === "success"
                            ? "bg-green-50 text-green-800"
                            : "bg-red-50 text-red-800"
                    }`}
                >
                    <div className="flex items-center">
                        {feedbackType === "success" ? (
                            <BsCheckCircleFill className="mr-2 text-green-500" />
                        ) : (
                            <BsXCircleFill className="mr-2 text-red-500" />
                        )}
                        {feedbackMessage}
                    </div>
                    <button
                        onClick={() => setShowFeedback(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>
            )}

            <Card className="shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="light:bg-gray-50 border-b light:border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <h2 className="text-2xl font-bold light:text-gray-800 dark:text-gray-100">
                            Event Management
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                ({totalItems} events)
                            </span>
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-3 justify-end w-full md:w-auto">
                            <CategoryDropdown
                                selectedCategory={category}
                                onCategoryChange={handleCategoryChange}
                            />
                            <SortDropdown
                                sort={sort}
                                order={order}
                                onSortChange={handleSortChange}
                            />
                            <Button color="success">Add New Event</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="p-0">
                    <Table aria-label="Events table" className="min-w-full">
                        <TableHeader>
                            {columns.map((column) => (
                                <TableColumn
                                    key={column.uid}
                                    className="light:bg-gray-100 text-gray-800 dark:text-white font-medium px-6 py-3"
                                >
                                    {column.name}
                                </TableColumn>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isEvents ? (
                                events.map((event: EventMap) => (
                                    <TableRow
                                        key={event.id}
                                        className="border-b dark:border-gray-800 light:hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <TableCell className="px-6 py-4">
                                            <div className="font-medium light:text-gray-900 dark:text-gray-100">
                                                {event.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {new Date(
                                                event.eventDate
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Chip
                                                color={
                                                    statusColorMap[
                                                        event.category
                                                    ] || "default"
                                                }
                                                size="sm"
                                                variant="flat"
                                            >
                                                {event.category}
                                            </Chip>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            ${event.price}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <Tooltip content="View Details">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        className="text-blue-500"
                                                        onPress={() =>
                                                            showEventDetails(
                                                                event
                                                            )
                                                        }
                                                    >
                                                        <BsEye className="h-4 w-4" />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content="Edit Event">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        className="text-green-500"
                                                        onPress={() =>
                                                            router.push(
                                                                `/update-event/${event.id}`
                                                            )
                                                        }
                                                    >
                                                        <BsPencilSquare className="h-4 w-4" />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content="Delete Event">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        className="text-red-500"
                                                        onPress={() =>
                                                            confirmDelete(
                                                                event.id
                                                            )
                                                        }
                                                    >
                                                        <BsFillTrash3Fill className="h-4 w-4" />
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-12"
                                    >
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <BsFilterSquare className="h-12 w-12 mb-4" />
                                            <p className="text-lg">
                                                No events found
                                            </p>
                                            <p className="text-sm">
                                                Try adjusting your filters or
                                                adding new events
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
                {isEvents && (
                    <div className="flex flex-col items-center px-6 py-4 light:bg-white border-t light:border-gray-200 dark:border-gray-800">
                        <Pagination
                            total={totalPages}
                            initialPage={currentPage}
                            onChange={handlePageChange}
                            color="secondary"
                            variant="bordered"
                            classNames={{
                                item: "text-violet-800 hover:bg-violet-100",
                                cursor: "bg-violet-800 text-white",
                            }}
                            size="md"
                        />
                        <div className="text-center mt-4 text-sm text-gray-500">
                            Showing {events.length} of {totalItems} events
                        </div>
                    </div>
                )}
            </Card>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={onCloseDeleteModal}
                onDelete={handleDeleteEvent}
            />

            {/* Event Details Modal */}
            {selectedEvent && (
                <ModelDetails
                    isOpen={isDetailsModalOpen}
                    onClose={onCloseDetailsModal}
                    event={selectedEvent}
                />
            )}
        </div>
    );
}
