"use client";
import { createContext, useContext } from "react";

const { io } = require("socket.io-client");

const SOCKET_URL = "http://localhost:3000";
const USER_SOCKET_URL = SOCKET_URL + "/user";
const ADMIN_SOCKET_URL = SOCKET_URL + "/admin";

export const userSocket = io(USER_SOCKET_URL);
export const adminSocket = io(ADMIN_SOCKET_URL);
export const SocketContext = createContext();

export default function SocketProvider({ children }) {
    return (
        <SocketContext.Provider value={{userSocket, adminSocket}}>{children}</SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}
