import express, { Request, Response } from 'express';
import dotenv from "dotenv";
import { connectToCluster } from '../db/connect';
import cors from "cors";

dotenv.config();
const DATABASE = process.env.DATABASE || '';
const DATABASE_URL = process.env.DATABASE_URL || '';

const app = express();

app.use(cors())
app.use(express.json());
export const search = async (req: Request, res: Response) => {
    const query = req.query.q?.toString().toLowerCase() || '';
    console.log(query);

    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }
    const mongoClient = await connectToCluster(DATABASE_URL);
    try {
        const db = mongoClient.db(DATABASE);
        const hotelsCollection = db.collection('hotels');
        const citiesCollection = db.collection('cities');
        const countriesCollection = db.collection('countries');
        try {
            const hotels = await hotelsCollection.find({
                $or: [
                    {chain_name: {$regex: query, $options: 'i'}},
                    {hotel_name: {$regex: query, $options: 'i'}},
                    {city: {$regex: query, $options: 'i'}},
                    {country: {$regex: query, $options: 'i'}}
                ]
            }).toArray();
            console.log(hotels);

            const cities = await citiesCollection.find({
                name: {$regex: query, $options: 'i'}
            }).toArray();

            const countries = await countriesCollection.find({
                country: {$regex: query, $options: 'i'}
            }).toArray();

            res.json({hotels, cities, countries});
        } catch (error) {
            res.status(500).json({ message: error });
        }
    } finally {
        await mongoClient.close();
    }
};
