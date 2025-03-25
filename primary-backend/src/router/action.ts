import { Router } from "express";
import { prismaClient } from "../db";

const router = Router();

router.get("/available", async (req, res) => {
    const availableActions = await prismaClient.avalaibleAction.findMany({});
    res.json({
        availableActions
    })
});

export const triggerRouter = router;