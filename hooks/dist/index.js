"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/hooks/catch/:userId/:zipId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const zipId = req.params.zipId;
    const body = req.body;
    // store in a db a new trigger
    yield client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const run = yield tx.zipRun.create({
            data: {
                zipId: zipId,
                metadata: body
            }
        });
        yield tx.zipRunOutbox.create({
            data: {
                zipRunId: run.id
            }
        });
    }));
    res.json({
        message: "webhook received"
    });
}));
app.listen(3002);
