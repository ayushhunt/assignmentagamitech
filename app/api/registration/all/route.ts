import connectMongo from "@/app/lib/mongodb";
import Registration from "@/app/models/Registration";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        await connectMongo();
        const regis = await Registration.find();
        return NextResponse.json(regis);
    } catch (error) {
        return NextResponse.json({message :"server error"},{status:500})
    }
}