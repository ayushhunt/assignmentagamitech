'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";


const Login = () => {
    const [formData,setFormData]= useState({
        email:'',
        password:''
    })

    const [loading,setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement 
        | HTMLSelectElement>) => {
            setFormData({ ...formData,[e.target.name]:e.target.value});
        }

    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login',{
                method:'POST',
                headers: {
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(formData),
            });
            if(response.ok) {
                router.push('/pages/dashboard')
            } else {
                console.error('Failed to login')
            }
        } catch (error) {
            console.error('Error',error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="bg-blue-400 p-10 rounded-xl shadow-lg max-w-lg w-full">
                <h2 className="text-3xl font-bold text-center text-black"> Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" className="w-full mb-4 border text-black placeholder:text-fuchsia-900 " value={formData.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" className="w-full mb-4 border text-black placeholder:text-fuchsia-900 " value={formData.password} onChange={handleChange} required />
                    <button type="submit" className={`w-full p-4 text-black rounded-lg bg-white hover:bg-slate-800 transition-colors duration-100 
                    ${
                        loading ? 'cursor-not-allowed' : ''
                    }
                    `}>
                        {loading ? (
                            <span className="animate-spin inline-block w-5 h-5 border-4 border-t-transparent border-white rounded-full"></span>
                        ):('LogIn')}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;