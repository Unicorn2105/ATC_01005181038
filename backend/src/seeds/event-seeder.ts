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
            imageUrl: "uploads/art1.jpg",
            isActive: true,
            capacity: 100,
            bookedCount: 0,
        },
        {
            name: "Visual Arts Showcase",
            description: "A gallery of visual storytelling and design.",
            category: "Art",
            eventDate: new Date("2025-07-05"),
            venue: "Zamalek Cultural Center",
            price: 40,
            imageUrl: "uploads/art2.jpg",
            isActive: true,
            capacity: 80,
            bookedCount: 0,
        },
        {
            name: "Drone Racing Championship",
            description: "Watch high-speed drone racing with stunning agility.",
            category: "Technology",
            eventDate: new Date("2025-08-20"),
            venue: "Giza Arena",
            price: 100,
            imageUrl: "uploads/drone.jpg",
            isActive: true,
            capacity: 150,
            bookedCount: 0,
        },
        {
            name: "Frontend Dev Conference",
            description: "All about modern frontend frameworks and UI design.",
            category: "Technology",
            eventDate: new Date("2025-09-01"),
            venue: "Smart Village, Cairo",
            price: 120,
            imageUrl: "uploads/frontend.jpg",
            isActive: true,
            capacity: 200,
            bookedCount: 0,
        },
        {
            name: "Health & Wellness Fair",
            description: "Workshops and talks about fitness and wellbeing.",
            category: "Health",
            eventDate: new Date("2025-06-22"),
            venue: "October Sports Club",
            price: 60,
            imageUrl: "uploads/health.jpg",
            isActive: true,
            capacity: 200,
            bookedCount: 0,
        },
        {
            name: "Healthy Living Expo",
            description:
                "Explore new trends in diet, health tech, and mental health.",
            category: "Health",
            eventDate: new Date("2025-07-15"),
            venue: "Maadi Wellness Center",
            price: 70,
            imageUrl: "uploads/health2.png",
            isActive: true,
            capacity: 180,
            bookedCount: 0,
        },
        {
            name: "AI Research Journal Forum",
            description: "Discuss latest AI research and publications.",
            category: "Education",
            eventDate: new Date("2025-08-10"),
            venue: "Faculty of Computers and Information, Cairo University",
            price: 80,
            imageUrl: "uploads/journal.jpg",
            isActive: true,
            capacity: 90,
            bookedCount: 0,
        },
        {
            name: "Scientific Publishing Workshop",
            description:
                "Improve your research writing and journal submission skills.",
            category: "Education",
            eventDate: new Date("2025-09-05"),
            venue: "AUC New Cairo",
            price: 65,
            imageUrl: "uploads/journal2.jpeg",
            isActive: true,
            capacity: 75,
            bookedCount: 0,
        },
        {
            name: "Software Testing Bootcamp",
            description: "Master unit testing, automation, and QA tools.",
            category: "Technology",
            eventDate: new Date("2025-07-25"),
            venue: "ITI Smart Village",
            price: 90,
            imageUrl: "uploads/testing.jpeg",
            isActive: true,
            capacity: 100,
            bookedCount: 0,
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
