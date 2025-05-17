// components/ProtectedRoute.tsx
"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/user-context";

interface Props {
    children: React.ReactNode;
    requiredRole?: "admin" | "user";
}

const ProtectedRoute = ({ children, requiredRole }: Props) => {
    const { userToken, role } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (!userToken) {
            router.push("/login");
        } else if (requiredRole && role !== requiredRole) {
            router.push("/not-found");
        }
    }, [userToken, role, requiredRole, router]);

    if (!userToken) return null;
    if (requiredRole && role !== requiredRole) return null;

    return <>{children}</>;
};

export default ProtectedRoute;
