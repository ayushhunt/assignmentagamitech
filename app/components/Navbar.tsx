"use client"
import React from "react";
import AdminNavbar from "./Adminnavbar";
import UserNavbar from "./Usernavbar";
import useAuthen from "./useAuthen";

const Navbar: React.FC = () => {
    const { userRole, isAuthenticated } = useAuthen();

    if (!isAuthenticated) {
        return null; 
    }

    return userRole === "admin" ? <AdminNavbar /> : <UserNavbar />;
};

export default Navbar;
