'use client'
import Link from "next/link";
import useAuthen from "./components/useAuthen";
import { useEffect, useState } from "react";

export default function Home() {

  const {userRole,isAuthenticated}=useAuthen();
  const [isLoading,setIsLoading]=useState(true);

  useEffect(()=>{
    if(isAuthenticated !== null){
      setIsLoading(false);
    }
  },[isAuthenticated]);
 console.log(isAuthenticated);
  if(isLoading)
    return <p>Loading...</p>
  return (
    <div className="flex h-screen">
      {!isAuthenticated ? (
        <div className="space-x-4 justify-center ">
          <Link href="/pages/login">
            <div className="btn">Login</div>
          </Link>
          <Link href="/pages/register">
            <div className="btn">Register</div>
          </Link>
        </div>
      ):(
        <div>You are logged in</div>
      )}
    </div>
  );
}
