import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import {randomBytes} from "crypto"
import winston from 'winston'

dotenv.config();
const port = process.env.PORT;
const app = express();
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    ),
    transports:[
        new winston.transports.Console(),
        new winston.transports.File({filename: 'app.log'})
    ]
});

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.post("/events", async(req, res) => {
    console.log(`Trip Service recieved ${req.body.type} event`);
    logger.info(`Nothing to do here. Just logging an ${req.body.type} event`)
    res.send({});
});
app.post('/createTrip', async (req, res) => {
    const body = req.body;
    logger.info(`Creating a Trip`);
    //{location:STRING, coordinates:OBJECT, startDate:DATE, endDate:DATE, itinerary:OBJECT} = body
    body.id = randomBytes(5).toString('hex');
    body.type = "CreateTrip";
    // body.coords = await(await fetch(`http://location:54210/coords/${body.location}`)).json();
    // collection.insertOne(body);
    let r = await fetch("http://eventbus:54215/events", {
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    if(r.status === 200){
        res.send("OK");
        logger.info(`Successful creation of trip`);
        return;
    }
    res.status(400).send("Bad Request");
    logger.error(`Error 400 encountered while creatingTrip`);
});
app.put('/editTrip/:tripId', async (req, res) => {
    logger.info(`Editing a trip`);
    const {location, startDate, endDate, itinerary} = req.body;
    const id = req.params.tripId;
    const type = "EditTrip";
    const misc = {tId: req.params.tripId}
    //{location:STRING, coordinates:OBJECT, startDate:DATE, endDate:DATE, itinerary:OBJECT} = body
    // const coords = await(await fetch(`http://location:54210/coords/${location}`)).json();
    let r = await fetch(`http://eventbus:54215/events`, {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({type, misc, id, location, startDate, endDate, itinerary})
    })
    if(r.status === 200){
        res.send("OK");
        logger.info(`Successful edit of trip`);
        return;
    }
    res.status(400).send("Bad Request");
    logger.error(`Error 400 encountered for editTrip`);
});
app.delete("/:tripId", async (req, res) => {
    logger.info(`Deleting a Trip`)
    let r = await fetch(`http://eventbus:54215/events`, {
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({type: "DeleteTrip", tId: req.params.tripId})
    });
    // console.log(r);
    if(r.status === 200){
        res.send("OK");
        logger.info(`Successful deletion of trip`)
        return;
    }
    res.status(400).send("Bad Request");
    logger.error(`Error 400 encountered for deleteTrip`)
});
app.listen(port, () => console.log(`Trip Service Listening on Port ${port}`))