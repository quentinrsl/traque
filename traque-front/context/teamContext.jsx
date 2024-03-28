"use client";
import { useLocation } from "@/hook/useLocation";
import { useSocketListener } from "@/hook/useSocketListener";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSocket } from "./socketContext";
import { useTeamConnexion } from "./teamConnexionContext";

const teamContext = createContext()
function TeamProvider({children}) {
    const [enemyPosition, setEnemyPosition] = useState();
    const [currentPosition, setCurrentPosition] = useState();
    const measuredLocation = useLocation(10000);
    const {teamSocket} = useSocket();
    const {loggedIn} = useTeamConnexion();
    
    useSocketListener(teamSocket, "enemy_position", setEnemyPosition);
    useSocketListener(teamSocket, "live_location", setCurrentPosition);

    //Send the current position to the server when the user is logged in
    useEffect(() => {
        console.log("sending position", measuredLocation);
        if(loggedIn) {
            teamSocket.emit("update_position", measuredLocation);
        }
    }, [loggedIn, measuredLocation]);
    
    const value = useMemo(() => ({enemyPosition, currentPosition}), [enemyPosition, currentPosition]);
    return (
        <teamContext.Provider value={value}>
            {children}
        </teamContext.Provider>
    );
}

function useTeamContext() {
    return useContext(teamContext);
}

export { TeamProvider, useTeamContext };