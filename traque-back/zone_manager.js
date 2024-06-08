import { playersBroadcast, teamBroadcast } from './team_socket.js';
import { secureAdminBroadcast } from './admin_socket.js';

export let currentZone = []
let tileSize = 17;

export class TileNumber {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.removeDate = null;
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }

    removeIn(minutes) {
        this.removeDate = Date.now() + 1000 * 60 * minutes
    }
}

export function latLngToTileNumber(pos, tileSize) {
    const numTilesX = 2 ** tileSize;
    const numTilesY = 2 ** tileSize;
    const lngDegrees = pos[1];
    const latRadians = pos[0] * (Math.PI / 180);
    return {
        x:Math.round(numTilesX * ((lngDegrees + 180) / 360)),
        y:Math.round(numTilesY * (1 - Math.log(Math.tan(latRadians) + 1 / Math.cos(latRadians)) / Math.PI) / 2)
    };
}

export function broadcastZoneState() {
    playersBroadcast("zone", currentZone);
    secureAdminBroadcast("zone", currentZone);
}


/**
 * Remove all tiles from the zone
 */
export function resetZone() {
    currentZone = [];
    broadcastZoneState();
}

export function setTileSize(size) {
    resetZone();
    tileSize = size;
}

/**
 * Check whether a position is in the zone
 * @param {Object} position The position to check
 */
export function isInZone(position) {
    let tile = latLngToTileNumber(position, tileSize);
    return currentZone.some(square => square.equals(tile))
}

/**
 * Initialize a zone with a list of tiles
 * @param {Array} zone Array of tiles to add
 */
export function initZone(zone) {
    currentZone = [];
    try {
        for (let { x, y } of zone) {
            currentZone.push(new TileNumber(x, y))
        }
        broadcastZoneState();
    } catch (e) {
        console.error(e);
        secureAdminBroadcast("error", "Invalid zone format")
    }
}

/**
 * Put a list of tiles in a warning state for a certain amount of time, before removing them
 * @param {Array} zone Array of tiles to remove
 * @param {Number} time Time before those tiles get removed in minutes
 */
export function removeZone(zone, time) {
    for (let tile of zone) {
        for (let currentTile of currentZone) {
            if (currentTile.equals(tile)) {
                currentTile.removeIn(time);
            }
        }
    }
    broadcastZoneState();
}

setInterval(() => {
    let changed = false;
    currentZone = currentZone.map(square => {
        if (square.removeDate !== null && square.removeDate < Date.now()) {
            changed = true;
            return null;
        }
        return square;
    }).filter(square => square !== null)
    if (changed) {
        broadcastZoneState();
    }

}, 1000);

