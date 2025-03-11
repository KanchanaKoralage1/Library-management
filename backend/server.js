 import express from "express"
 import dotenv from "dotenv"
 import { connectToDB } from "./config/db.js";
 import User from "./models/userModel.js";
 import bcryptjs from "bcryptjs";
 import jwt from "jsonwebtoken";
 import cors from "cors";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary"
import Books from "./models/bookModel.js";

 dotenv.config()

 cloudinary.config({

    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
 })

 const app=express();
 const PORT=process.env.PORT || 5000;

 console.log("port is ",process.env.PORT)

 app.use(cors({
    origin:"http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true

    
}))

 
 app.options("*", cors());
 app.use(express.json({limit:"20mb"}));
 app.use(cookieParser());


 //Sign up

 app.post("/api/signup",async(req,res)=>{
    
    const{username,email,password}=req.body;

    try {
        if(!username || !email || !password){
            throw new Error ("Plese fill the all fields. ")
        }

        const emailExists=await User.findOne({email});

        if(emailExists){
            return res.status(400).json({message:"Email is already used."})
        }

        const usernameExists=await User.findOne({username});

        if(usernameExists){
            return res.status(400).json({message:"Username  is already used."})
        }

        //hash the password

        const hashedPassword=await bcryptjs.hash(password,10);

        const userDocument=await User.create({

            username, 
            email, 
            password:hashedPassword

        });

        //JWT implement

        if(userDocument){
            const token=jwt.sign({id:userDocument._id},process.env.JWT_SECRET,{
                expiresIn:"7d",
            });

            res.cookie("token",token,{
                httpOnly:true,
                secure:process.env.NODE_ENV==="production",
                sameSite:"strict",
                maxAge:7*24*60*60*1000,
            })
        }


        // return res.status(201).json({user:userDocument,message:"User created succesfully.."})

        return res.status(201).json({
            user: {
                id: userDocument._id,
                username: userDocument.username,
                email: userDocument.email
            },
            message: "User created successfully."
        });
        

    } catch (error) {
        
        res.status(400).json({message:error.message})
    }
 })


 //login

 app.post("/api/login",async (req,res)=>{
    const{email,password}=req.body;

    try {
        const userDocument=await User.findOne({email});
        if(!userDocument){
            return res.status(400).json({message:"Invalid credentials."})
        }
        const isPasswordValid=await bcryptjs.compareSync(
            password,
            userDocument.password
        );

        if(!isPasswordValid){
            return res.status(400).json({message:"invalid credentials"})
        }

        //JWT 

        if(userDocument){
            const token=jwt.sign({id:userDocument._id},process.env.JWT_SECRET,{
                expiresIn:"7d",
            });

            res.cookie("token",token,{
                httpOnly:true,
                secure:process.env.NODE_ENV==="production",
                sameSite:"strict",
                maxAge:7*24*60*60*1000,
            })
        }


        // return res.status(201).json({user:userDocument,message:"User created succesfully.."})

        return res.status(201).json({
            user: {
                id: userDocument._id,
                username: userDocument.username,
                email: userDocument.email
            },
            message: "Logged in successfully."
        });

    } catch (error) {
        
        res.status(400).json({message:error.message})
    }
 })

 //fetching user

 app.get("/api/fetch-user", async(req,res)=>{
    const{token}=req.cookies;

    if(!token){

        return res.status(401).json({message:"no token provided"});
    }

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message:"Invalid token."})
        }

        const userDocument=await User.findById(decoded.id).select("-password");

        if(!userDocument){
            return res.status(400).json({message:"User not found."})
        }

        res.status(200).json({user:userDocument});

    } catch (error) {
        
        res.status(400).json({message:error.message})
    }
 })

 //logout

 app.post("/api/logout",async(req,res)=>{

    res.clearCookie("token");
    res.status(200).json({message:"Logged out succesfully"});
 })


 // books functionalities

 app.post("/api/addbook",async(req,res)=>{

    const{image,title,subtitle,author,link,review}=req.body
    const{token}=req.cookies;
    if(!token){
        return res.status(401).json({message:"No token provided"})
    }
    try {
        
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){

            return res.status(401).json({message:"Invalid token"})
        }

        //image process 

        const imageResponse=await cloudinary.uploader.upload(image,{
            folder:"/library",
        })

        console.log("Image response : ",imageResponse)

        const userDocument=await User.findById(decoded.id).select("-password");

        const book=await Books.create({
            image:imageResponse.secure_url, 
            title,
            subtitle,
            author,
            link,
            review,
            user:userDocument._id,
        });

        return res.status(200).json({book,message:"The Book is added succesfully"})

    } catch (error) {
        
        res.status(400).json({message:error.message})
    }
 })


 //fetching book images

 app.get("/api/fetchbooks",async(req,res)=>{
    try {
        const books=await Books.find().sort({createdAt:-1})

        return res.status(200).json({books})

    } catch (error) {
        res.status(400).json({message:error.message})

    }
 })

 // search book 

 app.get("/api/search",async (req,res)=>{

    try {
       const searchTerm=req.query.searchTerm || "";
       
       const books=await Books.find({
        title:{$regex:searchTerm,$options:"i"}
       }).sort({createdAt:-1})

       return res.status(200).json({books})
    } catch (error) {

        res.status(400).json({message:error.message})
    }
 })

 // view books when it click

 app.get("/api/fetchbook/:id", async(req,res)=>{

    try {

        const {id}=req.params;
        const book=await Books.findById(id).populate("user",["username"])

        return res.status(200).json({book})

    } catch (error) {

        res.status(400).json({message:error.message})
    }
 })


 //delete part of book

 app.delete("/api/deleteBook/:id", async(req,res)=>{
    const{id}=req.params;
    const{token}=req.cookies;

    if(!token){
        return res.status(401).json({message:"No authorized access"})
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Invalid"})
        }

        const book=await Books.findById(id);

        //delete the image 
        const parts=book.image.split("/");
        const fileName=parts[parts.length-1];

        const imageId=fileName.split(".")[0];

        cloudinary.uploader.destroy(`library/${imageId}`)
        .then((result)=>console.log("result",result))

        //Delete the data from db

        await Books.findByIdAndDelete(id)
        return res.status(200).json({message:"Book deleted succesfully."})

    } catch (error) {
        res.status(400).json({message:error.message})
    }
 })

 //update book

 app.post("/api/updateBook/:id", async (req,res)=>{

    const{image,title,Subtitle,author,link,review}=req.body

    const{token}=req.cookies;

    if(!token){
        return res.status(401).json({message:"No token provided"})
    }

    const{id}=req.params

    try {
        
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){

            return res.status(401).json({message:"Invalid token"})
        }

        const book=await Books.findById(id)

        if(image){

            //delete the previous image

            const parts=book.image.split("/");
            const fileName=parts[parts.length-1];

            const imageId=fileName.split(".")[0];

            cloudinary.uploader.destroy(`library/${imageId}`)
            .then((result)=>console.log("result",result))

            //upload new image

            const imageResponse=await cloudinary.uploader.upload(image,{
                folder:"/library",
            })

            //save update data in db

            const updatedBook=await Books.findByIdAndUpdate(id,{
                image:imageResponse.secure_url, 
                title,
                Subtitle,
                author,
                link,
                review,
                //user:userDocument._id,
            });

            return res.status(200).json({book:updatedBook,message:"Book updated successfully"})
        }


            const updatedBook=await Books.findByIdAndUpdate(id,{
                 
                title,
                Subtitle,
                author,
                link,
                review,
                //user:userDocument._id,
            });

            return res.status(200).json({book:updatedBook,message:"Book updated successfully"})
          

        } catch (error) {
            
            res.status(400).json({message:error.message})
        }
 
 })


 app.listen(PORT,async ()=>{
    await connectToDB()
    console.log("Server started at PORT: ",PORT)
 })