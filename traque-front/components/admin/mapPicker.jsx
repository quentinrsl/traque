"use client";
import { useLocation } from "@/hook/useLocation";
import { use, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Circle, MapContainer, TileLayer, useMap } from "react-leaflet";

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

export function CircularAreaPicker({area, setArea, ...props}) {
    const DEFAULT_ZOOM = 17;
    const location = useLocation(Infinity);
    const [drawing, setDrawing] = useState(false);
    const [center, setCenter] = useState(area?.center || null);
    const [radius, setRadius] = useState(area?.radius || null);

    useEffect(() => {
        console.log(area)
        setDrawing(false);
        setCenter(area?.center || null);
        setRadius(area?.radius || null);
    }, [area])

    function handleClick(e) {
        if(!drawing) {
            setCenter(e.latlng);
            setRadius(null);
            setDrawing(true);
        } else {
            setDrawing(false);
            setArea({center, radius});
        }
    }

    function handleMouseMove(e) {
        if(drawing) {
            setRadius(e.latlng.distanceTo(center));
        }
    }
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