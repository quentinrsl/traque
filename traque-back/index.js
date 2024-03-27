import { createServer } from "http";
import { Server } from "socket.io";
import Game from "./game.js";
import { config } from "dotenv";
//extract admin password from .env file
config();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const HOST = process.env.HOST;
const PORT = process.env.PORT;

const httpServer = createServer();
//Password that socket clients will have to send to be able to send admin commands


//set cors to allow all origins
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


/**
 * Send a message to all logged in sockets
 * @param {String} event The event name
 * @param {String} data The data to send
 */
function secureBroadcast(event, data) {
  loggedInSockets.forEach(s => {
    io.of("admin").to(s).emit(event, data);
  });
}


const game = new Game();

//Array of logged in sockets
let loggedInSockets = [];


//Admin namespace
io.of("admin").on("connection", (socket) => {
  //Flag to check if the user is logged in, defined for each socket
  let loggedIn = false;

  socket.on("disconnect", () => {
    console.log("user disconnected");
    //Remove the socket from the logged in sockets array
    loggedInSockets = loggedInSockets.filter(s => s !== socket.id);
  });

  //User is attempting to log in
  socket.on("login", (password) => {
    if (password === ADMIN_PASSWORD && !loggedIn) {
      //Attempt successful
      socket.emit("login_response", true);
      loggedInSockets.push(socket.id);
      loggedIn = true;
    } else {
      //Attempt unsuccessful
      socket.emit("login_response", false);
    }
  });

  //User is attempting to add a new team
  socket.on("add_team", (teamName) => {
    if(!loggedIn) {
      socket.emit("error", "Not logged in");
      return;
    }
    if(game.addTeam(teamName)) {
      secureBroadcast("teams", game.teams);
    }else {
      socket.emit("error", "Error adding team");
    }
  });

  //User is attempting to remove a team
  socket.on("remove_team", (teamId) => {
    if(!loggedIn) {
      socket.emit("error", "Not logged in");
      return;
    }
    if(game.removeTeam(teamId)) {
      secureBroadcast("teams", game.teams);
    }else {
      socket.emit("error", "Error removing team");
    }
  });

  //User is attempting to start the game
  socket.on("start_game", () => {
    if(!loggedIn) {
      socket.emit("error", "Not logged in");
      return;
    }
    if(game.start()) {
      secureBroadcast("game_started", true);
    }else {
      socket.emit("error", "Error starting game");
    }
  });

  //User is attempting to stop the game
  socket.on("stop_game", () => {
    if(!loggedIn) {
      socket.emit("error", "Not logged in");
      return;
    }
    if(game.stop()) {
      secureBroadcast("game_started", false);
    }else {
      socket.emit("error", "Error stopping game");
    }
  });

  //Use is sending a new list containing the new order of the teams
  //Note that we never check if the new order contains the same teams as the old order, so it behaves more like a setTeams function
  //But the frontend should always send the same teams in a different order
  socket.on("reorder_teams", (newOrder) => {
    if(!loggedIn) {
      socket.emit("error", "Not logged in");
      return;
    }
    if(game.reorderTeams(newOrder)) {
      secureBroadcast("teams", game.teams);
    } else {
      socket.emit("error", "Error reordering teams");
    }
  });

  //Change the name of a team given its id
  socket.on("rename_team", (teamId, newName) => {
    if(!loggedIn) {
      socket.emit("error", "Not logged in");
      return;
    }
    if(game.renameTeam(teamId, newName)) {
      secureBroadcast("teams", game.teams);
    } else {
      socket.emit("error", "Error renaming team");
    }
  });

  //Request an update of the team list
  //We only reply to the sender to prevent spam
  socket.on("get_teams", () => {
    if(!loggedIn) {
      socket.emit("error", "Not logged in");
      return;
    }
      socket.emit("teams", game.teams);
  });

});



io.of("player").on("connection", (socket) => {
  let teamId = null;
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
    if(teamId !== null && game.getTeam(teamId) !== undefined){
      game.getTeam(teamId).sockets = game.getTeam(teamId).sockets.filter(s => s !== socket.id);
    }
  });

  socket.on("login", (loginTeamId) => {
    if(game.getTeam(loginTeamId) === undefined) {
      socket.emit("login_response", false);
      return;
    }
    teamId = loginTeamId;
    game.getTeam(loginTeamId).sockets.push(socket.id);
    socket.emit("login_response", true);
  });

  socket.on("update_position", (position) => {
    game.updateLocation(teamId, position);
  });
  
  socket.on("send_position", () => {
    game.sendLocation(teamId);
    let team = game.getTeam(teamId);
    if(team === undefined) {
      socket.emit("error", "Team not found");
      return;
    }
    game.updateTeamChasing();
    team.sockets.forEach(s => {
      io.of("player").to(s).emit("enemy_position", team.enemyLocation);
    });
  });
});

httpServer.listen(PORT, HOST, () => {
  console.log(`Server running`);
});