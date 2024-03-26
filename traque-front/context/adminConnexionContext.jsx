"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSocket } from "./socketContext";
import { useSocketListener } from "@/hook/useSocketListener";
import { useLocalStorage } from "@/hook/useLocalStorage";

const adminContext = createContext();
const AdminConnexionProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [savedPassword, setSavedPassword] = useLocalStorage("admin_password", null);
    const { adminSocket } = useSocket();

    useEffect(() => {
        if (savedPassword && !loggedIn) {
            adminSocket.emit("login", savedPassword);
        }
    }, [savedPassword]);

    function login(password) {
        setSavedPassword(password)
    }

    useSocketListener(adminSocket, "login_response", setLoggedIn);

    const value = useMemo(() => ({ login, loggedIn }), [loggedIn]);

    return (
        <adminContext.Provider value={value}>
            {children}
        </adminContext.Provider>
    );
}

function useAdminConnexion() {
    return useContext(adminContext);
}

export { AdminConnexionProvider, useAdminConnexion };

