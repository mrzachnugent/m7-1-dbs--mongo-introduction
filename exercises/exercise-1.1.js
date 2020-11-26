const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbFunction = async (dbName) => {
  //This creates "the client", is it me as mongoDb client, or user on my web app?
  const client = await MongoClient(MONGO_URI, options);

  //Connects the mongoDb to the client but not the database?
  await client.connect();

  //Connect the client to the database. Again who is the client? Is it every user from my webapp?
  const db = client.db(dbName);
  console.log("Connected.");

  await db.collection("users").insertOne({ name: "Buck Rogers" });

  //Close the connection to the database server
  client.close();
  console.log("Disconnected.");
};

dbFunction("exercise_1");
