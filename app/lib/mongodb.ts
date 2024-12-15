import mongoose from "mongoose";


const connectMongo = async () => {
    if (mongoose.connection.readyState>=1){
        return;
    }
    await mongoose.connect(process.env.MONGODBURI!);
}

export default connectMongo;