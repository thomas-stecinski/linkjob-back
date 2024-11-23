const readline = require("readline");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const uri = process.env.DB_URL;
const dbName = "test";

async function dropAllCollections() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collections = await database.listCollections().toArray();

        if (collections.length === 0) {
            console.log("No collections to drop.");
            return;
        }

        // Convert callback-based question to Promise
        const answer = await new Promise((resolve) => {
            rl.question(
                `Are you sure you want to drop all collections in the database '${dbName}'? This action cannot be undone. (yes/no): `,
                resolve
            );
        });

        if (answer.toLowerCase() === "yes") {
            for (let collection of collections) {
                await database.collection(collection.name).drop();
                console.log(`Dropped collection: ${collection.name}`);
            }
            console.log("All collections dropped!");
        } else {
            console.log("Operation canceled.");
        }
        rl.close();
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

dropAllCollections();
