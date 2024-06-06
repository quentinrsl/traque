"use client";
import { useLocation } from "@/hook/useLocation";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Circle, LayersControl, MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import { useMapCircleDraw } from "@/hook/mapDrawing";
import useAdmin from "@/hook/useAdmin";
import { MapGridZoneSelector } from "./mapZoneSelector.jsx";


function MapPan(props) {
    const map = useMap();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!initialized && props.center) {
            map.flyTo(props.center, props.zoom, { animate: false });
            setInitialized(true)
        }
    }, [props.center]);
    return null;
}

function MapEventListener({ onClick, onMouseMove }) {
    const map = useMap();
    useEffect(() => {
        map.on('click', onClick);
        return () => {
            map.off('click', onClick);
        }
    }, [onClick]);
    useEffect(() => {
        map.on('mousemove', onMouseMove);
        return () => {
            map.off('mousemove', onMouseMove);
        }
    });
    return null;
}

const DEFAULT_ZOOM = 13;
export function CircularAreaPicker({ area, setArea, markerPosition, ...props }) {
    const location = useLocation(Infinity);
    const { handleClick, handleMouseMove, center, radius } = useMapCircleDraw(area, setArea);
    return (
        <MapContainer  {...props} className='min-h-full w-full ' center={[0, 0]} zoom={0} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {center && radius && <Circle center={center} radius={radius} fillColor="blue" />}
            {markerPosition && <Marker position={markerPosition} icon={new L.Icon({
                iconUrl: '/icons/location.png',
                iconSize: [41, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })}></Marker>}
            <MapPan center={location} zoom={DEFAULT_ZOOM} />
            <MapEventListener onClick={handleClick} onMouseMove={handleMouseMove} />
        </MapContainer>)
}

//https://stackoverflow.com/questions/71231865/show-fixed-100-m-x-100-m-grid-on-lowest-zoom-level

export function ZonePicker({ ...props }) {
    const location = useLocation(Infinity);
    const [coloredTiles, setColoredTiles] = useState([]);

    useEffect(() => {
        console.log(coloredTiles)
    }, [coloredTiles]);
    return (
        <MapContainer  {...props} className='min-h-full w-full ' center={[0, 0]} zoom={0} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapPan center={location} zoom={DEFAULT_ZOOM} />
            <LayersControl>
                <LayersControl.Overlay name="Grid" checked={true}>
                    <MapGridZoneSelector onSelectedTile={setColoredTiles} tileSize={16}/>
                </LayersControl.Overlay>
            </LayersControl>
        </MapContainer>
    )
}

export function LiveMap() {
    const location = useLocation(Infinity);
    const { zone, zoneExtremities, teams, getTeamName } = useAdmin();
    return (
        <MapContainer className='min-h-full w-full ' center={location} zoom={DEFAULT_ZOOM} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapPan center={location} zoom={DEFAULT_ZOOM} />
            {zone && <Circle center={zone.center} radius={zone.radius} color="blue" />}
            {zoneExtremities && <Circle center={zoneExtremities.begin.center} radius={zoneExtremities.begin.radius} color='black' fill={false} />}
            {zoneExtremities && <Circle center={zoneExtremities.end.center} radius={zoneExtremities.end.radius} color='red' fill={false} />}
            {teams.map((team) => team.currentLocation && !team.captured && <Marker key={team.id} position={team.currentLocation} icon={new L.Icon({
                iconUrl: '/icons/location.png',
                iconSize: [41, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })}>
                <Popup>
                    <strong className="text-lg">{team.name}</strong>
                    <p className="text-md">Chasing : {getTeamName(team.chasing)}</p>
                    <p className="text-md">Chased by : {getTeamName(team.chased)}</p>
                </Popup>
            </Marker>)}
        </MapContainer>
    )
}