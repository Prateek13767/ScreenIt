import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import {clerkMiddleware} from '@clerk/express';
import {serve} from "inngest/express";
import {inngest,functions} from './inngest/index.js'


const app=express();


const PORT=process.env.PORT;


await connectDB();

//middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());



//API ROUTES
app.get('/',(req,res)=>{
    res.send("Server is LIVE");
})

app.use('/api/inngest',serve({client:inngest,functions}))


app.listen(PORT,(req,res)=>{
    console.log(`server is running on PORT ${PORT}`);
    
})