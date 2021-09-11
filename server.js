import express from "express";
import mongoose from "mongoose";
import dbMessages from "./dbMessages";
import Pusher from "pusher";
import cors from "cors";

const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1197062",
  key: "b954fb8fe5ed232a7941",
  secret: "ade05040b80cc9a41ed7",
  cluster: "ap2",
  useTLS: true
});

app.use(express.json());

app.use(cors())

const connection_url = "mongodb+srv://dm1:<password>@cluster0.jqm0f.mongodb.net/whatsapp-clone-backend?retryWrites=true&w=majority"

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

dbMessages.once("open", () => {
  console.log("db connected");
  
  const msgCollection = db.collection("messageContent");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log("A change: ", change);

    if(change.operationType === 'insert') {
      const messageDetails = change.fulllDocument;
      pusher.trigger('messages', 'inserted', {
        name: messageDetails.user,
        message: messageDetails.message,
        // timestamp: messageDetails.timestamp,
        // received : messageDetails.received
      })
    }
  })
})

app.get("messages/sync", (req, res) => (req, res) => {
  dbMessages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  })
});

app.post('/messages/new', (req, res) => {
  const dbMessage = req.body;

  dbMessages.create(dbMessage, (err, data) => {
    if(err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  })
})

app.listen(port, () => console.log(`Listening on localhost:${port}`));