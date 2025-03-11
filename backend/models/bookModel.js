import mongoose from "mongoose"

const bookSchema=new mongoose.Schema({

    image:{type:String, required:true},
    title:{type:String, required:true},
    subtitle:{type:String},
    author:{type:String,required:true},
    link:{type:String,required:true},
    review:{type:String},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},

},{timestamps:true});

const Books=mongoose.models.Books || mongoose.model("Books",bookSchema)

export default Books