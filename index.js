const express = require('express')
const cors=require("cors")
const app = express()
require('dotenv').config()
const port =process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express')
//midleware
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.send('hellow server')
})

app.listen(port,()=>{
    console.log('server running',port);
})

//databse name:geniusCar pass:jX9v4Tf4AeOszIBG
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7auxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try{
        await client.connect();
        const collection=client.db("Genius-car").collection("service")
        const bikeCollection=client.db("Genius-car").collection("bike")
        const reviewCollection=client.db("Genius-car").collection("review")
        //multiple data for service  
        app.get('/service',async (req,res)=>{
            const query = {}
        const result = collection.find(query);
        const services=await result.toArray()
        res.send(services)
        })
        //multiple data for bike
        app.get('/bike',async(req,res)=>{
            const query={}
            const bikeResult=bikeCollection.find(query)
            const bike=await bikeResult.toArray()
            res.send(bike)
        })
        //multiple data for review
        app.get('/review',async(req,res)=>{
            const query={}
            const review=reviewCollection.find(query)
            const reviewResult=await review.toArray()
            res.send(reviewResult)
        })
        //single data for service
        app.get("/service/:id",async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const result=await collection.findOne(query)
            res.send(result)
        })
        //single data for bike
        app.get("/bike/:id",async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const result=await bikeCollection.findOne(query)
            res.send(result)
        })
        //post data service
        app.post('/service',async(req,res)=>{
            const newService=req.body
            const result = await collection.insertOne(newService);
            res.send(result)
        })
        //delete service data
        app.delete('/service/:id',async(req,res)=>{
            const id=req.params.id;
            const filter={_id:ObjectId(id)}
            const deleteresult=await collection.deleteOne(filter)
            res.send(deleteresult)
        })
    }
    finally{

    }
}

run().catch(console.dir)
    
