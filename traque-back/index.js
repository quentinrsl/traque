import { createServer } from "https";
import { Server } from "socket.io";
import Game from "./game.js";
import { config } from "dotenv";
import { readFileSync } from "fs";
import { initAdminSocketHandler, secureAdminBroadcast } from "./admin_socket.js";
import { initTeamSocket, playersBroadcast } from "./team_socket.js";
import { PenaltyController } from "./penalty_controller.js";
//extract admin password from .env file
config();
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
export const io = new Server(httpsServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

//Zone update broadcast function, called by the game object
function onUpdateNewZone(newZone) {
  playersBroadcast("new_zone", newZone)
  secureAdminBroadcast("new_zone", newZone)
}

function onUpdateZone(zone) {
  playersBroadcast("zone", zone)
  secureAdminBroadcast("zone", zone)
}


export const game = new Game(onUpdateZone, onUpdateNewZone);
const penaltyController = new PenaltyController(game);
penaltyController.init()


initAdminSocketHandler();
initTeamSocket();