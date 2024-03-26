"use client";
import { createContext, useContext, useState } from "react";

const adminContext = createContext();

function AdminProvider({children}) {
    const [teams, setTeams] = useState([]);
    const [started, setStarted] = useState(false);
    return (
        <adminContext.Provider value={{teams, setTeams, started, setStarted}}>
            {children}
        </adminContext.Provider>
    );
}

function useAdminContext() {
    return useContext(adminContext);
}

export { AdminProvider, useAdminContext };