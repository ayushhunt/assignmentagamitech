import connectMongo from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req:Request){
    try {
        const body =await req.json();

        const {email,password}=body;

        await connectMongo();

        const user = await User.findOne({email});

        if(!user){
            return NextResponse.json({message:"Invalid credentials"},{status:400})
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return NextResponse.json({message:'Invalid Credentials'},{status:400})
        }

        const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET!,{expiresIn:'1h'});

        const response = NextResponse.json({token},{status:200});

        response.cookies.set('token',token,{
            httpOnly:false,
            sameSite:'lax',
            path:'/',
            maxAge:60*60,
        })
        response.cookies.set('role',user.role,{
            httpOnly:false,
            sameSite:'lax',
            path:'/',
            maxAge:60*60,
        })
        return response;

    } catch (error) {
        console.error(error);
        return NextResponse.json({message:"Server Error"},{status:500})
    }
}