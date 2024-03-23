import dynamic from 'next/dynamic';
import React from 'react'

//Load the map without SSR
const LiveMap = dynamic(() => import('@/components/team/map'), {
  ssr: false
});

export default function Track() {
  return (
    <main>
        <LiveMap className="h-full"/>
    </main>
  )
}
