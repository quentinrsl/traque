"use client";
import { TeamReady } from "@/components/admin/teamReady";
import BlueButton, { GreenButton, RedButton } from "@/components/util/button";
import { useAdminConnexion } from "@/context/adminConnexionContext";
import useAdmin from "@/hook/useAdmin";
import { GameState } from "@/util/gameState";
import dynamic from "next/dynamic";

const ZoneSelector = dynamic(() => import('@/components/admin/zoneSelector').then((mod) => mod.ZoneSelector), {
    ssr: false
});
export default function AdminPage() {
    const { useProtect }  = useAdminConnexion();
    const { gameState, changeState } = useAdmin();
    useProtect();
    return (
        <div className='min-h-full bg-gray-200 p-10 flex flex-row flex-wrap content-start gap-5'>
            <div className='w-max h-1/2 gap-3 bg-gray-200 p-10 flex flex-col text-center shadow-2xl '>
                <h2 className="text-2xl">Game state </h2>
                <strong className="p-5 bg-gray-900 text-white text-xl rounded">Current : {gameState}</strong>
                <RedButton onClick={() => changeState(GameState.SETUP)}>Reset game</RedButton>
                <GreenButton onClick={() => changeState(GameState.PLACEMENT)}>Start placement</GreenButton>
                <BlueButton onClick={() => changeState(GameState.PLAYING)}>Start game</BlueButton>
            </div>
            {gameState == GameState.PLACEMENT && <div className="max-h-5/6"><TeamReady /></div>}
            {(gameState == GameState.SETUP || gameState == GameState.PLACEMENT) && <ZoneSelector />}
        </div>
    )
}