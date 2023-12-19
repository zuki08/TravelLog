import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const conn_str = process.env.DB_URL;

class db {
  constructor(){
    this._client = new MongoClient(conn_str, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    this._client.connect().then(() => console.log("Connected"));
  }
  connectdb(name){
    return this._client.db(name);
  }
  close(){
    this._client.close();
  }
}

const client = new db();

export default client;