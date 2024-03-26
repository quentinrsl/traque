'use client';
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";

const DEFAULT_ZOOM = 17;


// Pan to the center of the map when the position of the user is updated for the first time
function MapPan(props) {
  const map = useMap();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if(!initialized && props.center) {
        map.flyTo(props.center, DEFAULT_ZOOM);
        setInitialized(true)
    }
  },[props.center]);

  return null;
}

export default function LiveMap({enemyPosition, currentPosition, ...props}) {

    return (
        <MapContainer  {...props} center={[0,0]} zoom={0} scrollWheelZoom={true}>
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
            {enemyPosition && <Marker  position={enemyPosition} icon={new L.Icon({
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
