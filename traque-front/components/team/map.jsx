'use client';
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";

const DEFAULT_ZOOM = 17;

function MapPan(props) {
  const map = useMap();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if(!initialized && JSON.stringify(props.center) != "[0,0]") {
        map.flyTo(props.center, DEFAULT_ZOOM);
        setInitialized(true)
    }
  },[props.center]);

  return null;
}

export default function LiveMap({enemyPosition, currentPosition, ...props}) {
    const [positionSet, setPositionSet] = useState(false);
    useEffect(() => {
        if(!positionSet && JSON.stringify(currentPosition) != "[0,0]") {
            setPositionSet(true);
        }
    }, [currentPosition]);
    const [enemyPositionSet, setEnemyPositionSet] = useState(false);
    useEffect(() => {
        if(!enemyPositionSet && JSON.stringify(enemyPosition) != "[0,0]") {
            setEnemyPositionSet(true);
        }
    }, [enemyPosition]);



    return (
        <MapContainer  {...props} center={[0,0]} zoom={0} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {positionSet && <Marker position={currentPosition} icon={new L.Icon({
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
            {enemyPositionSet && <Marker  position={enemyPosition} icon={new L.Icon({
                iconUrl: '/icons/target.png',
                iconSize: [41, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })}>
                <Popup>
                    Position de l'ennemi
                </Popup>
            </Marker>}
            <MapPan center={currentPosition}/>
        </MapContainer>
    )
}
