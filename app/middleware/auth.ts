import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import connectMongo from "../lib/mongodb";
import User from "../models/User";



export async function verifyToken(req:Request){
    const authHeader = req.headers.get('authorization');
    let token: string | undefined;

    if(authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if(!token){
        const cookieStore = cookies();
        token = (await cookieStore).get('token')?.value;
    }

    if(!token){
        return NextResponse.json({message:'TOken is missing'},{status:401});
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET!);
        await connectMongo();
        
        const user = await User.findById((decoded as any).id);
        if(!user){
            return NextResponse.json({message:'User not found'},{status:404});
        }
        return user;
    } catch (error) {
        console.error(error);
        return NextResponse.json({message:"Invalid Token"},{status:401});
    }
}