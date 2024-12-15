import connectMongo from "@/app/lib/mongodb";
import { verifyToken } from "@/app/middleware/auth";
import Conference from "@/app/models/Conference";
import { NextResponse } from "next/server";

export async function PUT(req:Request,{params}:{params:{id:string}}) {
    const user = await verifyToken(req);
    if (user instanceof NextResponse) return user;

    if (user.role !== 'admin'){
        return NextResponse.json({messaeg:"Only admins can update the Conferences"},{status:403});
    }

    try {
        const {title,description,venue,schedules} = await req.json();
        await connectMongo();

        const {id} = await params;

        const conf = await Conference.findById(id);
        if(!conf){
            return NextResponse.json({message:"Conference not found"},{status:404});
        }
        conf.title = title || conf.title;
        conf.description = description || conf.description;
        conf.venue = venue || conf.venue;
        conf.schedules = schedules || conf.schedules;

        await conf.save();

        return NextResponse.json({message:"Updated sucessfully",conf});
    } catch (error) {
        return NextResponse.json({message:'error update conference'},{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{id:string}}) {
    const user = await verifyToken(req);
    if (user instanceof NextResponse) return user;

    if (user.role !== 'admin'){
        return NextResponse.json({messaeg:"Only admins can update the Conferences"},{status:403});
    }

    try {
        await connectMongo();
        const {id} = await params;

        const conf = await Conference.findById(id);
        if(!conf){
            return NextResponse.json({message:"Conference not found"},{status:404})
        }
        await Conference.findByIdAndDelete(params.id);

        return NextResponse.json({message: "Confernce deleted "},{status:201});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message:"Error deleteing"},{status:500});
    }
}

export async function POST(req:Request,{params}:{params:{id:string}}){
    const {feedback}= await req.json();

    try {
        await connectMongo();
        const {id} = await params;

        const conf = await Conference.findById(id);
        if(!conf){
            return NextResponse.json({message:"Conference not found"},{status:404})
        }
        conf.feedback.push(feedback);
        await conf.save();

        return NextResponse.json({message:"Feedback recorded "},{status:201})

    } catch (error) {
        console.error(error);
        return NextResponse.json({message:"Error"},{status:500});
    }
}