"use client";

import { useSocket } from "@/context/socketContext";
import { useEffect, useState } from "react";

export default function useGame() {
    const {userSocket} = useSocket();
    const [loggedIn, setLoggedIn] = useState(false);
    const [teamId, setTeamId] = useState(null);
    const [enemyPosition, setEnemyPosition] = useState([0, 0]);
    const [currentPosition, setCurrentPosition] = useState([0, 0]);

    function updateCurrentPosition(position) {
        setCurrentPosition(position);
        userSocket.emit("update_position", position);
    }

    function sendCurrentPosition() {
        userSocket.emit("send_position", currentPosition);
    }
    useEffect(() => {
        function updateEnemyPosition(position) {
            setEnemyPosition(position);
        }
        userSocket.on("enemy_position", updateEnemyPosition);

        return () => {
            userSocket.off("enemy_position", updateEnemyPosition);
        }
    }, []);

    function login(teamId) {
        setTeamId(teamId);
        userSocket.emit("login", teamId);
    }
    useEffect(() => {
        function updateLoginStatus(status) {
            setLoggedIn(status);
        }
        userSocket.on("login_reponse", updateLoginStatus);

        return () => {
            userSocket.off("login_response", updateLoginStatus);
        }
    }, []);

    useEffect(() => {
        function udpate() {
                console.log("update")
                const position = navigator.geolocation.getCurrentPosition((position) => {
                updateCurrentPosition([position.coords.latitude, position.coords.longitude]);
            }, () => { }, { enableHighAccuracy: true, timeout: Infinity, maximumAge: 0 });
        }
        setInterval(udpate, 1000);
        return () => {
            clearInterval(udpate);
        }
    }, []);

    return { updateCurrentPosition, sendCurrentPosition, login, enemyPosition, currentPosition, loggedIn, teamId };
}