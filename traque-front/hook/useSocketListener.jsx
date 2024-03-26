import { useState } from "react";

export function useSocketListener(socket, event, callback) {
    return useState(() => {
        socket.on(event, callback);
        return () => {
            socket.off(event, callback);
        }
    }, []);
}