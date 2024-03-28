"use client";
import { createContext, useContext, useEffect, useMemo, } from "react";
import { useSocket } from "./socketContext";
import { useSocketAuth } from "@/hook/useSocketAuth";
import { redirect, usePathname } from "next/navigation";
import { usePasswordProtect } from "@/hook/usePasswordProtect";

const adminConnexionContext = createContext();
const AdminConnexionProvider = ({ children }) => {
    const { adminSocket } = useSocket();
    const { login, loggedIn, loading } = useSocketAuth(adminSocket, "admin_password");
    const useProtect = () => usePasswordProtect("/admin/login", "/admin", loading, loggedIn);

    const value = useMemo(() => ({ login, loggedIn, loading, useProtect }), [loggedIn, loading]);

    return (
        <adminConnexionContext.Provider value={value}>
            {children}
        </adminConnexionContext.Provider>
    );
}

function useAdminConnexion() {
    return useContext(adminConnexionContext);
}

export { AdminConnexionProvider, useAdminConnexion };

