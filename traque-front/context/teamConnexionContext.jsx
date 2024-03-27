"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSocket } from "./socketContext";
import { useSocketListener } from "@/hook/useSocketListener";
import { useLocalStorage } from "@/hook/useLocalStorage";

const teamConnexionContext = createContext();
const TeamConnexionProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [teamId, setTeamId] = useLocalStorage("team_id", null);
    const { teamSocket } = useSocket();

    useEffect(() => {
        if (teamId && !loggedIn) {
            teamSocket.emit("login", teamId);
        }
    }, [teamId]);

    function login(id) {
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

