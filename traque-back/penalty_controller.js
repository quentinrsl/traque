import { getDistanceFromLatLon, isInCircle } from "./map_utils.js";
import { sendUpdatedTeamInformations, teamBroadcast } from "./team_socket.js";
import { GameState } from "./game.js";
import { secureAdminBroadcast } from "./admin_socket.js";
import { game } from "./index.js";

export class PenaltyController {
    constructor() {
        //Number of penalties needed to be eliminated
        this.game = game;
        this.outOfBoundsSince = {};
        this.checkIntervalId = null;
        this.settings = {
            allowedTimeOutOfZone: 10,
            allowedTimeBetweenPositionUpdate: 10,
            maxPenalties: 3
        }
    }

    start() {
        this.outOfBoundsSince = {};
        if (this.checkIntervalId) {
            clearInterval(this.checkIntervalId)
        }
        //Watch periodically if all teams need are following the rules
        this.checkIntervalId = setInterval(() => {
            if (this.game.state == GameState.PLAYING) {
                this.watchPositionUpdate();
                this.watchZone();
            }
        }, 100);
    }

    stop() {
        this.outOfBoundsSince = {};
        if (this.checkIntervalId) {
            clearInterval(this.checkIntervalId)
            this.checkIntervalId = null;
        }
    }

    updateSettings(newSettings) {
        //Sanitize input
        if (newSettings.maxPenalties && (isNaN(parseInt(newSettings.maxPenalties)) || newSettings.maxPenalties < 0)) { return false }
        if (newSettings.allowedTimeBetweenPositionUpdate && (isNaN(parseFloat(newSettings.allowedTimeBetweenPositionUpdate)) || newSettings.allowedTimeBetweenPositionUpdate < 0)) { return false }
        if (newSettings.allowedTimeOutOfZone && (isNaN(parseFloat(newSettings.allowedTimeOutOfZone)) || newSettings.allowedTimeOutOfZone < 0)) { return false }

        this.settings = { ...this.settings, ...newSettings };
        return true;
    }

    /**
     * Increment the penalty score of a team, send a message to the team and eliminated if necessary
     * @param {Number} teamId The team that will recieve a penalty
     */
    addPenalty(teamId) {
        let team = this.game.getTeam(teamId);
        if (!team) {
            return;
        }
        if (team.captured) {
            return;
        }
        team.penalties++;
        if (team.penalties >= this.settings.maxPenalties) {
            this.game.capture(team.id);
            sendUpdatedTeamInformations(teamId);
            sendUpdatedTeamInformations(team.chased);
            teamBroadcast(teamId, "warning", "You have been eliminated (reason: too many penalties)")
            teamBroadcast(team.chased, "success", "The team you were chasing has been eliminated")
        } else {
            teamBroadcast(teamId, "warning", `You recieved a penalty (${team.penalties}/${this.settings.maxPenalties})`)
            sendUpdatedTeamInformations(teamId);
        }
        secureAdminBroadcast("teams", this.game.teams)
    }

    checkPenalties() {
        for (let team of game.teams) {
            if (team.penalties >= this.settings.maxPenalties) {
                this.game.capture(team.id);
                sendUpdatedTeamInformations(team.id);
                sendUpdatedTeamInformations(team.chased);
                teamBroadcast(team.id, "warning", "You have been eliminated (reason: too many penalties)")
                teamBroadcast(team.chased, "success", "The team you were chasing has been eliminated")
            }
        }
    }

    watchZone() {
        this.game.teams.forEach((team) => {
            if (team.captured) { return }
            //All the informations are not ready yet
            if (team.currentLocation == null || this.game.zone.currentZone == null) {
                return;
            }
            if (!isInCircle({ lat: team.currentLocation[0], lng: team.currentLocation[1] }, this.game.zone.currentZone.center, this.game.zone.currentZone.radius)) {
                //The team was not previously out of the zone
                if (!this.outOfBoundsSince[team.id]) {
                    this.outOfBoundsSince[team.id] = new Date();
                    teamBroadcast(team.id, "warning", `You left the zone, you have ${this.settings.allowedTimeOutOfZone} minutes to get back in the marked area.`)
                } else if (new Date() - this.outOfBoundsSince[team.id] > this.settings.allowedTimeOutOfZone * 60 * 1000) {
                    this.addPenalty(team.id)
                    this.outOfBoundsSince[team.id] = new Date();
                } else if (Math.abs(new Date() - this.outOfBoundsSince[team.id] - (this.settings.allowedTimeOutOfZone - 1) * 60 * 1000) < 100) {
                    teamBroadcast(team.id, "warning", `You left the zone, you have 1 minutes to get back in the marked area.`)
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
            if (team.locationSendDeadline == null) {
                team.locationSendDeadline = Number(new Date()) + this.settings.allowedTimeBetweenPositionUpdate * 60 * 1000;
                return;
            }
            if (new Date() > team.locationSendDeadline) {
                this.addPenalty(team.id);
                this.game.sendLocation(team.id);
                sendUpdatedTeamInformations(team.id);
                secureAdminBroadcast("teams", this.game.teams)
            }else if(Math.abs(new Date() - team.locationSendDeadline - 60 * 1000) < 100) {
                teamBroadcast(team.id, "warning", `You have one minute left to udpate your location.`)
            }
        })
    }
}