const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getCollection = async (dbName) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();

  const db = client.db(dbName);

  const data = await db.collection("users").find().toArray();
  console.log(data);

  client.close();
};

getCollection("exercise_1");
