"use client";
import ActionDrawer from '@/components/team/actionDrawer';
import { useTeamConnexion } from '@/context/teamConnexionContext';
import useGame from '@/hook/useGame';
import { GameState } from '@/util/gameState';
import dynamic from 'next/dynamic';
import React from 'react'

//Load the map without SSR
const LiveMap = dynamic(() => import('@/components/team/map').then((mod) => mod.LiveMap), {
    ssr: false
});
const PlacementMap = dynamic(() => import('@/components/team/map').then((mod) => mod.PlacementMap), {
    ssr: false
});

export default function Track() {
    const { gameState, name, ready } = useGame();
    const { useProtect } = useTeamConnexion();
    useProtect();
    return <>
        {gameState == GameState.PLAYING && <div className='h-full'>
            <LiveMap />
            <ActionDrawer />
        </div>
        }
        {gameState == GameState.PLACEMENT &&
            <div className='h-full'>
                <div className='fixed t-0 p-3 w-full bg-gray-300 shadow-xl rounded-b-xl flex flex-col z-10 justify-center items-center'>
                    <div className='text-2xl my-3'>Placement</div>
                    <div className='text-m'>{name}</div>
                    {!ready && <div className='text-lg font-semibold text-red-700'>Positionez vous dans le cercle</div>}
                    {ready && <div className='text-lg font-semibold text-green-700 text-center'>Restez dans le cercle en attendant que la partie commence</div>}

                </div>
                <PlacementMap />
            </div>
        }
    </>
}
