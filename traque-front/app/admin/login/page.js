"use client";
import LoginForm from '@/components/team/loginForm'
import { useAdminConnexion } from '@/context/adminConnexionContext';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'

export default function AdminLoginPage() {
    const { login, loggedIn } = useAdminConnexion();
    useEffect(() => {
        if (loggedIn) {
            redirect("/admin");
        }
    }, [loggedIn]);
    return (
        <LoginForm title="Admin login" placeholder="Admin password" buttonText={"Login"} onSubmit={login} />
    )
}
