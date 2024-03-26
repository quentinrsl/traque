import React from 'react'
import TextInput from '../util/textInput'
import Button from '../util/button'

export default function TeamAddForm({onAddTeam}) {
    const [teamName, setTeamName] = React.useState('');
    function handleSubmit(e) {
        e.preventDefault();
        onAddTeam(teamName);
        setTeamName("")
    }
    return (
        <form className='flex flex-row m-y-5' onSubmit={handleSubmit}>
            <div className='w-4/5'>
                <TextInput name="teamName" label='Team name' value={teamName} onChange={(e) => setTeamName(e.target.value)}/>
            </div>
            <div className='w-1/5'>
                <Button type="submit" className="w-5">+</Button>
            </div>
        </form>
    )
}
