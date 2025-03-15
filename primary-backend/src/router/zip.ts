import { Router } from "express";
import { authMiddleware } from "../authMiddleware";
import { ZipCreateSchema } from "../types";
import { prismaClient } from "../db";

const router = Router();

//@ts-ignore
router.post("/", authMiddleware, async (req, res) => {
    //@ts-ignore
    const id = req.id;
    const body = req.body;
    const parsedData = ZipCreateSchema.safeParse(body);

    if(!parsedData.success) {
        return res.status(400).json({ error: "Invalid request body" });
    }

    await prismaClient.$transaction( async tx => {
        const zip = await prismaClient.zip.create({
            data: {
                userId: id,
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

        await tx.zip.update({
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
router.get("/", authMiddleware, async (req,res) => {
    //@ts-ignore
    const id = req.id;
    const zips = await prismaClient.zip.findMany({
        where: {
            userId: id
        },
        include: {
            actions: {
                include: {
                    type: true
                }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    })
    return res.json({
        zips
    })
})

//@ts-ignore
router.get("/:zipId", authMiddleware, async(req,res) => {
    //@ts-ignore
    const id = req.id;
    const zipId = req.params.zipId;

    const zip = await prismaClient.zip.findFirst({
        where: {
            id: zipId,
            userId: id
        }, 
        include: {
            actions: {
                include: {
                    type: true
                }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    })
    
    return res.json({
        zip
    })
})

export const zipRouter = router;