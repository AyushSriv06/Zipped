import express from "express"

const app = express();

app.post("/hooks/catch/:userId/:zipId", (req, res) => {
    const userId = req.params.userId;
    const zipId = req.params.zipId;
}) 