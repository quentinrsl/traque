"use client";
import ActionDrawer from '@/components/team/actionDrawer';
import Button from '@/components/util/button';
import useGame from '@/hook/useGame';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'

//Load the map without SSR
const LiveMap = dynamic(() => import('@/components/team/map'), {
    ssr: false
});

export default function Track() {
    const { currentPosition, enemyPosition, loggedIn } = useGame();
    useEffect(() => {
        if (!loggedIn) {
            redirect("/team");
        }
    }, [loggedIn]);


    return (
        <div className='h-full'>
            <LiveMap currentPosition={currentPosition} enemyPosition={enemyPosition}/>
            <ActionDrawer />
        </div>
    )
}
