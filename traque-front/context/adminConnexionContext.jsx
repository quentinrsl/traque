"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { useSocket } from "./socketContext";
import { useSocketListener } from "@/hook/useSocketListener";

const adminContext = createContext();
const AdminConnexionProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const { adminSocket } = useSocket();

    function login(password) {
        adminSocket.emit("login", password);
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

