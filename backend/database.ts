import mongoose, { ConnectOptions } from 'mongoose';
import { NextFunction, Request, Response } from 'express';


const connectToDatabase = async () => {
    try {
        const databaseUri = process.env.DATABASE_URL || '';
        await mongoose.connect(databaseUri);
    } catch (error) {
        throw error; 
    }
}

const checkDatabaseConnection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await connectToDatabase();
        next(); 
    } catch (error) {
        res.status(500).send("Şu anda veritabanına bağlanılamıyor. Lütfen daha sonra tekrar deneyin.");
    }
}



export default checkDatabaseConnection;