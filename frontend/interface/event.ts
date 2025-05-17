export interface EventMap {
    id: number;
    name: string;
    description: string;
    category: string;
    eventDate: string;
    venue: string;
    price: number;
    imageUrl: string;
    isActive: boolean;
    isBooked: boolean;
}
export interface EventFormValues {
    id: number;
    name: string;
    description: string;
    category: string;
    eventDate: string;
    venue: string;
    price: number;
    imageUrl: string;
    isActive: boolean;
}
