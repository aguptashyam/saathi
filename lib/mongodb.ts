import { MongoClient, type Db } from "mongodb"

let client: MongoClient
let db: Db

export async function connectToDatabase() {
  if (db) {
    return { client, db }
  }

  try {
    client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017/mindcare")
    await client.connect()
    db = client.db("mindcare")

    console.log("Connected to MongoDB")
    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw error
  }
}

export { db }
