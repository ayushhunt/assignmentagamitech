"use client"
import AdminNavbar from "@/app/components/Adminnavbar";
import Navbar from "@/app/components/Navbar";
import useAuthen from "@/app/components/useAuthen";
import UserNavbar from "@/app/components/Usernavbar";

const Dashboard = () => {
    const {userRole,isAuthenticated}=useAuthen();

    return (
        <div className="">
            <div>
                something
            </div>
        </div>
    )
} 
export default Dashboard;