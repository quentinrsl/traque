import { game } from ".";
import { sendUpdatedTeamInformations, teamBroadcast } from "./team_socket";

export class PenaltyController {
    constructor(game) {

    }

    addPenalty(teamId) {
        let team = game.getTeam(teamId);
        if(team.captured) {
            return;
        }
        team.penalties++;
        if(team.penalties == game.MAX_PENALTIES) {
            game.requestCapture(team.chased);
            sendUpdatedTeamInformations(teamId);
            sendUpdatedTeamInformations(team.chased);
            teamBroadcast(teamId, "warning", "You have been eliminated (reason: too many penalties)")
            teamBroadcast(team.chased, "success", "The team you are chasing has changed")
        }
    }

    watchZone() {

    }
}