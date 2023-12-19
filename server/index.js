import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import winston from 'winston'
import client from './modules/DBConn.js';

const db = client.connectdb("Traveling");
const collection = db.collection("Plans");

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
app.use(cors({
    origin:"http://localhost:54214"
}));
app.use(express.json());

app.get("/all", async (req, res) => {
    let r = await collection.find();
    let d = await r.toArray()
    console.log(d);
    if(d.length === 0){
        res.status(200).send([]);
        return;
    }
    res.send(JSON.stringify(d));
    logger.info(`Sent the entire collection to Client`)
});

async function makeTrip (body){
    await collection.insertOne(body);
    logger.info(`Created Trip in DB`);
    return ("OK");
}
async function editTrip(body, trip){
    const {id, location, itinerary, startDate, endDate} = body
    await collection.replaceOne(
        {"id": trip},
        {id, location, startDate, endDate, itinerary}
    );
    logger.info(`Updated Trip in DB`);
    return ("OK");
}
async function delTrip(id){
    await collection.deleteOne({"id": id});
    logger.info(`Deleted Trip in DB`);
    return ("OK");
}

app.post("/events", async(req, res) => {
    console.log(`The Server recieved ${req.body.type} event`);
    logger.info(`Received ${req.body.type} event`);
    if(req.body.type === "LocationAppended"){
        let r = await updatePlan(req.body, req.body.misc.tId);
        if(r === "OK"){
            res.send("OK");
            logger.info(`Successful processing of ${req.body.type} event`)
            return;
        }
        res.status(400).send("Bad request");
        logger.error("Bad request: Plan => Line 68: server");
        return;
    }
    else if(req.body.type === "DeletePlan"){
        let r = await deletePlan(req.body.tId, req.body.pId);
        if(r === "OK"){
            res.send("OK");
            logger.info(`Successful processing of ${req.body.type} event`)
            return;
        }
        res.status(400).send("Bad request");
        logger.error("Bad request: Plan => Line 78: server");
        return;
    }
    else if(req.body.type === "CreateTrip"){
        let r = await makeTrip(req.body);
        if(r === "OK"){
            res.send("OK");
            logger.info(`Successful processing of ${req.body.type} event`)
            return;
        }
        res.status(400).send("Bad request");
        logger.error("Bad request: Plan => Line 87: server");
        return;
    }
    else if(req.body.type === "EditTrip"){
        let r = await editTrip(req.body, req.body.misc.tId);
        if(r === "OK"){
            res.send("OK");
            logger.info(`Successful processing of ${req.body.type} event`)
            return;
        }
        res.status(400).send("Bad request");
        logger.error("Bad request: Plan => Line 96: server");
        return;
    }
    else if(req.body.type === "DeleteTrip"){
        let r = await delTrip(req.body.tId);
        if(r === "OK"){
            res.send("OK");
            logger.info(`Successful processing of ${req.body.type} event`)
            return;
        }
        res.status(400).send("Bad request");
        logger.error("Bad request: Plan => Line 106: server");
        return;
    }
    res.send({})
});

async function updatePlan (body, trip) {
    const {id, title, address, city, state, coords, date, time, notes} = body;
    let doc = await collection.findOne({"id": trip});
    // console.log(doc)
    let it = doc.itinerary;
    console.log("1st" + date); //1970-01-01T00:00:00.000Z
    console.log("3rd" + `${date}T00:00.000-05:00`);
    const aDate = date.length === 24 ? new Date(Date.now()) : date === "" ? new Date(Date.now()): new Date(date); //2023-00-00T00:00.000Z
    console.log("2nd" + aDate);
    it[id] = {id, title, address, city, state, coords, date:aDate, time, notes}
    let arrObj = Object.entries(it).map(([key, value]) => ({ key, ...value }));
    arrObj.sort((a, b) => a.date - b.date);
    it = arrObj.reduce((acc, elem) => {
        acc[elem.id] = elem;
        return acc;
    }, {})
    await collection.updateOne(
        {"id": trip},
        {$set:{
            itinerary: it
        }}
    );
    logger.info(`Updated Plan for Trip in Database`);
    return ("OK");
};
async function deletePlan(trip, id) {
    console.log(trip + " " + id);
    const doc = await collection.findOne({"id": trip});
    const it = doc.itinerary
    delete it[id];
    // console.log(it);
    await collection.updateOne(
        {"id": trip},
        {$set:{
            itinerary: it
        }}
    );
    logger.info(`Updated Plan for Trip in Database`);
    return ("OK");
};

app.listen(port, () => console.log(`Server Listening on Port ${port}`));