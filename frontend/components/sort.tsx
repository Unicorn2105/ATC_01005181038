"use client";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@heroui/react";
import { BsSortUp } from "react-icons/bs";
interface SortDropdownProps {
    sort: string;
    order: string;
    onSortChange: (sortOption: string) => void;
}

export default function SortDropdown({
    sort,
    order,
    onSortChange,
}: SortDropdownProps) {
    const getSortDisplayText = () => {
        if (sort === "eventDate") {
            return order === "ASC"
                ? "Date (Oldest First)"
                : "Date (Newest First)";
        } else if (sort === "price") {
            return order === "ASC"
                ? "Price (Low to High)"
                : "Price (High to Low)";
        } else if (sort === "name") {
            return order === "ASC" ? "Name (A-Z)" : "Name (Z-A)";
        }
        return "Sort By";
    };

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button variant="flat" className="flex items-center gap-2">
                    <BsSortUp className="w-4 h-4" />
                    {getSortDisplayText()}
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Sort options">
                <DropdownItem
                    key="dateNewest"
                    onClick={() => onSortChange("dateNewest")}
                >
                    Date (Newest First)
                </DropdownItem>
                <DropdownItem
                    key="dateOldest"
                    onClick={() => onSortChange("dateOldest")}
                >
                    Date (Oldest First)
                </DropdownItem>
                <DropdownItem
                    key="priceHighest"
                    onClick={() => onSortChange("priceHighest")}
                >
                    Price (High to Low)
                </DropdownItem>
                <DropdownItem
                    key="priceLowest"
                    onClick={() => onSortChange("priceLowest")}
                >
                    Price (Low to High)
                </DropdownItem>
                <DropdownItem
                    key="nameAZ"
                    onClick={() => onSortChange("nameAZ")}
                >
                    Name (A-Z)
                </DropdownItem>
                <DropdownItem
                    key="nameZA"
                    onClick={() => onSortChange("nameZA")}
                >
                    Name (Z-A)
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
