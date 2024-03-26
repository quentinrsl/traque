"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSocket } from "./socketContext";
import { useSocketListener } from "@/hook/useSocketListener";
import { useAdminConnexion } from "./adminConnexionContext";

const adminContext = createContext();

function AdminProvider({children}) {
    const [teams, setTeams] = useState([]);
    const [started, setStarted] = useState(false);
    const { adminSocket } = useSocket();
    const {loggedIn} = useAdminConnexion();

    //Send a request to get the teams when the user logs in
    useEffect(() => {
        adminSocket.emit("get_teams");
    }, [loggedIn]);

    //Bind listeners to update the team list and the game status on socket message
    useSocketListener(adminSocket, "teams", setTeams);
    useSocketListener(adminSocket, "game_started", setStarted);

    const value = useMemo(() => ({teams, setTeams, started, setStarted}), [teams, started]);
    return (
        <adminContext.Provider value={value}>
            {children}
        </adminContext.Provider>
    );
}

function useAdminContext() {
    return useContext(adminContext);
}

export { AdminProvider, useAdminContext };