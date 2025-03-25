"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./router/user");
const zip_1 = require("./router/zip");
const cors_1 = __importDefault(require("cors"));
const action_1 = require("./router/action");
const trigger_1 = require("./router/trigger");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/user", user_1.userRouter);
app.use("app/v1/zip", zip_1.zipRouter);
app.use("app/v1/trigger", action_1.triggerRouter);
app.use("app/v1/action", trigger_1.actionRouter);
app.listen(3003);
