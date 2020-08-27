import { MongoClient } from "mongo";


const client = new MongoClient();

client.connectWithUri("mongodb://localhost:27017");

export const db = client.database("test");