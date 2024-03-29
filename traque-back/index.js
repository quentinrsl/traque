import { createServer } from "https";
import { Server } from "socket.io";
import Game from "./game.js";
import { config } from "dotenv";
import { readFileSync } from "fs";
//extract admin password from .env file
config();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const HOST = process.env.HOST;
const PORT = process.env.PORT;

const httpsServer = createServer({
  key: readFileSync(process.env.SSL_KEY, 'utf-8'),
  cert: readFileSync(process.env.SSL_CERT, 'utf-8')
});

httpsServer.listen(PORT, HOST, () => {
  console.log(`Server running`);
});


//set cors to allow all origins
const io = new Server(httpsServer, {
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

function teamBroadcast(teamId, event, data) {
  for (let socketId of game.getTeam(teamId).sockets) {
    io.of("player").to(socketId).emit(event, data)
  }
}

function playersBroadcast(event, data) {
  for (let team of game.teams) {
    teamBroadcast(team.id, event, data);
  }
}

function logoutPlayer(id) {
  for (let team of game.teams) {
    team.sockets = team.sockets.filter((sid) => sid != id);
  }
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

  socket.on("logout", () => {
    loggedInSockets = loggedInSockets.filter(s => s !== socket.id);
  })

  //User is attempting to log in
  socket.on("login", (password) => {
    if (password === ADMIN_PASSWORD && !loggedIn) {
      //Attempt successful
      socket.emit("login_response", true);
      loggedInSockets.push(socket.id);
      loggedIn = true;
      //Send the current state
      socket.emit("game_state", game.state)
    } else {
      //Attempt unsuccessful
      socket.emit("login_response", false);
    }
  });

  //User is attempting to add a new team
  socket.on("add_team", (teamName) => {
    if (!loggedIn) {
      socket.emit("error", "Not logged in");
      return;
    }
    if (game.addTeam(teamName)) {
      secureBroadcast("teams", game.teams);
    } else {
      socket.emit("error", "Error adding team");
    }
  });

  //User is attempting to remove a team
  socket.on("remove_team", (teamId) => {
    if (!loggedIn) {
      socket.emit("error", "Not logged in");
      return;
    }
    if (game.removeTeam(teamId)) {
      secureBroadcast("teams", game.teams);
    } else {
      socket.emit("error", "Error removing team");
    }
  });

  //User is attempting to change the game state
  socket.on("change_state", (state) => {
    if (!loggedIn) {
      socket.emit("error", "Not logged in");
      return;
    }
    if (game.setState(state)) {
      secureBroadcast("game_state", game.state);
      playersBroadcast("game_state", game.state)
    } else {
      socket.emit("error", "Error setting state");
    }
  });

  //Use is sending a new list containing the new order of the teams
  //Note that we never check if the new order contains the same teams as the old order, so it behaves more like a setTeams function
  //But the frontend should always send the same teams in a different order
  socket.on("reorder_teams", (newOrder) => {
    if (!loggedIn) {
      socket.emit("error", "Not logged in");
      return;
    }
    if (game.reorderTeams(newOrder)) {
      secureBroadcast("teams", game.teams);
    } else {
      socket.emit("error", "Error reordering teams");
    }
  });

  socket.on("update_team", (teamId, newTeam) => {
    if (!loggedIn) {
      socket.emit("error", "Not logged in");
      return;
    }
    if (game.updateTeam(teamId, newTeam)) {
      secureBroadcast("teams", game.teams);
      sendUpdatedTeamInformations(teamId)
    }
  })

  //Request an update of the team list
  //We only reply to the sender to prevent spam
  socket.on("get_teams", () => {
    if (!loggedIn) {
      socket.emit("error", "Not logged in");
      return;
    }
    socket.emit("teams", game.teams);
  });

});


function sendUpdatedTeamInformations(teamId) {
  let team = game.getTeam(teamId)
  team.sockets.forEach(socketId => {
    io.of("player").to(socketId).emit("update_team", {
      name: team.name,
      enemyLocation: team.enemyLocation,
      currentLocation: team.currentLocation,
      lastSentLocation: team.lastSentLocation,
      captureCode: team.captureCode,
      startingArea: team.startingArea,
      ready: team.ready,
      captured: team.captured
    })
  })
}

io.of("player").on("connection", (socket) => {
  let teamId = null;
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
    logoutPlayer(socket.id)
  });

  socket.on("login", (loginTeamId) => {
    if (game.getTeam(loginTeamId) === undefined) {
      socket.emit("login_response", false);
      return;
    }
    logoutPlayer(socket.id)
    teamId = loginTeamId;
    let team = game.getTeam(loginTeamId);
    team.sockets.push(socket.id);
    sendUpdatedTeamInformations(loginTeamId);
    socket.emit("login_response", true);
    socket.emit("game_state", game.state)
  });

  socket.on("logout", () => {
    logoutPlayer(socket.id);
  })

  socket.on("update_position", (position) => {
    // Only the first player to connect to the team socket can update the current position
    // This is done to prevent multiple clients from sending slightly different prosition back and forth
    // Making the point jitter on the map
    if (!teamId) {
      socket.emit("error", "not logged in yet");
      return;
    }
    let team = game.getTeam(teamId)
    if (team.sockets.indexOf(socket.id) == 0) {
      game.updateLocation(teamId, position);
      teamBroadcast(teamId, "update_team", { currentLocation: team.currentLocation, ready: team.ready });
      secureBroadcast("teams", game.teams);
    }
  });

  socket.on("send_position", () => {
    game.sendLocation(teamId);
    let team = game.getTeam(teamId);
    if (team === undefined) {
      socket.emit("error", "Team not found");
      return;
    }
    game.updateTeamChasing();
    teamBroadcast(teamId, "update_team", { enemyLocation: team.enemyLocation });
  });

  socket.on('capture', (captureCode) => {
    let capturedTeam = game.getTeam(teamId).chasing
    if(game.capture(teamId, captureCode)) {
      sendUpdatedTeamInformations(teamId)
      sendUpdatedTeamInformations(capturedTeam)
      secureBroadcast("teams", game.teams);
    }else {
      socket.emit("error", "Incorrect code")
    }
  })
});
