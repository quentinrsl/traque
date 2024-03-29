"use client";
import { useLocation } from "@/hook/useLocation";
import { use, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Circle, MapContainer, TileLayer, useMap } from "react-leaflet";
import { useMapCircleDraw } from "@/hook/mapDrawing";

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

function MapEventListener({onClick, onMouseMove}) {
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

const DEFAULT_ZOOM = 17;
export function CircularAreaPicker({area, setArea, ...props}) {
    const location = useLocation(Infinity);
    const {handleClick, handleMouseMove, center, radius} = useMapCircleDraw(area, setArea);
    return (
        <MapContainer  {...props} className='min-h-full w-full ' center={[0, 0]} zoom={0} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {center && radius && <Circle center={center} radius={radius} fillColor="blue"/>}
            <MapPan center={location} zoom={DEFAULT_ZOOM} />
            <MapEventListener onClick={handleClick} onMouseMove={handleMouseMove} />
        </MapContainer>)
}

export function ZonePicker({minArea, setMinArea, maxArea, setMaxArea, ...props}) {
    const location = useLocation(Infinity);
    const {handleClick: maxClick, handleMouseMove: maxHover, center: maxCenter, radius: maxRadius} = useMapCircleDraw(minArea, setMinArea);
    const {handleClick: minClick, handleMouseMove: minHover, center: minCenter, radius: minRadius} = useMapCircleDraw(maxArea, setMaxArea);
    return (
        <MapContainer  {...props} className='min-h-full w-full ' center={[0, 0]} zoom={0} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {center && radius && <Circle center={center} radius={radius} fillColor="blue"/>}
            <MapPan center={location} zoom={DEFAULT_ZOOM} />
            <MapEventListener onClick={handleClick} onMouseMove={handleMouseMove} />
        </MapContainer>)
}