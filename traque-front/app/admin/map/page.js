"use client";
import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import('@/components/admin/maps').then((mod) => mod.LiveMap), {
    ssr: false
});
export default function LiveMapPage() {
    return <LiveMap />
}