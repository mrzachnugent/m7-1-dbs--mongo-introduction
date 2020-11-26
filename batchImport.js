const fs = require("file-system");
const assert = require("assert");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, dbName } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const batchImport = async () => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(dbName);
    const result = await db.collection("greetings").insertMany(greetings);
    assert.strictEqual(greetings.length, result.insertedCount);
    console.log("success");
    // res.status(201).json({
    //   status: 201,
    //   message: "success",
    //   data: greetings,
    // });
  } catch (err) {
    console.log(err.stack);
    // res.status(500).json({
    //   status: 500,
    //   data: greetings,
    //   message: err.message,
    // });
  }
};

// module.exports = { batchImport };
batchImport();
