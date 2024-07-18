import request from 'supertest';
import { MongoClient } from 'mongodb';
import { app } from '../index';
import { connectToCluster, getDb } from '../db/connect';

// Mock data for testing
const mockHotels = [
    {
        chain_name: "Mock Chain",
        hotel_name: "Mock Hotel",
        addressline1: "123 Mock St",
        city: "Mock City",
        state: "Mock State",
        country: "Mock Country",
        countryisocode: "MC",
        star_rating: 5
    }
];

const mockCities = [
    { name: "Mock City" }
];

const mockCountries = [
    { country: "Mock Country", countryisocode: "MC" }
];

let connection: MongoClient;

beforeAll(async () => {
    connection = await connectToCluster();
    const db = getDb();
    await db.collection('hotels').insertMany(mockHotels);
    await db.collection('cities').insertMany(mockCities);
    await db.collection('countries').insertMany(mockCountries);
});

afterAll(async () => {
    const db = getDb();
    await db.collection('hotels').deleteMany({});
    await db.collection('cities').deleteMany({});
    await db.collection('countries').deleteMany({});
    await connection.close();
});

describe('GET /search', () => {
    it('should return matching hotels, cities, and countries', async () => {
        const response = await request(app).get('/search').query({ q: 'mock' });
        expect(response.status).toBe(200);
        expect(response.body.hotels).toHaveLength(1);
        expect(response.body.cities).toHaveLength(1);
        expect(response.body.countries).toHaveLength(1);
    });

    it('should return 400 if query is missing', async () => {
        const response = await request(app).get('/search');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Query is required');
    });
});
