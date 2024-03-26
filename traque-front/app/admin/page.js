"use client";
import TeamAddForm from '@/components/admin/teamAdd';
import TeamEdit from '@/components/admin/teamEdit';
import TeamList from '@/components/admin/teamList';
import { useAdminConnexion } from '@/context/adminConnexionContext';
import useAdmin from '@/hook/useAdmin';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'


export default function Admin() {
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const { loggedIn } = useAdminConnexion();
    const { addTeam } = useAdmin();

    useEffect(() => {
        if (!loggedIn) {
          redirect("/admin/login");
        }
    }, [loggedIn]);



  return (
      <div className='h-full p-10 flex flex-row justify-between'> 
        <div className='w-5/12 h-full p-4 shadow-md rounded outline'>
          <h2 className='text-2xl text-center'>Team list</h2>
          <TeamAddForm onAddTeam={addTeam}/>
          <TeamList selectedTeamId={selectedTeamId} onSelected={setSelectedTeamId}/>
        </div>
        <div className='w-5/12 h-full p-4 shadow-md rounded outline'>
          <TeamEdit selectedTeamId={selectedTeamId} setSelectedTeamId={setSelectedTeamId}/>
        </div>
      </div>
  )
}
