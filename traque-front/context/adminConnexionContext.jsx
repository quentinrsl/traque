"use client";
import { createContext, useContext, useState } from "react";
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

    return (
        <adminContext.Provider value={{ login, loggedIn }}>
            {children}
        </adminContext.Provider>
    );
}

function useAdminConnexion() {
    return useContext(adminContext);
}

export { AdminConnexionProvider, useAdminConnexion };

