"use client";

import { Spinner } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransitionSpinner() {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 500);

        return () => clearTimeout(timeout);
    }, [pathname]);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-50 bg-white/70 dark:bg-black/70 flex items-center justify-center">
            <Spinner size="lg" />
        </div>
    );
}
