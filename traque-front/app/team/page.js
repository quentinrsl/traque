"use client"
import LoginForm from "@/components/team/loginForm";
import useGame from "@/hook/useGame";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { login, loggedIn } = useGame();
  useEffect(() => {
    if (loggedIn) {
      redirect("/team/track");
    }
  }, [loggedIn]);
  return (
    <div>
      <LoginForm title={"Team login"} placeholder={"team ID"} buttonText={"Login"} onSubmit={(value) => login(parseInt(value))}/>
    </div>
  );
}
