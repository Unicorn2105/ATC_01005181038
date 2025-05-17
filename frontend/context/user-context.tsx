"use client";
import { Spinner } from "@heroui/react";
import { createContext, ReactNode, useEffect, useState } from "react";
export const UserContext = createContext<UserContextType>({
    userToken: null,
    setUserToken: () => {},
    userEmail: null,
    setUserEmail: () => {},
    isLoading: true,
    role: null,
    setRole: () => {},
});

export function UserContextProvider({ children }: { children: ReactNode }) {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        const email = localStorage.getItem("userEmail");
        const role = localStorage.getItem("role");
        if (token) setUserToken(token);
        if (email) setUserEmail(email);
        if (role) setRole(role);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size="lg" variant="spinner" />
            </div>
        );
    }

    return (
        <UserContext.Provider
            value={{
                userToken,
                setUserToken,
                userEmail,
                setUserEmail,
                isLoading,
                role,
                setRole,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
