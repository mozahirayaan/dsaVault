import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URL;
if (!uri) {
  throw new Error("MONGODB_URL environment variable is not defined");
}
const client = new MongoClient(uri);
let clientPromise = client.connect().then(() => client);

export default clientPromise;

export async function getDB() {
  if (!clientPromise) {
    clientPromise = client.connect();
  }
  await clientPromise;

  return client.db('dsaVault'); // your DB name
}

