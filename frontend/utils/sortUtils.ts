export function getSortAndOrder(sortOption: string): {
    sort: string;
    order: string;
} {
    switch (sortOption) {
        case "dateNewest":
            return { sort: "eventDate", order: "DESC" };
        case "dateOldest":
            return { sort: "eventDate", order: "ASC" };
        case "priceHighest":
            return { sort: "price", order: "DESC" };
        case "priceLowest":
            return { sort: "price", order: "ASC" };
        case "nameAZ":
            return { sort: "name", order: "ASC" };
        case "nameZA":
            return { sort: "name", order: "DESC" };
        default:
            return { sort: "eventDate", order: "ASC" };
    }
}
