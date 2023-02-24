import UserModel from '../models/uesrsSchema.js'
import csv from "fast-csv"
import fs from "fs"
import dotenv from 'dotenv'
dotenv.config()
const BASE_URL = process.env.BASE_URL

export const userPost = async (req, res) => {
    console.log(req.file)
    const file = req.file.filename;
    const {fname , lname , email,mobile  ,gender,location,status} = req.body;

    if(!fname || !lname || !email || !mobile || !gender || !location || !status) {
        res.status(401).json("All inputs are required")
    }

    try {
        const user = await UserModel.findOne({email})

        if(user){
            res.status(401).json("This user already exist in our database")
        }else{
            const newUser = await UserModel.create({fname , lname , email , mobile , gender, location, status,profile:file})
            res.status(200).json(newUser)
        }
    } catch (error) {
        res.status(500).json(error)
        console.log("error in registering user")

    }
}

export const usersget = async (req, res) => {
    const search = req.query?.search
    const gender = req.query?.gender 
    const status = req.query?.status 
    const sort = req.query?.sort
    const page = req.query.page || 1
    const ITEM_PER_PAGE = 4;
    
    const query = {
        fname: { $regex: search, $options: "i" }
    }

    if (gender !== "All") {
        query.gender = gender
    }

    if (status !== "All") {
        query.status = status
    }
    try {

        const skip = (page - 1) * ITEM_PER_PAGE
        const count = await UserModel.countDocuments(query);

        const usersdata = await UserModel.find(query)
        .sort({ createdAt: sort === "new" ? -1 : 1 })
        .limit(ITEM_PER_PAGE)
        .skip(skip);

         const pageCount = Math.ceil(count/ITEM_PER_PAGE);  // 8 /4 = 2

        res.status(200).json({
            Pagination:{
                count,pageCount
            },
            usersdata
        })
    } catch (error) {
        res.status(500).json(error)
        console.log("error in getting users" , error)
    }
}

export const singleuserget = async (req, res) => {
    const {id} = req.params;
    console.log(id)
    try {
        const user = await UserModel.findOne({_id:id})
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
        console.log("error in getting single user",error)
    }
}

export const userEdit = async(req, res) => {
    const {id} = req.params
    const {fname , lname , email,mobile  ,gender,location,status , user_profile} = req.body;
    const file = req.file?req.file.filename: user_profile

    try {
        const updateUser = await UserModel.findByIdAndUpdate({_id:id} , {fname , lname , email,mobile  ,gender,location,status , profile:file},{new:true})
      
        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json(error)
        console.log("error in updating user" , error)
    }
}

export const userdelete = async (req, res) => {
    const {id} = req.params;

    try {
        const deleteduser = await UserModel.findByIdAndDelete(id)
        res.status(200).json(deleteduser)
    } catch (error) {
        res.status(500).json(error)
        console.log("error in deleting user")
    }
}

// chnage status
export const userstatus = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    try {
        const userstatusupdate = await UserModel.findByIdAndUpdate({ _id: id }, { status: data }, { new: true });
        res.status(200).json(userstatusupdate)
    } catch (error) {
        res.status(401).json(error)
    }
}

// export user
export const userExport = async (req, res) => {
    try {
        const usersdata = await UserModel.find();

        const csvStream = csv.format({ headers: true });

        // if (!fs.existsSync("public/files/export/")) {
        //     if (!fs.existsSync("public/files")) {
        //         fs.mkdirSync("public/files/");
        //     }
        //     if (!fs.existsSync("public/files/export")) {
        //         fs.mkdirSync("./public/files/export/");
        //     }
        // }

        fs.mkdirSync("public/files/export/", { recursive: true });

        const writablestream = fs.createWriteStream(
            "public/files/export/users.csv"
        );

        csvStream.pipe(writablestream);

        console.log(BASE_URL)

        writablestream.on("finish", function () {
            res.json({
                downloadUrl: `${BASE_URL}/files/export/users.csv`,
            });
        });
        if (usersdata.length > 0) {
            usersdata.map((user) => {
                csvStream.write({
                    FirstName: user.fname ? user.fname : "-",
                    LastName: user.lname ? user.lname : "-",
                    Email: user.email ? user.email : "-",
                    Phone: user.mobile ? user.mobile : "-",
                    Gender: user.gender ? user.gender : "-",
                    Status: user.status ? user.status : "-",
                    Profile: user.profile ? user.profile : "-",
                    Location: user.location ? user.location : "-",
                    DateCreated: user.createdAt ? user.createdAt : "-",
                    DateUpdated: user.updatedAt ? user.updatedAt : "-",
                })
            })
        }
        csvStream.end();
        writablestream.end();

    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}