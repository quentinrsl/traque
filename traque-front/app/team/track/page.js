"use client";
import ActionDrawer from '@/components/team/actionDrawer';
import PlacementOverlay from '@/components/team/placementOverlay';
import { WaitingScreen } from '@/components/team/waitingScreen';
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
    const { gameState} = useGame();
    const { useProtect } = useTeamConnexion();
    useProtect();
    return <>
        {gameState == GameState.SETUP && <WaitingScreen />}
        {gameState == GameState.PLAYING && <div className='h-full'>
            <LiveMap />
            <ActionDrawer />
        </div>
        }
        {gameState == GameState.PLACEMENT &&
            <div className='h-full'>
                <PlacementOverlay />
                <PlacementMap />
            </div>
        }
    </>
}
