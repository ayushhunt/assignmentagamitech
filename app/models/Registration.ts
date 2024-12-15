import mongoose ,{Schema,model,models} from "mongoose";


const registrationSchema = new Schema({
    conferenceId : {type:Schema.Types.ObjectId, ref:'Conference',required:true},
    userId:{type:Schema.Types.ObjectId, ref:'User',required:true},
    approved:{type:Boolean, default:false}
},{timestamps:true})

const Registration = models.Registration || model('Registration',registrationSchema);

export default Registration;

