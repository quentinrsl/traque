import { useEffect, useState } from 'react';
import { useLeafletContext } from '@react-leaflet/core';
import { useMapGrid } from '@/hook/mapDrawing';
import { latLngToTileNumber } from '../util/map';

export function MapGridZoneSelector({ onSelectedTile, tileSize }) {
    const [coloredTiles, setColoredTiles] = useState([]);
    const { map } = useLeafletContext();

    useEffect(() => {
        map.on('click', (e) => {
            const fractionalTileNumber = latLngToTileNumber(e.latlng, tileSize);
            const tileNumber = new TileNumber(Math.floor(fractionalTileNumber.x), Math.floor(fractionalTileNumber.y));
            if (coloredTiles.some(t => t.equals(tileNumber))) {
                setColoredTiles(coloredTiles.filter(t => !t.equals(tileNumber)));
            } else {
                setColoredTiles([...coloredTiles, tileNumber]);
            }
        });
    });

    useEffect(() => {
        onSelectedTile(coloredTiles);
    }, [coloredTiles]);

    useMapGrid(coloredTiles, tileSize);

    return null;
}