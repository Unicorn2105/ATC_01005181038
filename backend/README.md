# Booking Website Backend

This is the backend for the Booking Website, built with Node.js, Express, and PostgreSQL.

## Prerequisites

-   Node.js (v18 or higher recommended)
-   npm
-   PostgreSQL database (local or cloud)
-   Docker (optional, for containerized setup)

## Setup Instructions

### Clone the repository

```bash
git clone https://github.com/Unicorn2105/Booking-Website.git
cd Booking-Website/backend
```

#### Run With Docker

```bash
docker-compose up --build
```

This will start both the backend and a PostgreSQL database.

### API Endpoints

-   Auth: `/api/auth`
-   Events: `/api/event`
-   Bookings: `/api/booking`

## Notes

-   On first run, an admin user will be created using `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
