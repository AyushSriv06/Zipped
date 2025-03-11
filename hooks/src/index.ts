import express from "express"

const app = express();

app.post("/hooks/catch/:userId/:zipId", (req, res) => {
    const userId = req.params.userId;
    const zipId = req.params.zipId;

    // store in a db a new trigger

    // push it to a queue
}) 