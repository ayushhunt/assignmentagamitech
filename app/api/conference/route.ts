import connectMongo from "@/app/lib/mongodb";
import { verifyToken } from "@/app/middleware/auth";
import Conference from "@/app/models/Conference";
import { NextResponse } from "next/server";


export async function GET(){
    try {
        await connectMongo();
        const confs = await Conference.find()
        return NextResponse.json(confs);
    } catch (error) {
        return NextResponse.json({message:'error getting conferenences'},{status:500});
    }
}



export async function POST(req: Request){
    const user = await verifyToken(req);
    
    if(user instanceof NextResponse) return user;

    if(user.role!=='admin'){
        return NextResponse.json({messaeg:"Only admins can add the Conferences"},{status:403});
    }

    try {
        const {title,description,venue,schedules} = await req.json();

        await connectMongo();

        const newConf = new Conference({
            title,
            description,
            venue,
            schedules
        })

        await newConf.save();
        return NextResponse.json({message:"Conference added succuessfully"},{status:201});
    } catch (error) {
        return NextResponse.json({message:"Error"},{status:500});
    }
}