import connectMongo from "@/app/lib/mongodb";
import { verifyToken } from "@/app/middleware/auth";
import Registration from "@/app/models/Registration";
import { NextResponse } from "next/server";

export async function PATCH(req:Request,{params}:{params:{id:string}}) {
    const user = await verifyToken(req);

    if (user instanceof NextResponse) return user;

    if (user.role !== 'admin'){
        return NextResponse.json({messaeg:"Only admins can update the Conferences"},{status:403});
    }
    const {approved} = await req.json();

    try {
        await connectMongo();

        const {id}= await params;

        const regis = await Registration.findById(id);
        if(!regis){
            return NextResponse.json({message:"Registration not found"},{status:404});
        }

        regis.approved = approved || regis.approved;

        await regis.save();

        return NextResponse.json({message:"Approved "},{status:201})

    } catch (error) {
        return NextResponse.json({message:'error approving'},{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{id:string}}){
    const user = await verifyToken(req);

    if (user instanceof NextResponse) return user;

    if (user.role !== 'admin'){
        return NextResponse.json({messaeg:"Only admins can update the Conferences"},{status:403});
    }

    try {
        await connectMongo()

        const {id} = await params;
        const regis = await Registration.findById(id);
        if(!regis){
            return NextResponse.json({message:"Registration not found"},{status:404});
        }
        await Registration.findByIdAndDelete(id);
        return NextResponse.json({message:"deleted "},{status:201})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message:"Error deleteing"},{status:500})
    }
}

