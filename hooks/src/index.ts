import express from "express"
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
const app = express();
app.use(express.json());

app.post("/hooks/catch/:userId/:zipId", async(req, res) => {
    const userId = req.params.userId;
    const zipId = req.params.zipId;
    const body = req.body;

    // store in a db a new trigger
    await client.$transaction(async tx => {
        const run = await tx.zipRun.create({
            data: {
                zipId: zipId,
                metadata: body
            }
        });

        await tx.zipRunOutbox.create({
            data: {
                zipRunId: run.id
            }
        })
    })

    res.json({
        message: "webhook received"
    })

}) 

app.listen(3002);