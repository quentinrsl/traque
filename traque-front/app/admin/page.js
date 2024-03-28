"use client";
import BlueButton, { GreenButton, RedButton } from "@/components/util/button";
import { useAdminConnexion } from "@/context/adminConnexionContext";
import useAdmin from "@/hook/useAdmin";
import { GameState } from "@/util/gameState";

export default function AdminPage() {
    const { useProtect }  = useAdminConnexion();
    const { gameState, changeState } = useAdmin();
    useProtect();
    return (
        <div className='h-full bg-gray-200 p-10 flex flex-col justify-between'>
            <div className='w-max gap-3 bg-gray-200 p-10 flex flex-col text-center shadow-2xl '>
                <h2 className="text-2xl">Game state </h2>
                <strong className="p-5 bg-gray-900 text-white text-xl rounded">Current : {gameState}</strong>
                <RedButton onClick={() => changeState(GameState.SETUP)}>Reset game</RedButton>
                <GreenButton onClick={() => changeState(GameState.PLACEMENT)}>Start placement</GreenButton>
                <BlueButton onClick={() => changeState(GameState.PLAYING)}>Start game</BlueButton>
            </div>
        </div>
    )
}