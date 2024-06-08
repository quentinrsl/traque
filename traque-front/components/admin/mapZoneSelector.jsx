import { useMapGrid } from '@/hook/mapDrawing';
import { TileNumber, latLngToTileNumber } from '../util/map';
import { useMapEvent } from 'react-leaflet';

export function MapGridZoneSelector({ tilesColor, onClickTile, tileSize }) {
    useMapEvent('click', (e) => {
            const fractionalTileNumber = latLngToTileNumber(e.latlng, tileSize);
            const tileNumber = new TileNumber(Math.floor(fractionalTileNumber.x), Math.floor(fractionalTileNumber.y));
            onClickTile(tileNumber);
    });

    useMapGrid(tilesColor, tileSize);

    return null;
}
