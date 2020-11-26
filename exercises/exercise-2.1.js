const assert = require("assert");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, dbName } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  const documentData = req.body;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(dbName);
    const result = await db.collection("greetings").insertOne(documentData);
    //what does this do? (assert)
    assert.strictEqual(1, result.insertedCount);

    res.status(201).json({
      status: 201,
      message: "success",
      data: documentData,
    });
    client.close();
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({
      status: 500,
      data: documentData,
      message: err.message,
    });
  }
};

const getGreeting = async (req, res) => {
  const { _id } = req.params;
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db(dbName);
  await db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not found" });
  });
};

const getGreetings = async (req, res) => {
  const { start, limit } = req.query;

  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(dbName);
    const result = await db.collection("greetings").find().toArray();

    if (!start && !limit) {
      res.status(200).json({
        status: 200,
        start: 0,
        limit: "none",
        message: "great success",
        data: result,
      });
    } else if (!limit) {
      res.status(200).json({
        status: 200,
        message: "great success",
        start: start,
        limit: "none",
        data: result.slice(start, result.length),
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "great success",
        start: start,
        limit: limit,
        data: result.slice(start, Number(start) + Number(limit)),
      });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ status: 400, message: "Unknown error" });
  }
};

const deleteGreeting = async (req, res) => {
  const { lang } = req.params;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(dbName);
    await db.collection("greetings").deleteOne({ lang: lang });

    res.status(204).json({
      status: 204,
      message: "success",
      data: { lang: lang },
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({
      status: 500,
      data: `The are no entries with ${lang} as a language`,
      message: err.message,
    });
  }
};

const updateGreeting = async (req, res) => {
  const { _id } = req.params;
  const query = { _id };
  const body = req.body;
  const newValues = { $set: { ...body } };

  if (!body.hello || Object.keys(body).length > 1) {
    res.status(400).json({
      staus: 400,
      message: "Body must only have hello as key value",
      data: body,
    });
    return;
  }

  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(dbName);
    const results = await db
      .collection("greetings")
      .updateOne(query, newValues);

    assert.equal(1, results.matchedCount);
    assert.equal(1, results.modifiedCount);

    res.status(204).json({
      status: 204,
      message: "success",
      data: body,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({
      status: 500,
      data: body,
      message: err.message,
    });
  }
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
