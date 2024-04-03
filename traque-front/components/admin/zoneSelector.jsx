import { useState } from "react";
import BlueButton, { RedButton } from "../util/button";
import { EditMode, ZonePicker } from "./mapPicker";

export function ZoneSelector() {
    const [editMode, setEditMode] = useState(EditMode.MIN);
    const [minZone, setMinZone] = useState(null);
    const [maxZone, setMaxZone] = useState(null);
    return <div className='w-2/5 h-full gap-1 bg-gray-200 p-10 flex flex-col text-center shadow-2xl overflow-y-scroll'>
        <h2 className="text-2xl">Teams ready status</h2>
        {editMode == EditMode.MIN && <RedButton onClick={() => setEditMode(EditMode.MAX)}>Edit end zone</RedButton>}
        {editMode == EditMode.MAX && <BlueButton onClick={() => setEditMode(EditMode.MIN)}>Edit start zone</BlueButton>}
        <div className='h-96'>
            <ZonePicker minZone={minZone} maxZone={maxZone} editMode={editMode} setMinZone={setMinZone} setMaxZone={setMaxZone} />
        </div>
    </div>
}