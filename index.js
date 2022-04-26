const express = require('express')
const cors=require("cors")
const app = express()
var jwt = require('jsonwebtoken');

require('dotenv').config()
const port =process.env.PORT
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express')
//midleware
app.use(cors())
app.use(express.json())
function verifyJWT(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message:"unauthorized access"})
    }
    const token=authHeader.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
        if(err){
            return res.status(403).send({message:"forbidden access"})
        }
        console.log(decoded);
        req.decoded=decoded
    })
    console.log(authHeader);
    next()
}
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
        const reviewCollection=client.db("Genius-car").collection
        ("review")
        const orderCollection=client.db("Genius-car").collection
        ("order")
        //auth
        app.post('/token',async(req,res)=>{
           
            const user=req.body
            const token = jwt.sign(user, process.env.ACCESS_TOKEN,{
                expiresIn:"1d"
            });
            res.send({token})
        })
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
        //create order
        app.post('/order',async(req,res)=>{
            const query=req.body
            const result=await orderCollection.insertOne(query)
            res.send(result)
        })
        //get order api
        app.get('/order',verifyJWT,async(req,res)=>{
            const decodedEmail=req.decoded.email
            const email=req.query.email
           if(email===decodedEmail){
            const query={email:email}
            const orderResult=orderCollection.find(query)
            const result=await orderResult.toArray()
            res.send(result)
           }
           else{
            return res.status(403).send({message:"forbidden access"})
           }
        })
    }
    finally{

    }
}

run().catch(console.dir)
    
