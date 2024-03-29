import { isInCircle } from "./map_utils.js";

const GameState = {
    SETUP: "setup",
    PLACEMENT: "placement",
    PLAYING: "playing",
    FINISHED: "finished"
}

export default class Game {
    constructor() {
        this.teams = [];
        this.state = GameState.SETUP;
    }

    setState(newState) {
        if(Object.values(GameState).indexOf(newState) == -1) {
            return false;
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
            enemyLocation: null,
            captureCode: this.createCaptureCode(),
            sockets: [],
            startingArea: null,
            ready: false,
        });
        this.updateTeamChasing();
        return true;
    }

    updateTeamChasing() {
        if(this.teams.length <= 1) {
            return false;
        }
        this.teams[0].chased = this.teams[this.teams.length - 1].id;
        this.teams[this.teams.length - 1].chasing = this.teams[0].id;

        for(let i = 0; i < this.teams.length - 1; i++) {
            this.teams[i].chasing = this.teams[i + 1].id;
            this.teams[i+1].chased = this.teams[i].id;
        }
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
        console.log(this.teams)
        return true;
    }
    
    updateLocation(teamId, location) {
        let team = this.getTeam(teamId);
        if(team == undefined) {
            return false;
        }
        team.currentLocation = location;
        //Update the team ready status if they are in their starting area
        console.log(location, team.startingArea.center)
        if(this.state == GameState.PLACEMENT && team.startingArea) {
            team.ready = isInCircle(location, [team.startingArea.center.lat, team.startingArea.center.lng], team.startingArea.radius)
        }
        return true;
    }

    sendLocation(teamId) {
        let team = this.getTeam(teamId);
        if(team == undefined) {
            return false;
        }
        team.lastSentLocation = team.currentLocation;
        team.enemyLocation = this.getTeam(team.chasing).lastSentLocation;
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
}