"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSocket } from "./socketContext";
import { useSocketListener } from "@/hook/useSocketListener";
import { useAdminConnexion } from "./adminConnexionContext";
import { GameState } from "@/util/gameState";

const adminContext = createContext();

function AdminProvider({children}) {
    const [teams, setTeams] = useState([]);
    const [zone, setZone] = useState(null)
    const { adminSocket } = useSocket();
    const {loggedIn} = useAdminConnexion();
    const [gameState, setGameState] = useState(GameState.SETUP);

    useSocketListener(adminSocket, "game_state", setGameState);
    //Send a request to get the teams when the user logs in
    useEffect(() => {
        adminSocket.emit("get_teams");
    }, [loggedIn]);

    //Bind listeners to update the team list and the game status on socket message
    useSocketListener(adminSocket, "teams", setTeams);
    useSocketListener(adminSocket, "zone", setZone);

    const value = useMemo(() => ({teams, zone, setZone, setTeams, gameState}), [zone,teams, gameState]);
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