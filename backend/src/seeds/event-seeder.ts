import { AppDataSource } from "../data-source";
import EventRepository from "../repository/eventRepository";

const seedEvents = async () => {
    await AppDataSource.initialize();
    const events = [
        {
            name: "Modern Art Exhibition",
            description: "Explore contemporary art from emerging artists.",
            category: "Art",
            eventDate: new Date("2025-06-10"),
            venue: "Cairo Art Gallery",
            price: 50,
            imageUrl: "uploads/art2.jpg",
        },
        {
            name: "Drone Racing Championship",
            description: "Watch high-speed drone racing with stunning agility.",
            category: "Technology",
            eventDate: new Date("2025-08-20"),
            venue: "Giza Arena",
            price: 100,
            imageUrl: "uploads/drone.jpg",
        },
        {
            name: "Frontend Dev Conference",
            description: "All about modern frontend frameworks and UI design.",
            category: "Technology",
            eventDate: new Date("2025-09-01"),
            venue: "Smart Village, Cairo",
            price: 120,
            imageUrl: "uploads/frontend.jpg",
        },
        {
            name: "Health & Wellness Fair",
            description: "Workshops and talks about fitness and wellbeing.",
            category: "Health",
            eventDate: new Date("2025-06-22"),
            venue: "October Sports Club",
            price: 60,
            imageUrl: "uploads/health.jpg",
        },
        {
            name: "Journal Club",
            description: "Enhance your skills by joining our journal club.",
            category: "Education",
            eventDate: new Date("2025-08-10"),
            venue: "Zayed",
            price: 80,
            imageUrl: "uploads/journal.jpg",
        },
        {
            name: "Software Testing Bootcamp",
            description: "Master unit testing, automation, and QA tools.",
            category: "Technology",
            eventDate: new Date("2025-07-25"),
            venue: "ITI Smart Village",
            price: 90,
            imageUrl: "uploads/testing.jpeg",
        },
    ];
    await EventRepository.insert(events);
    console.log("✅ Events seeded successfully!");
    process.exit(0);
};

seedEvents().catch((err) => {
    console.error("❌ Error seeding events:", err);
    process.exit(1);
});
