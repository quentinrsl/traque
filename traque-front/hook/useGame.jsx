"use client";

import { useSocket } from "@/context/socketContext";
import { useTeamConnexion } from "@/context/teamConnexionContext";
import { useTeamContext } from "@/context/teamContext";

export default function useGame() {
    const {teamSocket} = useSocket();
    const {teamId} = useTeamConnexion();
    const {currentPosition, enemyPosition} = useTeamContext();

    function sendCurrentPosition() {
        teamSocket.emit("send_position");
    }


    return { sendCurrentPosition, enemyPosition, currentPosition, teamId };
}