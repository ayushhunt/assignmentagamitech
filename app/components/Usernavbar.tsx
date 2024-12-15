"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import Cookies from 'js-cookie'

const UserNavbar: React.FC = () => {

    const router = useRouter();
    const logout =()=> {
        Cookies.remove('token')
        Cookies.remove('role')
        router.push("/")
    }
    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between">
            <div className="text-lg font-bold">User Dashboard</div>
            <ul className="flex space-x-4">
               <li>
                    <Link href="/pages/feedback" className="hover:underline">
                        Feedback
                    </Link>
                </li>
                <li>
                    <Link href="/pages/getconfs" className="hover:underline">
                        Get Conferences
                    </Link>
                </li>
                <li>
                    <Link href="/pages/regis" className="hover:underline">
                        Get Your registrations
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

export default UserNavbar;
