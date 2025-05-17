interface UserContextType {
    userToken: string | null;
    setUserToken: (token: string | null) => void;
    userEmail: string | null;
    setUserEmail: (email: string | null) => void;
    isLoading: boolean;
    role: string | null;
    setRole: (role: string | null) => void;
}
