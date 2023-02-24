import mongoose from "mongoose";
import validator from "validator";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
       trim:true
    },
    lname:{
        type:String,
        required:true,
       trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validete(value){
            if(!validator.isEmail(value)){
                throw Error("not valid email")
            }
        }
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
        minlength:10,
        maxlength:10,
    },
    gender:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    profile:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
},{
    timestamps:true
});

//Export the model
export default mongoose.model('User', userSchema);