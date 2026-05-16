const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const app = express();

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

dotenv.config();

const uri = process.env.MONGODB_URI;

const PORT = process.env.PORT || 5000;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db('worldview');
    const destinationCollection = db.collection('destinations');

    app.get('/destination', async (req, res)=>{
        const result = await destinationCollection.find().toArray()
        res.json(result);
    })

    app.get('/destination/:id', async (req, res)=>{
        const {id} = req.params;
        const result = await destinationCollection.findOne({_id: new ObjectId(id)})
        res.json(result);
    })

    app.post('/destination', async (req, res)=>{
        const destinationData = req.body;
        console.log(destinationData, 'destinationData');
        const result =await destinationCollection.insertOne(destinationData);
        res.json(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('Server is running fine!')
})

app.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT}`);
})