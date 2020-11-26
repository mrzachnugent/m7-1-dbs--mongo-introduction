const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI, dbName } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {
  const documentData = req.body;

  if (!documentData.name || Object.keys(documentData).length > 1) {
    res.status(400).json({
      status: 400,
      message: "You can only create a document with name as the key value.",
      data: documentData,
    });
  } else {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();

    const db = client.db(dbName);

    await db.collection("users").insertOne(documentData);

    client.close();

    res.status(200).json({
      status: 200,
      message: "success",
      data: documentData,
    });
  }
};

module.exports = { addUser };
