import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import winston from 'winston'
import {randomBytes} from 'crypto';

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

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

app.post("/events", (req, res) => {
    console.log(`Plan Service Received a ${req.body.type} event`);
    logger.info(`Nothing to do here. Just logging an ${req.body.type} event`)
    res.send({});
});

app.post('/addPlan/:tId', async (req, res) => {
    logger.info(`Adding a place to visit`);
    const body = req.body;
    //{title: STRING Address:STRING, coordinates:OBJECT, date:STRING, time: STRING, notes:STRING } = body
    body.id = randomBytes(5).toString('hex');
    body.misc = {"tId": req.params.tId};
    body.type = "CreatePlan";
    // collection.insertOne(body);
    let r = await fetch(`http://eventbus:54215/events`, {
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    if(r.status === 200){
        res.send("OK");
        logger.info(`Success!: ${req.params.tId} ${body.id}`)
        return;
    }
    res.status(400).send("Bad Request");
    logger.error(`Error 400 encounted creating plan`);
});

app.put('/editPlan/:tId/:pId', async (req, res) => {
    logger.info(`Editing a place to visit`);
    const {title, address, city, state, date, time, notes} = req.body;
    const id = req.params.pId;
    const misc = {"tId": req.params.tId};
    const type = "EditPlan";
    let r = await fetch(`http://eventbus:54215/events`, {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({misc, type, id, title, address, city, state, date, time, notes})
    })
    if(r.status === 200){
        res.send("OK");
        logger.info(`Success!: ${req.params.tId} ${req.params.pId}`);
        return;
    }
    res.status(400).send("Bad Request");
    logger.error(`Error 400 encountered editing plan`);
});

app.delete("/:tripId/:pId", async (req, res) => {
    logger.info(`Deleting a place to visit`);
    let r = await fetch(`http://eventbus:54215/events`, {
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({type:"DeletePlan", tId: req.params.tripId, pId: req.params.pId})
    });
    // console.log(r);
    if(r.status === 200){
        res.send("OK");
        logger.info(`Successful deletion`);
        return;
    }
    res.status(400).send("Bad Request");
    logger.error(`Error 400 encountered deleting plan`);
});

app.listen(port, () => console.log(`Plan Service Listening on Port ${port}`))