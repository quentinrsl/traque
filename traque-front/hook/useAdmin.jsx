import { useAdminContext } from "@/context/adminContext";
import { useSocket } from "@/context/socketContext";

export default function useAdmin(){
    const {teams, started } = useAdminContext();
    const {adminSocket} = useSocket();

    function pollTeams() {
        adminSocket.emit("get_teams");
    }

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

    return {teams, started, pollTeams, getTeam, getTeamName, reorderTeams, addTeam, removeTeam, startGame, stopGame, setTeamName };

}