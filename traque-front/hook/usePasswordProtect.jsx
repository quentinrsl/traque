"use client";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

export function usePasswordProtect(loginPath, redirectPath, loading, loggedIn) {
    const path = usePathname();
    useEffect(() => {
        if (!loggedIn && !loading && path !== loginPath) {
            redirect(loginPath);
        }
        if(loggedIn && !loading && path === loginPath) {
            redirect(redirectPath)
        }
    }, [loggedIn, loading, path]);
}