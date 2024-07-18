import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { connectToCluster } from "./db/connect";
import { search } from './routes/search';

dotenv.config();
const PORT = process.env.PORT || 3001;
const DATABASE = process.env.DATABASE || '';
const DATABASE_URL = process.env.DATABASE_URL || '';

const app = express();

app.use(cors())
app.use(express.json());

app.get('/hotels', async (req, res) => {
  const mongoClient = await connectToCluster(DATABASE_URL);
  try {
    const db = mongoClient.db(DATABASE)
    const collection = db.collection('hotels');
    res.send(await collection.find().toArray())
  } finally {
    await mongoClient.close();
  }
})

app.get('/cities', async (req, res) => {
  const mongoClient = await connectToCluster(DATABASE_URL);
  try {
    const db = mongoClient.db(DATABASE)
    const collection = db.collection('cities');
    res.send(await collection.find().toArray())
  } finally {
    await mongoClient.close();
  }
})

app.get('/countries', async (req, res) => {
  const mongoClient = await connectToCluster(DATABASE_URL);
  try {
    const db = mongoClient.db(DATABASE)
    const collection = db.collection('countries');
    res.send(await collection.find().toArray())
  } finally {
    await mongoClient.close();
  }
})

app.get('/search', search);

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`)
})

