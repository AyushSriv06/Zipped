import express from "express";
import { userRouter } from "./router/user";
import { zipRouter } from "./router/zip";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);

app.use("app/v1/zap", zipRouter);