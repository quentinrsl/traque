"use client";
import { useLocation } from "@/hook/useLocation";
import { useSocketListener } from "@/hook/useSocketListener";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSocket } from "./socketContext";
import { useTeamConnexion } from "./teamConnexionContext";
import { GameState } from "@/util/gameState";


const teamContext = createContext()
function TeamProvider({children}) {
    const [teamInfos, setTeamInfos] = useState({});
    const [gameState, setGameState] = useState(GameState.SETUP);
    const measuredLocation = useLocation(10000);
    const {teamSocket} = useSocket();
    const {loggedIn} = useTeamConnexion();
    const teamInfosRef = useRef();

    teamInfosRef.current = teamInfos;

    useSocketListener(teamSocket, "update_team", (newTeamInfos) => {
        setTeamInfos({...teamInfosRef.current, ...newTeamInfos});
    });
    
    useSocketListener(teamSocket, "game_state", setGameState);

    //Send the current position to the server when the user is logged in
    useEffect(() => {
        console.log("sending position", measuredLocation);
        if(loggedIn) {
            teamSocket.emit("update_position", measuredLocation);
        }
    }, [loggedIn, measuredLocation]);
    
    const value = useMemo(() => ({teamInfos, gameState}), [teamInfos, gameState]);
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