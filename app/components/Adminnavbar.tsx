"use client"
import { useRouter } from "next/navigation";
import React from "react";
import Cookies from 'js-cookie'
import Link from "next/link";

const AdminNavbar: React.FC = () => {
    const router = useRouter();
    const logout =()=> {
        Cookies.remove('token')
        Cookies.remove('role')
        router.push("/")
    }
    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between">
            <div className="text-lg font-bold">Admin Dashboard</div>
            <ul className="flex space-x-4">
                <li>
                    <Link href="/pages/addconf" className="hover:underline">
                        Add Conference
                    </Link>
                </li>
                <li>
                    <Link href="/pages/getconfs" className="hover:underline">
                        Get all Conferences
                    </Link>
                </li>
                <li>
                    <Link href="/pages/regis" className="hover:underline">
                        List Registrations
                    </Link>
                </li>
                <li>
                    <button onClick={logout} className="hover:underline">
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default AdminNavbar;
