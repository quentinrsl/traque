"use client";
import Button from '@/components/util/button';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react'

//Load the map without SSR
const LiveMap = dynamic(() => import('@/components/team/map'), {
    ssr: false
});

export default function Track() {
    const [currentPosition, setCurrentPosition] = useState([0,0]);
    const [enemyPosition, setEnemyPosition] = useState([0,0]);

    useEffect(() => {
        const t = setTimeout(() => {
            setEnemyPosition([currentPosition[0] + Math.random() / 100, currentPosition[1] + Math.random() / 100]);
        }, 1000);
        return () => clearInterval(t);
    }, [currentPosition]);

    useEffect(() => {
        navigator.geolocation.watchPosition((position) => {
            setCurrentPosition([position.coords.latitude, position.coords.longitude]);
        });
    }, []);


    return (
        <div className='h-full flex flex-col justify-between'>
            <LiveMap currentPosition={currentPosition} enemyPosition={enemyPosition} className="h-4/5" />
            <Button>Update position</Button>
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
