const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;

const uri = "mongodb+srv://ftp:andre1122333@cluster0.qxzkw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(cors());
app.use(express.json());

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("school");
    const teachersCollection = db.collection("teachers");
    const subjectsCollection = db.collection("subjects");

    // API endpoints
    app.get('/api/teachers', async (req, res) => {
      const teachers = await teachersCollection.find().toArray();
      res.json(teachers);
    });

    app.post('/api/teachers', async (req, res) => {
      const newTeacher = req.body;
      await teachersCollection.insertOne(newTeacher);
      res.status(201).json(newTeacher);
    });

    app.get('/api/subjects', async (req, res) => {
      const subjects = await subjectsCollection.find().toArray();
      res.json(subjects);
    });

    app.post('/api/subjects', async (req, res) => {
      const newSubject = req.body;
      await subjectsCollection.insertOne(newSubject);
      res.status(201).json(newSubject);
    });

    app.delete('/api/subjects/:name', async (req, res) => {
      const subjectName = req.params.name;
      await subjectsCollection.deleteOne({ name: subjectName });
      await teachersCollection.updateMany({}, { $pull: { subjects: subjectName } });
      res.status(204).send();
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } finally {
    // Do not close the client here, keep it open for the server
  }
}
run().catch(console.dir);