"use client";
import { TeamConnexionProvider } from "@/context/teamConnexionContext";
import { TeamProvider } from "@/context/teamContext";

export default function AdminLayout({ children }) {
    return (
        <TeamConnexionProvider>
            <TeamProvider>
                {children}
            </TeamProvider>
        </TeamConnexionProvider>
    )
}