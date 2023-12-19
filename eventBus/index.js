import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
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

app.post('/events', async (req, res) => {
    logger.info(`Recieved ${req.body.type} event`);
    const serviceURLs = ['plan:54211', 'server:54212', 'trip:54213', 'location:54210'];
    for(let url of serviceURLs){
        console.log(`Sending to ${url}`);
        await fetch(`http://${url}/events`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        })
    }
    logger.info("Event pushed to every service");
    res.send("OK");
});

app.listen(port, () => console.log(`Event-Bus Service Listening on Port ${port}`));