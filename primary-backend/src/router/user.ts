import { Router } from "express";
import { SignInSchema, SignUpSchema } from "../types";
import { prismaClient } from "../db";
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "../config";

const router = Router();

//@ts-ignore
router.post("/signup", async (req, res) => {
    const body = req.body;
    const parsedData = SignUpSchema.safeParse(body);
   
    if(!parsedData.success) {
        return res.status(411).json({ message: "Incorrect Inputs" });
    }

    const userExists = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username,
        }
    })

    if(userExists) {
        return res.status(403).json({
            message: "User already exists",
        })
    }

    await prismaClient.user.create({
        data: {
            email: parsedData.data.username,
            password: parsedData.data.password,
            name: parsedData.data.name
        }
    })

    return res.json({
        message: "SignUp Done"
    })
})

//@ts-ignore
router.post("/signin", async(req, res) => {
    const body = req.body;
    const parsedData = SignInSchema.safeParse(body);
   
    if(!parsedData.success) {
        return res.status(411).json({ message: "Incorrect Inputs" });
    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username,
            password: parsedData.data.password
        }
    });

    if(!user) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({
        id: user.id,
    }, JWT_PASSWORD)

    res.json({
        token: token
    })
})

//@ts-ignore
router.get("/", authMiddleware, async (req, res) => {
    //@ts-ignore

    const id = req.id;
    const user = await prismaClient.user.findFirst({
        where: {
            id: id
        }, 
        select: {
            name: true,
            email: true
        }
    })

    return res.json({
        user
    })
})

export const userRouter = router;