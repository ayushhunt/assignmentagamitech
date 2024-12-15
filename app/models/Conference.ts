import mongoose ,{Schema,model,models} from "mongoose"


const conferenceSchema = new Schema({
    title:{type:String,required:true},
    description:{type:String},
    venue:{type:String,required:true},
    schedules:{type:String},
    feedback:[{type:String}]
},{timestamps:true});


const Conference= models.Conference || model('Conference',conferenceSchema);
export default Conference;