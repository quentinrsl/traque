"use client";
import { createContext, useContext, useMemo } from "react";

const { io } = require("socket.io-client");

const SOCKET_URL = "http://localhost:3000";
const USER_SOCKET_URL = SOCKET_URL + "/player";
const ADMIN_SOCKET_URL = SOCKET_URL + "/admin";

export const teamSocket = io(USER_SOCKET_URL);
export const adminSocket = io(ADMIN_SOCKET_URL);
export const SocketContext = createContext();

export default function SocketProvider({ children }) {
    const value = useMemo(() => ({ teamSocket, adminSocket }), [teamSocket, adminSocket]);
    return (
        <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}
