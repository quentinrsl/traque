import { config } from "dotenv";
import { getDistanceFromLatLon, isInCircle } from "./map_utils.js";
import { sendUpdatedTeamInformations, teamBroadcast } from "./team_socket.js";
import { GameState } from "./game.js";
config()

export class PenaltyController {
    constructor(game) {
        //Number of penalties needed to be eliminated
        this.game = game;
        this.outOfBoundsSince = {};
        this.checkIntervalId = null;
    }

    init() {
        this.outOfBoundsSince = {};
        if(this.checkIntervalId) {
            clearInterval(this.checkIntervalId)
        }
        //Watch periodically if all teams need are following the rules
        this.checkIntervalId = setInterval(() => {
            if(this.game.state == GameState.PLAYING) {
                this.watchPositionUpdate();
                this.watchZone();
            }
        }, 100);
    }

    /**
     * Increment the penalty score of a team, send a message to the team and eliminated if necessary
     * @param {Number} teamId The team that will recieve a penalty
     */
    addPenalty(teamId) {
        let team = this.game.getTeam(teamId);
        if (team.captured) {
            return;
        }
        team.penalties++;
        if (team.penalties >= process.env.MAX_PENALTIES) {
            this.game.capture(team.id);
            sendUpdatedTeamInformations(teamId);
            sendUpdatedTeamInformations(team.chased);
            teamBroadcast(teamId, "warning", "You have been eliminated (reason: too many penalties)")
            teamBroadcast(team.chased, "success", "The team you were chasing has been eliminated")
        } else {
            teamBroadcast(teamId, "warning", `You recieved a penalty (${team.penalties}/${process.env.MAX_PENALTIES})`)
            sendUpdatedTeamInformations(teamId);
        }
    }

    watchZone() {
        this.game.teams.forEach((team) => {
            if (team.captured) { return }
            //All the informations are not ready yet
            if(team.currentLocation == null || this.game.zone.currentZone == null) {
                return;
            }
            if (!isInCircle({lat: team.currentLocation[0], lng: team.currentLocation[1]}, this.game.zone.currentZone.center, this.game.zone.currentZone.radius)) {
                //The team was not previously out of the zone
                if (!this.outOfBoundsSince[team.id]) {
                    this.outOfBoundsSince[team.id] = new Date();
                    teamBroadcast(team.id, "warning", `You left the zone, you have ${process.env.ALLOWED_TIME_OUT_OF_ZONE_IN_MINUTES} minutes to get back in the marked area.`)
                } else {
                    if (new Date() - this.outOfBoundsSince[team.id] > process.env.ALLOWED_TIME_OUT_OF_ZONE_IN_MINUTES * 60 * 1000) {
                        this.addPenalty(team.id)
                        this.outOfBoundsSince[team.id] = new Date();
                    }
                }
            } else {
                if (this.outOfBoundsSince[team.id]) {
                    delete this.outOfBoundsSince[team.id];
                }
            }
        })
    }

    watchPositionUpdate() {
        this.game.teams.forEach((team) => {
            //If the team has not sent their location for more than the allowed period, automatically send it and add a penalty
            if (team.captured) { return }
            if(team.lastSentLocationDate == null) {
                team.lastSentLocationDate = new Date();
                return;
            }
            if (new Date() - team.lastSentLocationDate > process.env.ALLOWED_TIME_BETWEEN_POSITION_UPDATE_IN_MINUTES * 60 * 1000) {
                this.addPenalty(team.id);
                this.game.sendLocation(team.id);
                sendUpdatedTeamInformations(team.id);
            }
        })
    }
}