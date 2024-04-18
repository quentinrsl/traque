import { isInCircle } from "./map_utils.js";
import { ZoneManager } from "./zone_manager.js";

export const GameState = {
    SETUP: "setup",
    PLACEMENT: "placement",
    PLAYING: "playing",
    FINISHED: "finished"
}

export default class Game {
    constructor(onUpdateZone,onUpdateNewZone) {
        this.teams = [];
        this.state = GameState.SETUP;
        this.zone = new ZoneManager(onUpdateZone, onUpdateNewZone)
    }

    setState(newState) {
        if(Object.values(GameState).indexOf(newState) == -1) {
            return false;
        }
        //The game has started
        if(newState == GameState.PLAYING) {
            if(!this.zone.ready()) {
                return false;
            }
            this.initLastSentLocations();
            this.zone.reset()
            this.zone.start()
        }
        if(newState != GameState.PLAYING) {
            this.zone.reset();
        }
        this.state = newState;
        return true;
    }

    getNewTeamId() {
        let id = null;
        while(id === null || this.teams.find(t => t.id === id)) {
            id = Math.floor(Math.random() * 1_000_000);
        }
        return id;
    }

    createCaptureCode() {
        return Math.floor(Math.random() * 10000)
    }

    addTeam(teamName) {
        let id = this.getNewTeamId();
        this.teams.push({
            id: id,
            name: teamName,
            chasing: null,
            chased: null,
            currentLocation: null,
            lastSentLocation: null,
            lastSentLocationDate: null,
            enemyLocation: null,
            captureCode: this.createCaptureCode(),
            sockets: [],
            startingArea: null,
            ready: false,
            captured: false,
            penalties: 0,
        });
        this.updateTeamChasing();
        return true;
    }

    playingTeamCount() {
        let res = 0;
        this.teams.forEach((t) => {
            if(!t.captured) {
                res++;
            }
        })
        return res;
    }

    updateTeamChasing() {
        if(this.playingTeamCount() <= 1) {
            return false;
        }
        let firstTeam = null;
        let previousTeam = null
        for(let i = 0; i < this.teams.length; i++ ) {
            if(!this.teams[i].captured) {
                if(previousTeam != null) {
                    this.teams[i].chased = previousTeam;
                    this.getTeam(previousTeam).chasing = this.teams[i].id;
                }else {
                    firstTeam = this.teams[i].id;
                }
                previousTeam = this.teams[i].id
            }
        }
        this.getTeam(firstTeam).chased = previousTeam;
        this.getTeam(previousTeam).chasing =firstTeam;
        return true;
    }

    reorderTeams(newOrder) {
        this.teams = newOrder;
        return this.updateTeamChasing();
    }

    getTeam(teamId) {
        return this.teams.find(t => t.id === teamId);
    }

    updateTeam(teamId, newTeam) {
        this.teams = this.teams.map((t) => {
            if(t.id == teamId) {
                return {...t, ...newTeam}
            }else {
                return t;
            }
        })
        this.updateTeamChasing();
        return true;
    }
    
    updateLocation(teamId, location) {
        let team = this.getTeam(teamId);
        if(team == undefined) {
            return false;
        }
        team.currentLocation = location;
        //Update the team ready status if they are in their starting area
        if(this.state == GameState.PLACEMENT && team.startingArea && team.startingArea && location) {
            team.ready = isInCircle(location, [team.startingArea.center.lat, team.startingArea.center.lng], team.startingArea.radius)
        }
        return true;
    }

    //Make it so that when a team requests the location of a team that has never sent their locaiton
    //Their position at the begining of the game is sent
    initLastSentLocations() {
        for(let team of this.teams) {
            team.lastSentLocation = team.currentLocation;
        }
    }

    sendLocation(teamId) {
        let team = this.getTeam(teamId);
        if(team == undefined) {
            return false;
        }
        team.lastSentLocationDate = new Date();
        team.lastSentLocation = team.currentLocation;
        if(this.getTeam(team.chasing) != null) {
            team.enemyLocation = this.getTeam(team.chasing).lastSentLocation;
        }
        return team;
    }

    removeTeam(teamId) {
        if(this.getTeam(teamId) == undefined) {
            return false;
        }
        //remove the team from the list
        this.teams = this.teams.filter(t => t.id !== teamId);
        this.updateTeamChasing();
        return true;
    }

    /**
     * Request a capture initiated by the team with id teamId (the one trying to capture)
     * If the captureCode match, the team chased by teamId will be set to captured
     * And the chase chain will be updated
     * @param {Number} teamId The id of the capturing team
     * @param {Number} captureCode The code sent by the capturing that only the captured team know, used to verify the authenticity of the capture
     * @returns {Boolean} if the capture has been successfull or not
     */
    requestCapture(teamId, captureCode) {
        let enemyTeam = this.getTeam(this.getTeam(teamId).chasing)
        if(enemyTeam.captureCode == captureCode) {
            this.capture(enemyTeam);
            this.updateTeamChasing();
            return true;
        }
        return false;
    }

    /**
     * Set a team to captured and update the chase chain
     * @param {Number} teamId the Id of the captured team
     */
    capture(teamId) {
        this.getTeam(teamId).captured = true
        this.updateTeamChasing();
    }

    /**
     * Change the settings of the Zone manager
     * The game should not be in PLAYING or FINISHED state
     * @param {Object} newSettings The object containing the settings to be changed
     * @returns false if failed
     */
    setZoneSettings(newSettings) {
        //cannot change zones while playing
        if(this.state == GameState.PLAYING || this.state == GameState.FINISHED) {
            return false;
        }
        return this.zone.udpateSettings(newSettings)
    }
}