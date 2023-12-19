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

app.post("/events", async (req, res) => {
    let location = req.body; //"Boston, MA, US"//"112 Eastman Lane, Amherst, MA, US";
    console.log(`Location Service Received ${location.type} Event`);
    logger.info(`Location Service received a(n) ${req.body.type} event`)
    if(location.type === "CreatePlan" || location.type === "EditPlan"){
        let uri;
        let coords;
        if(location.address === "" && location.city === "" && location.state === ""){
            uri = `https://api.geoapify.com/v1/geocode/search?text=${location.title}&apiKey=${process.env.MAP_API_KEY}`;
        }
        else if(location.city !== "" && location.state !== "" && location.address !== ""){
            uri = `https://api.geoapify.com/v1/geocode/search?text=${location.address}&city=${location.city}&state=${location.state}&apiKey=${process.env.MAP_API_KEY}`;
        }
        else if(location.title !== "" && location.city !== "" && location.state !== ""){
            uri = `https://api.geoapify.com/v1/geocode/search?text=${location.title}&city=${location.city}&state=${location.state}&apiKey=${process.env.MAP_API_KEY}`;
        }
        else if(location.city !== "" && location.state !== ""){
            uri = `https://api.geoapify.com/v1/geocode/search?city=${location.city}&state=${location.state}&apiKey=${process.env.MAP_API_KEY}`;
        }
        
        if(uri !== ""){
            let response = await (await fetch(uri)).json();
            coords = response.features[0].geometry.coordinates;
        }
        else coords = [0, 0];
        location.type = "LocationAppended";
        location.coords = coords;
        let r = await fetch("http://eventbus:54215/events", {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(location)
        })
        if(r.status === 200){
            res.send("OK");
            logger.info(`Sent the updated body as a Location appended event to the Event Bus`)
            return;
        }
        res.status(400).send("Bad Request");
        logger.error(`Error 400 Pushing Location update`);
        return;
    }
    res.send({});
});

app.listen(port, () => console.log(`Location Service Listening on Port ${port}`))