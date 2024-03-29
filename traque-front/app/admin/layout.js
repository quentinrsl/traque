import { AdminConnexionProvider} from "@/context/adminConnexionContext";
import { AdminProvider } from "@/context/adminContext";
import Link from "next/link";

export default function AdminLayout({ children}) {
    return (
        <AdminConnexionProvider>
            <AdminProvider>
                <div className='h-full flex flex-col'>
                    <div className="text-lg max-h-10 p-5 bg-gray-800 text-white  flex items-center justify-left">
                        <div className="mx-5">Admin</div>
                        <ul className='flex space-x-4'>
                            <li><Link href="/admin">Home</Link></li>
                            <li><Link href="/admin/teams">Teams</Link></li>
                            <li><Link href="/admin/map">Map</Link></li>
                        </ul>
                    </div>
                    <div className="h-full overflow-y-scroll">
                        {children}
                    </div>
                </div>
            </AdminProvider>
        </AdminConnexionProvider>
    )
}