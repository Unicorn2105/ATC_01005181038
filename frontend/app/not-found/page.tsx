"use client";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gray-50">
            <div className="text-center max-w-md mx-auto">
                <h1 className="text-9xl font-bold text-violet-800">404</h1>
                <h2 className="mt-6 text-3xl font-semibold text-gray-900">
                    Page Not Found
                </h2>
                <p className="mt-3 text-lg text-gray-600">
                    Sorry, we couldn't find the page you're looking for.
                </p>
                <p className="mt-3 text-lg text-gray-600">
                    It might have been removed, or the URL might be incorrect.
                </p>
                <Link href="/">
                    <Button
                        variant="solid"
                        radius="md"
                        className="mt-6 bg-violet-800 px-4 py-2 text-white font-semibold shadow-md hover:bg-violet-700"
                    >
                        Go to Homepage
                    </Button>
                </Link>
            </div>
        </div>
    );
}
