"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { useSocket } from "./socketContext";
import { useSocketListener } from "@/hook/useSocketListener";

const teamConnexionContext = createContext();
const TeamConnexionProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [teamId, setTeamId] = useState(null);
    const { teamSocket } = useSocket();
    
    function login(id) {
        teamSocket.emit("login", id);
        setTeamId(id);
    }
    
    useSocketListener(teamSocket, "login_response", setLoggedIn);

    const value = useMemo(() => ({ teamId, login, loggedIn }), [teamId, login, loggedIn]);
    
    return (
        <teamConnexionContext.Provider value={value}>
        {children}
        </teamConnexionContext.Provider>
    );
}

function useTeamConnexion() {
    return useContext(teamConnexionContext);
}

export { TeamConnexionProvider, useTeamConnexion};

