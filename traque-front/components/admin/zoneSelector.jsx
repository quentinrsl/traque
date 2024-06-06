import { useEffect, useState } from "react";
import BlueButton, { GreenButton, RedButton } from "../util/button";
import { EditMode, ZonePicker } from "./mapPicker";
import TextInput from "../util/textInput";
import useAdmin from "@/hook/useAdmin";

export function ZoneSelector() {

    //When the user set one zone, switch to the other
    return <div className='w-2/5 h-full gap-1 bg-white p-10 flex flex-col text-center shadow-2xl overflow-y-scroll'>
        <h2 className="text-2xl">Edit zones</h2>
        <div className='h-96'>
            <ZonePicker />
        </div>
        <GreenButton >Apply</GreenButton>
    </div>
}