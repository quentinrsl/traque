import useAdmin from "@/hook/useAdmin";
import TextInput from "../util/textInput";
import { GreenButton } from "../util/button";
import { useEffect, useState } from "react";

export const PenaltySettings = () => {
    const {penaltySettings, changePenaltySettings} = useAdmin();
    const [maxPenalties, setMaxPenalties] = useState("");
    const [allowedTimeOutOfZone, setAllowedTimeOutOfZone] = useState("");
    const [allowedTimeBetweenUpdates, setAllowedTimeBetweenUpdates] = useState("");

    useEffect(() => {
        if (penaltySettings) {
            setMaxPenalties(penaltySettings.maxPenalties.toString());
            setAllowedTimeOutOfZone(penaltySettings.allowedTimeOutOfZone.toString());
            setAllowedTimeBetweenUpdates(penaltySettings.allowedTimeBetweenPositionUpdate.toString());
        }
    }, [penaltySettings]);

    function applySettings() {
        changePenaltySettings({maxPenalties: Number(maxPenalties), allowedTimeOutOfZone: Number(allowedTimeOutOfZone), allowedTimeBetweenPositionUpdate: Number(allowedTimeBetweenUpdates)});
    }

    return (
        <div className='w-2/5 h-full gap-1 bg-white p-10 flex flex-col text-center shadow-2xl overflow-y-scroll'>
            <h2 className="text-2xl">Penalties</h2>
            <div>
                <p>Maximum Penalties</p>
                <TextInput value={maxPenalties} onChange={(e) => setMaxPenalties(e.target.value)}></TextInput>
            </div>
            <div>
                <p>Time out of the zone before a penalty</p>
                <TextInput value={allowedTimeOutOfZone} onChange={(e) => setAllowedTimeOutOfZone(e.target.value)}></TextInput>
            </div>
            <div>
                <p>Allowed time between position updates</p>
                <TextInput value={allowedTimeBetweenUpdates} onChange={(e) => setAllowedTimeBetweenUpdates(e.target.value)}></TextInput>
            </div>
            <GreenButton onClick={applySettings}>Apply</GreenButton>
        </div>
    )
}