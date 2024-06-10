"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSocket } from "./socketContext";
import { useSocketListener } from "@/hook/useSocketListener";
import { useAdminConnexion } from "./adminConnexionContext";
import { GameState } from "@/util/gameState";

const adminContext = createContext();

function AdminProvider({ children }) {
    const [teams, setTeams] = useState([]);
    const [zoneSettings, setZoneSettings] = useState(null)
    const [penaltySettings, setPenaltySettings] = useState(null);
    const [gameSettings, setGameSettings] = useState(null);
    const [zone, setZone] = useState(null);
    const [zoneExtremities, setZoneExtremities] = useState(null);
    const { adminSocket } = useSocket();
    const { loggedIn } = useAdminConnexion();
    const [gameState, setGameState] = useState(GameState.SETUP);

    useSocketListener(adminSocket, "game_state", setGameState);
    //Send a request to get the teams when the user logs in
    useEffect(() => {
        adminSocket.emit("get_teams");
    }, [loggedIn]);

    //Bind listeners to update the team list and the game status on socket message
    useSocketListener(adminSocket, "teams", setTeams);
    useSocketListener(adminSocket, "zone_settings", setZoneSettings);
    useSocketListener(adminSocket, "game_settings", setGameSettings);
    useSocketListener(adminSocket, "penalty_settings", setPenaltySettings);
    useSocketListener(adminSocket, "zone", setZone);
    useSocketListener(adminSocket, "new_zone", setZoneExtremities);

    const value = useMemo(() => ({ zone, zoneExtremities, teams, zoneSettings, penaltySettings, gameSettings, gameState }), [zoneSettings, teams, gameState, zone, zoneExtremities, penaltySettings, gameSettings]);
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