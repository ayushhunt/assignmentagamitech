import connectMongo from "@/app/lib/mongodb";
import { verifyToken } from "@/app/middleware/auth";
import Conference from "@/app/models/Conference";
import Registration from "@/app/models/Registration";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const user = await verifyToken(req);
    if (user instanceof NextResponse) return user;

    if (user.role !== 'user'){
        return NextResponse.json({messaeg:"Only users can do registration"},{status:403});
    }

    const {conferenceId} = await req.json();

    try {
        await connectMongo();

        const conf = await Conference.findById(conferenceId);

        if(!conf){
            return NextResponse.json({message:'Conference not found'},{status:404});
        }

        const existingRegistration = await Registration.findOne({conferenceId:conferenceId,userId:user._id});

        if(existingRegistration){
            return NextResponse.json({message:"Registation already there"},{status:400});
        }

        const registation = new Registration({
            conferenceId:conferenceId,
            userId:user._id
        })
        await registation.save();
        return NextResponse.json({message:"Registered sucessfully"},{status:201});
    } catch (error) {
        return NextResponse.json({message:"Error in registraton"},{status:500})
    }
}


export async function GET(req:Request){
    const user = await verifyToken(req);

    if (user instanceof NextResponse) return user;

    if (user.role !== 'user'){
        return NextResponse.json({messaeg:"Only users can see there registration"},{status:403});
    }
    try {
        await connectMongo();
        const regis = await Registration.find({userId:user._id});
        return NextResponse.json(regis);
    } catch (error) {
        return NextResponse.json({message:'error getting registartions'},{status:500});
    }
}