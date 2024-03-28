"use client"
import LoginForm from "@/components/team/loginForm";
import { useTeamConnexion } from "@/context/teamConnexionContext";

export default function Home() {
  const { login,useProtect  } = useTeamConnexion();
  useProtect();
  return (
    <div>
      <LoginForm title={"Team login"} placeholder={"team ID"} buttonText={"Login"} onSubmit={(value) => login(parseInt(value))}/>
    </div>
  );
}
