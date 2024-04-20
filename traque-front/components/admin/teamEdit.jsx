import React, { useEffect, useRef, useState } from 'react'
import TextInput from '../util/textInput'
import BlueButton, { RedButton } from '../util/button';
import useAdmin from '@/hook/useAdmin';
import dynamic from 'next/dynamic';

const CircularAreaPicker = dynamic(() => import('./mapPicker').then((mod) => mod.CircularAreaPicker), {
    ssr: false
});

export default function TeamEdit({ selectedTeamId, setSelectedTeamId }) {
    const teamImage = useRef(null);
    const [newTeamName, setNewTeamName] = React.useState('');
    const { updateTeam, getTeamName, removeTeam, getTeam, teams } = useAdmin();
    const [team, setTeam] = useState({})
    const SERVER_URL = "https://" + process.env.NEXT_PUBLIC_SOCKET_HOST + ":" + process.env.NEXT_PUBLIC_SOCKET_PORT;

    useEffect(() => {
        let team = getTeam(selectedTeamId);
        if (team != undefined) {
            setNewTeamName(team.name);
            setTeam(team);
        }
        teamImage.current.src = SERVER_URL + "/photo/my?team=" + selectedTeamId + "&t=" + new Date().getTime();
    }, [selectedTeamId, teams])

    function handleRename(e) {
        e.preventDefault();
        updateTeam(team.id, { name: newTeamName });
    }

    function handleRemove() {
        removeTeam(team.id);
        setSelectedTeamId(null);
    }

    function handleAddPenalty(increment) {
        let newPenalties = team.penalties + increment;
        newPenalties = Math.max(0, newPenalties);
        newPenalties = Math.min(3, newPenalties);
        updateTeam(team.id, { penalties: newPenalties });
    }

    return (team &&
        <div className='flex flex-col h-full'>

            <div className='flex flex-row'>
                <div className='w-1/2 flex flex-col space-y-3 mx-2'>
                    <h2 className='text-2xl text-center'>Actions</h2>
                    <form className='flex flex-row' onSubmit={handleRename}>
                        <div className='w-4/5'>
                            <TextInput name="teamName" label='Team name' value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} />
                        </div>
                        <div className='w-2/5'>
                            <BlueButton type="submit">Rename</BlueButton>
                        </div>
                    </form>
                    <BlueButton onClick={() => updateTeam(team.id, { captured: !team.captured })}>{team.captured ? "Revive" : "Capture"}</BlueButton>
                    <RedButton onClick={handleRemove}>Remove</RedButton>
                </div>
                <div className='w-1/2 flex flex-col space-y-2 mx-2'>
                    <h2 className='text-2xl text-center'>Team details</h2>
                    <div>
                        <p>Secret : {String(team.id).padStart(6, '0')}</p>
                        <p>Name : {team.name}</p>
                        <p>Chasing : {getTeamName(team.chasing)}</p>
                        <p>Chased by : {getTeamName(team.chased)}</p>
                        <p>Capture code : {String(team.captureCode).padStart(4, '0')}</p>
                        <p>Captured : {team.captured ? "Yes" : "No"}</p>
                        <p>Has to send location before {new Date(team.locationSendDeadline).toTimeString()}</p>
                        <div className='flex flex-row'>
                            <p>Penalties :</p>
                            <button className='w-7 h-7 mx-4 bg-blue-600 hover:bg-blue-500 text-md ease-out duration-200 text-white shadow-sm rounded' onClick={() => handleAddPenalty(-1)}>-</button>
                            <p>{team.penalties}</p>
                            <button className='w-7 h-7 mx-4 bg-blue-600 hover:bg-blue-500 text-md ease-out duration-200 text-white shadow-sm rounded' onClick={() => handleAddPenalty(1)}>+</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-row h-full w-full'>
                <div className='w-1/2 h-full p-5 flex flex-col'>
                    <h2 className='text-2xl text-center'>Starting area</h2>
                    <div className='h-full p-5'>
                        <CircularAreaPicker area={team.startingArea} setArea={(startingArea) => updateTeam(team.id, { startingArea })} markerPosition={team?.currentLocation} />
                    </div>
                </div>
                <div className='w-1/2 h-full p-5 flex flex-col'>
                    <h2 className='text-2xl text-center'>Team photo</h2>
                    <div className='h-full p-5'>
                    <img ref={teamImage} className='w-full h-full object-contain' />
                    </div>
                </div>
            </div>
        </div>
    )
}
