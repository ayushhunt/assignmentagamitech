"use client"
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    id:string;
    role:string;
}

const useAuthen = () => {
    const [userRole,setUserRole]=useState<string | null>(null);
    const [isAuthenticated,setIsAuthenticated]= useState<boolean | null>(null);

    useEffect(()=>{
        const token = Cookies.get('token');
        if(token){
            try {
                const decoded : DecodedToken = jwtDecode(token);
                setUserRole(decoded.role);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Invalid token",error);
                setIsAuthenticated(false);
            }
        }else {
            setIsAuthenticated(false);
        }
    },[]);
    return {userRole,isAuthenticated};
}

export default useAuthen;