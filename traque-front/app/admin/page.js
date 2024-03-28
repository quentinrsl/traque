"use client";
import { useAdminConnexion } from "@/context/adminConnexionContext";

export default function AdminPage() {
    const { useProtect }  = useAdminConnexion();
    useProtect();
    return (
        <div>
            <h1>Admin page</h1>
        </div>
    )
}