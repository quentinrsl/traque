import { useAdminContext } from "@/context/adminContext";
import { useSocket } from "@/context/socketContext";
import { Underdog } from "next/font/google";

const { useEffect, useState } = require("react");

export default function useAdmin(){
    const {teams, setTeams, started, setStarted} = useAdminContext();
    const {adminSocket} = useSocket();

    function pollTeams() {
        adminSocket.emit("get_teams");
    }

    useEffect(() => {
        pollTeams();
    }, []);
    useEffect(() => {
        adminSocket.emit("get_teams");
        adminSocket.on("teams", setTeams);
        return () => {
            adminSocket.off("teams", setTeams);
        }
    }, []);

    function getTeam(teamId) {
        return teams.find(team => team.id === teamId);
    }

    function getTeamName(teamId) {
        let team = getTeam(teamId);
        return team ? team.name : "";
    }

    function reorderTeams(newOrder) {
        adminSocket.emit("reorder_teams", newOrder);
    }

    function addTeam(teamName) {
        adminSocket.emit("add_team", teamName);
    }

    function removeTeam(teamId) {
        adminSocket.emit("remove_team", teamId);
    }

    function setTeamName(teamId, newName) {
        adminSocket.emit("rename_team", teamId, newName);
    }

    function startGame() {
        adminSocket.emit("start_game");
    }

    function stopGame() {
        adminSocket.emit("stop_game");
    }

    useState(() => {
        adminSocket.on("game_started", setStarted);
        return () => {
            adminSocket.off("game_started", setStarted);
        }
    }, []);

    return { teams, started, pollTeams, getTeam, getTeamName, reorderTeams, addTeam, removeTeam, startGame, stopGame, setTeamName };

}