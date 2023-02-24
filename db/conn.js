import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const DB = process.env.DATABASE_NAME

mongoose.set('strictQuery', false);
mongoose.connect(DB,{
    useNewUrlParser: true, useUnifiedTopology: true 
}).then(() => {
    console.log("Database connected")
}).catch((err) => {
    console.log(err)
})