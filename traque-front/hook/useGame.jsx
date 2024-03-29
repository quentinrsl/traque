"use client";

import { useSocket } from "@/context/socketContext";
import { useTeamConnexion } from "@/context/teamConnexionContext";
import { useTeamContext } from "@/context/teamContext";
import { useEffect } from "react";

export default function useGame() {
    const { teamSocket } = useSocket();
    const { teamId } = useTeamConnexion();
    const { teamInfos, gameState } = useTeamContext();

    function sendCurrentPosition() {
        teamSocket.emit("send_position");
    }

    useEffect(() => console.log("teamInfos", teamInfos), [teamInfos]);


    return {
        sendCurrentPosition,
        enemyPosition: teamInfos?.enemyLocation || null,
        currentPosition: teamInfos?.currentLocation || null,
        startingArea: teamInfos?.startingArea || null,
        captureCode: teamInfos?.captureCode || null,
        name: teamInfos?.name || null,
        ready: teamInfos?.ready || false,
        teamId,
        gameState,
    };
}