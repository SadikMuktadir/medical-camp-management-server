const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

// MonoDB Connect

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k6zwazt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const itemCollection = client.db("medicalCamp").collection("item");
    const reviewCollection = client.db("medicalCamp").collection("review");
    const registerCollection = client.db("medicalCamp").collection("info");
    const campDetailsCollection = client.db("medicalCamp").collection("camp");

    // Item Collection

    app.get("/item", async (req, res) => {
      const result = await itemCollection.find().toArray();
      res.send(result);
    });

    // Review Collection

    app.get("/review", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    // Register Collection
    app.post("/info", async (req, res) => {
      const information = req.body;
      const result = await registerCollection.insertOne(information);
      res.send(result);
    });
    // CampDetails Collection
    app.post("/camp", async (req, res) => {
      const campInfo = req.body;
      const result = await campDetailsCollection.insertOne(campInfo);
      res.send(result);
    });

    app.get("/camp", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await campDetailsCollection.find(query).toArray();
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.listen(port, () => {
  console.log("Server is running");
});
