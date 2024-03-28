"use client";
import { createContext, useContext, useMemo } from "react";
import { useSocket } from "./socketContext";
import { useSocketAuth } from "@/hook/useSocketAuth";
import { usePasswordProtect } from "@/hook/usePasswordProtect";

const teamConnexionContext = createContext();
const TeamConnexionProvider = ({ children }) => {
    const { teamSocket } = useSocket();
    const { login, password: teamId, loggedIn, loading } = useSocketAuth(teamSocket, "team_password");
    const useProtect = () => usePasswordProtect("/team", "/team/track", loading, loggedIn);

    const value = useMemo(() => ({ teamId, login, loggedIn, loading, useProtect}), [teamId, login, loggedIn, loading]);

    return (
        <teamConnexionContext.Provider value={value}>
            {children}
        </teamConnexionContext.Provider>
    );
}

function useTeamConnexion() {
    return useContext(teamConnexionContext);
}

export { TeamConnexionProvider, useTeamConnexion };

