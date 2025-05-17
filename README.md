# Booking Website Frontend

This is the frontend for the Booking Website, built with Next.js, Tailwind CSS, and HeroUI.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

## Setup Instructions

1. **Install dependencies**

    ```bash
    npm install
    ```

2. **Run the development server**

    ```bash
    npm run dev
    ```

    The app will be available at [http://localhost:3000](http://localhost:3000).

## Technologies Used

- Next.js 14
- HeroUI v2
- Tailwind CSS
- TypeScript
- Framer Motion
- next-themes



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
git clone https://github.com/Unicorn2105/ATC_01005181038.git
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
