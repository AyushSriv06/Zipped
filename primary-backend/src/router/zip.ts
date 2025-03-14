import { Router } from "express";
import { authMiddleware } from "../authMiddleware";
import { ZipCreateSchema } from "../types";
import { prismaClient } from "../db";

const router = Router();

//@ts-ignore
router.post("/", authMiddleware, async (req, res) => {
    const body = req.body;
    const parsedData = ZipCreateSchema.safeParse(body);

    if(!parsedData.success) {
        return res.status(400).json({ error: "Invalid request body" });
    }

    await prismaClient.$transaction( async tx => {
        const zip = await prismaClient.zip.create({
            data: {
                triggerId: "",
                actions: {
                    create: parsedData.data.actions.map((x, index) => ({
                        actionId: x.availableActionId,
                        sortingOrder: index
                    }))
                }
            }
        })
        const trigger = await tx.trigger.create({
            data: {
                triggerId: parsedData.data.availableTriggerId,
                zipId: zip.id
            }
        });

        await prismaClient.zip.update({
            where: {
                id: zip.id
            },
            data: {
                triggerId: trigger.id
            }
        })
    })

})

//@ts-ignore
router.get("/", authMiddleware, (req,res) => {
    console.log("Zips Handler");
})

//@ts-ignore
router.get("/:zipId", authMiddleware, (req,res) => {
    console.log("Get all the zips");
})

export const zipRouter = router;