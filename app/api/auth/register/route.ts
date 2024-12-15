import connectMongo from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req:Request){
    try {
        const body = await req.json();
        const {name,email,password}= body;


        await connectMongo();

        const existingUser = await User.findOne({email});

        if(existingUser) {
            return NextResponse.json({message:'User exists'},{status:400});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            email,
            password:hashedPassword,
            name
        })

        await newUser.save();


        const response = NextResponse.json({message:"Registration Successfull"});

        

        return response;
    } catch (error) {console.error(error);
        return NextResponse.json({message:"Server error"},{status:500});
        
    }
}