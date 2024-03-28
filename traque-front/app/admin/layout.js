import { AdminConnexionProvider} from "@/context/adminConnexionContext";
import { AdminProvider } from "@/context/adminContext";
import Link from "next/link";

export default function AdminLayout({ children}) {
    return (
        <AdminConnexionProvider>
            <AdminProvider>
                <div className='h-full flex items-stretch flex-col'>
                    <div className="h-20 bg-gray-800 text-white flex items-center justify-left">
                        <div className="mx-5">Admin</div>
                        <ul className='flex space-x-4'>
                            <li><Link href="/admin">Home</Link></li>
                            <li><Link href="/admin/teams">Teams</Link></li>
                            <li><Link href="/admin/map">Map</Link></li>
                        </ul>
                    </div>
                    <div className="h-full block">
                        {children}
                    </div>
                </div>
            </AdminProvider>
        </AdminConnexionProvider>
    )
}