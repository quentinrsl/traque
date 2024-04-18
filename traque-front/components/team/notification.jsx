import { useSocketListener } from "@/hook/useSocketListener";
import { useEffect, useState } from "react";

export function Notification({socket }) {
    const [visible, setVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    
    const [notification, setNotification] = useState(null);
    useSocketListener(socket, "error", (notification) => {
        console.log("error", notification);
        setNotification({type: "error", text: notification});
        setVisible(true);
    });
    useSocketListener(socket, "success", (notification) => {
        console.log("success", notification);
        setNotification({type: "success", text: notification});
        setVisible(true);
    });
    useSocketListener(socket, "warning", (notification) => {
        console.log("warning", notification);
        setNotification({type: "warning", text: notification});
        setVisible(true);
    });
    // Hide the notification after 5 seconds
    useEffect(() => {
        console.log({visible});
        if (visible && notification?.text != undefined) {
            clearTimeout(timeoutId);
            setTimeoutId(setTimeout(() => {
                setVisible(false);
            }, 3000));
        }
    }, [visible]);

    let bgColorMap = {
        error: "bg-red-500 text-white",
        success: "bg-green-500",
        warning: "bg-yellow-500"
    }
    const classNames = 'fixed w-11/12 p-5 z-30 mx-auto inset-x-0 flex justify-center rounded-xl transition-all shadow-xl ' + (visible ? "top-5 " : "-translate-y-full ");
    return ( 
        Object.keys(bgColorMap).map((key) =>
            notification?.type == key && 
            <div className={classNames + bgColorMap[key]} onClick={() => setVisible(false)}>
                <p className='text-center text-xl'>{notification?.text}</p>
            </div>
    ));
}