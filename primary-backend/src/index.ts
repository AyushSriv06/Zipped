import express from "express";
import { userRouter } from "./router/user";
import { zipRouter } from "./router/zip";
import cors from "cors"
import { triggerRouter } from "./router/action";
import { actionRouter } from "./router/trigger";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);

app.use("app/v1/zip", zipRouter);

app.use("app/v1/trigger", triggerRouter);

app.use("app/v1/action", actionRouter);

app.listen(3000);