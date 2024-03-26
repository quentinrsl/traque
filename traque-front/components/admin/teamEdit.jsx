import React, { useEffect, useState } from 'react'
import TextInput from '../util/textInput'
import Button from '../util/button';
import useAdmin from '@/hook/useAdmin';

export default function TeamEdit({selectedTeamId, setSelectedTeamId}) {
    const [newTeamName, setNewTeamName] = React.useState('');
    const {setTeamName, getTeamName, removeTeam, getTeam} = useAdmin();
    const [team, setTeam] = useState({})

    useEffect(() => {
        let team = getTeam(selectedTeamId);
        if (team != undefined) {
            setNewTeamName(team.name);
        }
    },[selectedTeamId])

    
    useEffect(() => {
        let team = getTeam(selectedTeamId);
        if (team != undefined) {
            setTeam(team);
        }
    }, [selectedTeamId])


    function handleSubmit(e) {
        e.preventDefault();
        setTeamName(team.id, newTeamName);
    }

    function handleRemove() {
        removeTeam(team.id);
        setSelectedTeamId(null);
    }

  return (team && 
    <div className='flex flex-row'>
        <div className='w-1/2 flex flex-col space-y-3 mx-2'>
            <h2 className='text-2xl text-center'>Actions</h2>
            <form className='flex flex-row' onSubmit={handleSubmit}>
                <div className='w-4/5'>
                    <TextInput name="teamName" label='Team name' value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)}/>
                </div>
                <div className='w-2/5'>
                    <Button type="submit">Rename</Button>
                </div>
            </form>
            <Button onClick={handleRemove}>Eliminate</Button>
        </div>
        <div className='w-1/2 flex flex-col space-y-2 mx-2'>
            <h2 className='text-2xl text-center'>Team details</h2>
            <div>
                <p>Secret : {team.id}</p>
                <p>Name : {team.name}</p>
                <p>Chasing : {getTeamName(team.chasing)}</p>
                <p>Chased by : {getTeamName(team.chased)}</p>
            </div>
        </div>
    </div>
  )
}
