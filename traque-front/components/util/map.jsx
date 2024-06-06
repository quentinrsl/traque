export class TileNumber {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
}

export function latLngToTileNumber(latLng, tileSize) {
    const numTilesX = 2 ** tileSize;
    const numTilesY = 2 ** tileSize;
    const lngDegrees = latLng.lng;
    const latRadians = latLng.lat * (Math.PI / 180);
    return new L.Point(
        numTilesX * ((lngDegrees + 180) / 360),
        numTilesY * (1 - Math.log(Math.tan(latRadians) + 1 / Math.cos(latRadians)) / Math.PI) / 2
    );
}