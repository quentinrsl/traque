"use client";
import ActionDrawer from '@/components/team/actionDrawer';
import { useTeamConnexion } from '@/context/teamConnexionContext';
import useGame from '@/hook/useGame';
import dynamic from 'next/dynamic';
import React from 'react'

//Load the map without SSR
const LiveMap = dynamic(() => import('@/components/team/map'), {
    ssr: false
});

export default function Track() {
    const { currentPosition, enemyPosition } = useGame();
    const {useProtect} = useTeamConnexion();
    useProtect();
    return (
        <div className='h-full'>
            <LiveMap currentPosition={currentPosition} enemyPosition={enemyPosition} />
            <ActionDrawer />
        </div>
    )
}
