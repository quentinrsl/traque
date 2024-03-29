import { useTeamConnexion } from "@/context/teamConnexionContext";
import useGame from "@/hook/useGame"

export function WaitingScreen() {
    const { name } = useGame();
    const { logout } = useTeamConnexion();
    return (
        <div className='h-full flex flex-col items-center justify-center'>
            <div className='text-4xl text-center'>
                Equipe : {name}
            </div>
            <div className='text-2xl text-center'>
               Jeu en préparation, veuillez patienter...
            </div>
            <div className="bottom-0 absolute text-sm text-center">
                Vous avez perdu Le Jeu
            </div>
            <img src="/icons/logout.png" onClick={logout} className='w-12 h-12 bg-red-500 p-2 top-1 right-1 rounded-lg cursor-pointer bg-red fixed z-20' />
        </div>
    )
}