"use client";
import { useEffect, useState } from "react";

/**
 * A hook that returns the location of the user and updates it periodically
 * @returns {Object} The location of the user
 */
export function useLocation(interval) {
    const [location, setLocation] = useState();
    useEffect(() => {
        function update() {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation([position.coords.latitude, position.coords.longitude]);
                setTimeout(update, interval);
            }, () => { }, { enableHighAccuracy: true, timeout: Infinity, maximumAge: 0 });
        }
        update();
    }, []);

    return location;
}