"use client"
import LoginForm from "@/components/team/loginForm";

export default function Home() {
  function login(teamId) {
    console.log(teamId);
  }
  return (
    <div>
      <LoginForm title={"Team login"} placeholder={"team ID"} buttonText={"Login"} onSubmit={login}/>
    </div>
  );
}
