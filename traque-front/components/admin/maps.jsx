"use client";
import { useLocation } from "@/hook/useLocation";
import { use, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Circle, LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useMapCircleDraw, useTilesColor } from "@/hook/mapDrawing";
import useAdmin from "@/hook/useAdmin";
import { MapGridZoneSelector } from "./mapZoneSelector.jsx";
import { useAdminContext } from "@/context/adminContext.jsx";
import { GreenButton } from "../util/button.jsx";
import TextInput from "../util/textInput.jsx";


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

export function ZoneInitializer({ ...props }) {
    const location = useLocation(Infinity);
    const { zone } = useAdminContext();
    const { initZone } = useAdmin();

    const tilesColor = useTilesColor(zone);

    const handleClickTile = (tile) => {
        if (zone) {
            if (zone.some(t => t.x === tile.x && t.y === tile.y)) {
                initZone(zone.filter(t => t.x !== tile.x || t.y !== tile.y));
            } else {
                initZone([...zone, tile]);
            }
        }
    }

    return (
        <MapContainer  {...props} className='min-h-full w-full ' center={[0, 0]} zoom={0} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapPan center={location} zoom={DEFAULT_ZOOM} />
            <LayersControl>
                <LayersControl.Overlay name="Play area" checked={true}>
                    <LayerGroup>
                        <MapGridZoneSelector tilesColor={tilesColor} onClickTile={handleClickTile} tileSize={16} />
                    </LayerGroup>
                </LayersControl.Overlay>
            </LayersControl>
        </MapContainer>
    )
}

export function ZoneEditor() {
    const location = useLocation(Infinity);
    const { zone, teams, getTeamName, removeZone } = useAdmin();
    const [zonesToDelete, setZonesToDelete] = useState([]);
    const [tilesColor, setTilesColor] = useState([]);
    const [timeBeforeDeletion, setTimeBeforeDeletion] = useState(null);

    function handleClickTile(tile) {
        if (!zone.some(t => t.x === tile.x && t.y === tile.y)) return;
        console.log(tile, "click", zonesToDelete);
        if (!zonesToDelete.some(t => t.x === tile.x && t.y === tile.y)) {
            setZonesToDelete([...zonesToDelete, tile]);
            console.log("delete", tile);
        } else {
            setZonesToDelete(zonesToDelete.filter(t => t.x !== tile.x || t.y !== tile.y));
        }
    }

    useEffect(() => {
        console.log(zone);
        setTilesColor([
            ...zonesToDelete.map(t => ({ x: t.x, y: t.y, color: 'rgba(255, 0, 0, 0.5)' })),
            ...zone
                .filter(t => !zonesToDelete.some(t2 => t.x == t2.x && t.y == t2.y))
                .map(t => {
                    console.log(t)
                    if (t.removeDate == null) {
                        return { x: t.x, y: t.y, color: 'rgba(0, 0, 255, 0.5)' }
                    } else {
                        return { x: t.x, y: t.y, color: 'rgba(255, 255, 0, 0.5)' }
                    }
                }),
        ]);
    }, [zone, zonesToDelete]);

    const handleSubmit = (e) => {
        if (timeBeforeDeletion == null) {
            return;
        }
        e.preventDefault();
        removeZone(zonesToDelete, timeBeforeDeletion);
        setZonesToDelete([]);
        setTimeBeforeDeletion(null);
    }


    return (
        <div className="flex flex-col w-full">
            <div className="h-full">
                <MapContainer className='min-h-full w-full ' center={location} zoom={DEFAULT_ZOOM} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapPan center={location} zoom={DEFAULT_ZOOM} />
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
                    <LayersControl>
                        <LayersControl.Overlay name="Play area" checked={true}>
                            <LayerGroup>
                                <MapGridZoneSelector tilesColor={tilesColor} onClickTile={handleClickTile} tileSize={16} />
                            </LayerGroup>
                        </LayersControl.Overlay>
                    </LayersControl>
                </MapContainer>
            </div>
            <div className="flex flex-row h-20">

                <TextInput className="w-4/5" placeholder="Time before deletion" value={timeBeforeDeletion} onChange={(e) => setTimeBeforeDeletion(Number(e.target.value))}></TextInput>
                <GreenButton className="w-1/5" onClick={handleSubmit}>Delete selected zones</GreenButton>
            </div>
        </div>
    )
}

export function LiveMap({ ...props }) {
    const location = useLocation(Infinity);
    const { zone, teams, getTeamName  } = useAdmin();
    const tilesColor = useTilesColor(zone);

    return (
        <MapContainer  {...props} className='min-h-full w-full ' center={[0, 0]} zoom={0} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapPan center={location} zoom={DEFAULT_ZOOM} />
            <LayersControl>
                <LayersControl.Overlay name="Play area" checked={true}>
                    <LayerGroup>
                        <MapGridZoneSelector tilesColor={tilesColor} onClickTile={() => { }} tileSize={16} />
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Players live position" checked={true}>
                    <LayerGroup>
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
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Players last sent position" checked={false}>
                    <LayerGroup>
                        {teams.map((team) => team.currentLocation && !team.captured && <Marker key={team.id} position={team.lastSentLocation} icon={new L.Icon({
                            iconUrl: '/icons/clock.png',
                            iconSize: [41, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        })}>
                            <Popup>
                                <strong className="text-lg">Last position of {team.name}</strong>
                            </Popup>
                        </Marker>)}
                    </LayerGroup>
                </LayersControl.Overlay>
            </LayersControl>
        </MapContainer>
    )
}