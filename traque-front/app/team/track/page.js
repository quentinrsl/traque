"use client";
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
    const { currentPosition, enemyPosition, loggedIn, sendCurrentPosition } = useGame();
    useEffect(() => {
        if (!loggedIn) {
            redirect("/team");
        }
    }, [loggedIn]);


    return (
        <div className='h-full flex flex-col justify-between justify-items-stretch'>
            <div className='h-5/6'>
                <LiveMap currentPosition={currentPosition} enemyPosition={enemyPosition}/>
            </div>
            <div className="h-1/6">
                <Button onClick={sendCurrentPosition}>Update position</Button>
            </div>
            <div className='shadow-lg m-5 p-2 flex flex-col text-center mx-auto w-4/5 rounded'>
                <p className='text-xl text-black'>30min</p>
                <p className='text-gray-700'> before penalty</p>
                <div className='w-1/2 flex flex-row justify-center mx-auto'>
                    <div className='min-h-5 m-2 min-w-5 bg-green-400'></div>
                    <div className='min-h-5 m-2 min-w-5 bg-green-400'></div>
                    <div className='min-h-5 m-2 min-w-5 bg-green-400'></div>
                </div>
            </div>
        </div>
    )
}