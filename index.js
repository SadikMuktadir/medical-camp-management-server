const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

// MonoDB Connect

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const userCollection = client.db("medicalCamp").collection("user");

    // JWT Connect
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    // Item Collection

    app.get("/item", async (req, res) => {
      const result = await itemCollection.find().toArray();
      res.send(result);
    });
    app.get("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemCollection.findOne(query);
      res.send(result);
    });
    app.patch("/item:id", async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          campName: item.campName,
          category: item.category,
          campFees: item.campFees,
          venueLocation: item.venueLocation,
          targetAudience: item.targetAudience,
          scheduleDateTime: item.scheduleDateTime,
          specialService: item.specialService,
          healthcareProfessional: item.healthcareProfessional,
        },
      };
      const result = await itemCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });
    app.post("/item", async (req, res) => {
      const item = req.body;
      const result = await itemCollection.insertOne(item);
      res.send(result);
    });
    app.delete("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemCollection.deleteOne(query);
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
    // User Collection
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
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
