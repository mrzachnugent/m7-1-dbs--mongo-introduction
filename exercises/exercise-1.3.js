const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI, dbName } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUsers = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();

  const db = client.db(dbName);

  const data = await db.collection("users").find().toArray();

  if (data.length < 1) {
    res.status(404).json({
      status: 404,
      message: "error",
      data: data,
    });
  } else {
    res.status(200).json({
      status: 200,
      data: data,
    });
  }

  client.close();
};

module.exports = { getUsers };
