export interface EventMap {
    id: number;
    name: string;
    description: string;
    category: string;
    eventDate: string;
    venue: string;
    price: number;
    imageUrl: string;
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
}
export interface AddEvent {
    name: string;
    description: string;
    category: string;
    eventDate: string;
    venue: string;
    price: number;
    imageUrl: string;
}
