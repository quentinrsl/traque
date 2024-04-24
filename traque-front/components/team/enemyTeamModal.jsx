import useGame from "@/hook/useGame";
import { RedButton } from "../util/button";
import { useEffect, useRef } from "react";
import Image from "next/image";

export function EnemyTeamModal({ visible, onClose }) {
    const { teamId, enemyName } = useGame();
    const imageRef = useRef(null);

    useEffect(() => {
        if (visible) {
            refreshImage();
        }
    }, [visible]);

    function refreshImage() {
        imageRef.current.src = SERVER_URL + "/photo/enemy?team=" + teamId.toString() + "&t=" + new Date().getTime();
    }

    const SERVER_URL = "https://" + process.env.NEXT_PUBLIC_SOCKET_HOST + ":" + process.env.NEXT_PUBLIC_SOCKET_PORT;
    return (visible &&
        <>
            <div className='fixed w-screen h-screen bg-black bg-opacity-50 z-10 text-center'></div>
            <div className='fixed w-11/12 h-5/6 p-5 z-20 mx-auto inset-x-0 my-auto inset-y-0 flex flex-col justify-center rounded-xl transition-all shadow-xl bg-white '>
                <h1 className="w-full text-center text-3xl mb-5">{enemyName}</h1>
                <Image ref={imageRef} src={SERVER_URL + "/photo/enemy?team=" + teamId.toString()} className='w-full h-full object-contain' />
                <div className="h-20">
                    <RedButton onClick={onClose}>Close</RedButton>
                </div>
            </div>
        </>
    )
}