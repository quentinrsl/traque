export default class Game {
    constructor() {
        this.teams = [];
        this.started = false;
    }

    start() {
        this.started = true;
    }

    stop() {
        this.started = false;
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
            sockets: []
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

    renameTeam(teamId, newName) {
        let team = this.getTeam(teamId);
        if(team == undefined) {
            return false;
        }
        team.name = newName;
        return true;
    }

    updateLocation(teamId, location) {
        let team = this.getTeam(teamId);
        if(team == undefined) {
            return false;
        }
        team.currentLocation = location;
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