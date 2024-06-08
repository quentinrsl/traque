import { TileNumber, latLngToTileNumber } from "@/components/util/map";
import { useEffect, useState } from "react";
import { useLeafletContext } from '@react-leaflet/core';
import L from 'leaflet';

export function useMapCircleDraw(area, setArea) {
    const [drawing, setDrawing] = useState(false);
    const [center, setCenter] = useState(area?.center || null);
    const [radius, setRadius] = useState(area?.radius || null);

    useEffect(() => {
        setDrawing(false);
        setCenter(area?.center || null);
        setRadius(area?.radius || null);
    }, [area])

    function handleClick(e) {
        if (!drawing) {
            setCenter(e.latlng);
            setRadius(null);
            setDrawing(true);
        } else {
            setDrawing(false);
            setArea({ center, radius });
        }
    }

    function handleMouseMove(e) {
        if (drawing) {
            setRadius(e.latlng.distanceTo(center));
        }
    }
    return {
        handleClick,
        handleMouseMove,
        center,
        radius,
    }
}

export function useMapGrid(tilesColor, tileSize) {
    const { layerContainer, map } = useLeafletContext();
    const [grid, setGrid] = useState(null);

    const Grid = L.GridLayer.extend({
        createTile: function (coords) {
            const tile = L.DomUtil.create('canvas', 'leaflet-tile');
            const ctx = tile.getContext('2d');
            const size = this.getTileSize();
            tile.width = size.x
            tile.height = size.y

            // calculate projection coordinates of top left tile pixel
            const nwPoint = coords.scaleBy(size);
            // calculate geographic coordinates of top left tile pixel
            const nw = map.unproject(nwPoint, coords.z);
            // calculate fraction tile number at top left point
            const nwTile = latLngToTileNumber(nw, tileSize)

            // calculate projection coordinates of bottom right tile pixel
            const sePoint = new L.Point(nwPoint.x + size.x - 1, nwPoint.y + size.y - 1)
            // calculate geographic coordinates of bottom right tile pixel
            const se = map.unproject(sePoint, coords.z);
            // calculate fractional tile number at bottom right point
            const seTile = latLngToTileNumber(se, tileSize)

            const minTileX = nwTile.x
            const maxTileX = seTile.x
            const minTileY = nwTile.y
            const maxTileY = seTile.y

            for (let x = Math.ceil(minTileX) - 1; x <= Math.floor(maxTileX) + 1; x++) {
                for (let y = Math.ceil(minTileY) - 1; y <= Math.floor(maxTileY) + 1; y++) {

                    let tile = new TileNumber(x, y)

                    const xMinPixel = Math.round(size.x * (x - minTileX) / (maxTileX - minTileX));
                    const xMaxPixel = Math.round(size.x * (x + 1 - minTileX) / (maxTileX - minTileX));
                    const yMinPixel = Math.round(size.y * (y - minTileY) / (maxTileY - minTileY));
                    const yMaxPixel = Math.round(size.y * (y + 1 - minTileY) / (maxTileY - minTileY));

                    if (this.tilesColor?.some(t => t.x == tile.x && t.y == tile.y)) {
                        ctx.fillStyle = this.tilesColor.find(t => t.x == tile.x && t.y == tile.y).color;
                    }
                    else {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0)';
                    }
                    ctx.fillRect(xMinPixel, yMinPixel, xMaxPixel - xMinPixel, yMaxPixel - yMinPixel);
                }
            }
            return tile;
        },
    });

    useEffect(() => {
        let g = new Grid({
            minZoom: 12,
        });
        setGrid(g);
        layerContainer.addLayer(g);
    }, [])

    useEffect(() => {
        if (grid) {
            grid.tilesColor = tilesColor;
            grid.redraw();
        }
    }, [tilesColor,grid]);
}

export function useTilesColor(zone) {
    const [tilesColor, setTilesColor] = useState([]);
    useEffect(() => {
        if (zone) {
            setTilesColor(zone.map(t => {
                if(t.removeDate == null) {
                    return { x: t.x, y: t.y, color: 'rgba(0, 0, 255, 0.3'}
                }else {
                    return { x: t.x, y: t.y, color: 'rgba(255, 255, 0, 0.3'}
                }

            }));
        }
    }, [zone]);
    return tilesColor;
}