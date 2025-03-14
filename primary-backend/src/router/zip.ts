import { Router } from "express";
import { authMiddleware } from "../authMiddleware";

const router = Router();

router.post("/", authMiddleware, (req, res) => {
    console.log("Create a zip");
})

router.get("/", authMiddleware, (req,res) => {
    console.log("Zips Handler");
})

router.get("/:zipId", authMiddleware, (req,res) => {
    console.log("Get all the zips");
})

export const zipRouter = router;