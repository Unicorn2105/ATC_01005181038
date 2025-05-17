"use client";

import { UserContext } from "@/context/user-context";
import { EventMap } from "@/interface/event";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { BsReverseListColumnsReverse } from "react-icons/bs";
interface CategoryDropdownProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

export default function CategoryDropdown({
    selectedCategory,
    onCategoryChange,
}: CategoryDropdownProps) {
    const getCategoryDisplayText = () =>
        selectedCategory === "" ? "All Categories" : selectedCategory;
    const { userToken } = useContext(UserContext);
    const getEvent = async () => {
        const config = userToken
            ? { headers: { Authorization: `Bearer ${userToken}` } }
            : {};
        return axios.get("api/event", config);
    };
    const { data } = useQuery({
        queryKey: ["events"],
        queryFn: getEvent,
    });
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button variant="flat" className="flex items-center gap-2">
                    <BsReverseListColumnsReverse className="w-4 h-4" />
                    {getCategoryDisplayText()}
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Category options">
                {/* Add "All Categories" option */}
                <DropdownItem key="all" onClick={() => onCategoryChange("")}>
                    All Categories
                </DropdownItem>
                {/* Render unique categories */}
                {data?.data?.result?.data
                    .reduce((uniqueCategories: string[], event: EventMap) => {
                        if (!uniqueCategories.includes(event.category)) {
                            uniqueCategories.push(event.category);
                        }
                        return uniqueCategories;
                    }, [])
                    .map((category: string) => (
                        <DropdownItem
                            key={category}
                            onClick={() => onCategoryChange(category)}
                        >
                            {category}
                        </DropdownItem>
                    ))}
            </DropdownMenu>
        </Dropdown>
    );
}
