'use client';
import React, { useEffect, useState } from 'react'
import { Circle, LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";
import useGame from '@/hook/useGame';
import { useTeamContext } from '@/context/teamContext';
import {  useTilesColor } from '@/hook/mapDrawing';
import { MapGridZoneSelector } from '../admin/mapZoneSelector';
import { TILE_SIZE } from '../admin/maps';

const DEFAULT_ZOOM = 17;


// Pan to the center of the map when the position of the user is updated for the first time
function MapPan(props) {
    const map = useMap();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!initialized && props.center) {
            map.flyTo(props.center, DEFAULT_ZOOM, { animate: false });
            setInitialized(true)
        }
    }, [props.center]);

    return null;
}

export function LiveMap({ ...props }) {
    const {zone} = useTeamContext();
    const tilesColor = useTilesColor(zone);
    const { currentPosition, enemyPosition } = useGame();

    return (
        <MapContainer  {...props} className='min-h-full z-0' center={[0, 0]} zoom={0} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {currentPosition && <Marker position={currentPosition} icon={new L.Icon({
                iconUrl: '/icons/location.png',
                iconSize: [41, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })}>
                <Popup>
                    Votre position
                </Popup>
            </Marker>}
            {enemyPosition && <Marker position={enemyPosition} icon={new L.Icon({
                iconUrl: '/icons/target.png',
                iconSize: [41, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })}>
                <Popup>
                    Position de l&apos;ennemi
                </Popup>
            </Marker>}
            <MapPan center={currentPosition} />
            <LayersControl>
                <LayersControl.Overlay name="Play area" checked={true}>
                    <LayerGroup>
                        <MapGridZoneSelector tilesColor={tilesColor} onClickTile={()=>{}} tileSize={TILE_SIZE}/>
                    </LayerGroup>
                </LayersControl.Overlay>
            </LayersControl>
        </MapContainer>
    )
}

export function PlacementMap({ ...props }) {
    const { currentPosition, startingArea } = useGame();
    return (
        <MapContainer  {...props} className='min-h-full w-full z-0' scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {currentPosition && <Marker position={currentPosition} icon={new L.Icon({
                iconUrl: '/icons/location.png',
                iconSize: [41, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })}>
                <Popup>
                    Votre position
                </Popup>
            </Marker>}
            <MapPan center={currentPosition} />
            {startingArea && <Circle center={startingArea?.center} radius={startingArea?.radius} color='blue' />}
        </MapContainer>
    )
}
