import React, { useEffect, useState } from 'react'
import TextInput from '../util/textInput'
import BlueButton, { RedButton } from '../util/button';
import useAdmin from '@/hook/useAdmin';
import dynamic from 'next/dynamic';

const CircularAreaPicker = dynamic(() => import('./mapPicker').then((mod) => mod.CircularAreaPicker), {
    ssr: false
});

export default function TeamEdit({ selectedTeamId, setSelectedTeamId }) {
    const [newTeamName, setNewTeamName] = React.useState('');
    const { updateTeam, getTeamName, removeTeam, getTeam, teams } = useAdmin();
    const [team, setTeam] = useState({})

    useEffect(() => {
        let team = getTeam(selectedTeamId);
        if (team != undefined) {
            setNewTeamName(team.name);
            setTeam(team);
        }
    }, [selectedTeamId, teams])

    function handleRename(e) {
        e.preventDefault();
        updateTeam(team.id, {name:newTeamName});
    }

    function handleRemove() {
        removeTeam(team.id);
        setSelectedTeamId(null);
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
                    <BlueButton onClick={() => updateTeam(team.id, {captured: !team.captured})}>{team.captured ? "Revive" : "Capture"}</BlueButton>
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
                    </div>
                </div>
            </div>
            <div className='m-5 h-full flex flex-col'>
                <h2 className='text-2xl text-center'>Starting area</h2>
                <CircularAreaPicker area={team.startingArea} setArea={(startingArea) => updateTeam(team.id, {startingArea})} />
            </div>
        </div>
    )
}
