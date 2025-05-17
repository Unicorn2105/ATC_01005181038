"use client";

import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Spinner, Pagination } from "@heroui/react";
import { UserContext } from "@/context/user-context";
import { EventMap } from "@/interface/event";
import EventCard from "./event-card";
import SortDropdown from "./sort";
import CategoryDropdown from "./category-filter";
import { getSortAndOrder } from "@/utils/sortUtils";

export default function Event() {
    const { userToken } = useContext(UserContext);
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [sort, setSort] = useState("eventDate");
    const [order, setOrder] = useState("ASC");
    const [category, setCategory] = useState("");
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

    const fetchEvents = async () => {
        const config = userToken
            ? { headers: { Authorization: `Bearer ${userToken}` } }
            : {};
        return axios.get(
            `api/event?page=${page}&limit=${limit}&sort=${sort}&order=${order}&category=${category}`,
            config
        );
    };

    const { data, isLoading } = useQuery({
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

    const events = data?.data?.result?.data || [];
    const isEvents = events.length > 0;
    const totalPages = data?.data?.result?.lastPage || 1;
    const currentPage = data?.data?.result?.page || 1;
    const totalItems = data?.data?.result?.total || 0;

    return (
        <div className=" px-4 py-6 md:px-6 lg:px-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                    Events
                </h2>
                <p className="text-foreground-500">
                    Browse and book your event with us.
                </p>
            </div>

            <div className="flex flex-wrap justify-between gap-4 mb-4">
                <CategoryDropdown
                    selectedCategory={category}
                    onCategoryChange={handleCategoryChange}
                />
                <SortDropdown
                    sort={sort}
                    order={order}
                    onSortChange={handleSortChange}
                />
            </div>

            {isEvents ? (
                <>
                    <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-6">
                        {events.map((event: EventMap) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>

                    <div className="flex justify-center mt-6">
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
                    </div>

                    <div className="text-center mt-4 text-sm text-foreground-500">
                        Showing {events.length} of {totalItems} events
                    </div>
                </>
            ) : (
                <div className="text-center py-10">
                    <p className="text-foreground-500">
                        No events available at the moment.
                    </p>
                </div>
            )}
        </div>
    );
}
