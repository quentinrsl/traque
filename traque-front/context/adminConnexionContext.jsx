"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./socketContext";

const adminContext = createContext();
const AdminConnexionProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const { adminSocket } = useSocket();
    
    function login(password) {
        adminSocket.emit("login", password);
    }
    
    useEffect(() => {
        function updateLoginStatus(status) {
        setLoggedIn(status);
        }
        adminSocket.on("login_response", updateLoginStatus);
    
        return () => {
        adminSocket.off("login_response", updateLoginStatus);
        };
    }, []);
    
    return (
        <adminContext.Provider value={{ login, loggedIn }}>
        {children}
        </adminContext.Provider>
    );
}

function useAdminConnexion() {
    return useContext(adminContext);
}

export { AdminConnexionProvider, useAdminConnexion};

