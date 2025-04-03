import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({
    path: "./.env"
});
export default async function connect(){
    try{
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection;
        connection.on('connected',()=>{
            console.log('MongoDB connected Successfully');
        })
        connection.on('error',(error)=>{
            console.log('MongoDB connection error'+error)
        })
    }
    catch(error){
        console.log('Something went wrong while connecting to the database');
        console.log(error)
    }
}