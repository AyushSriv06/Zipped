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
Object.defineProperty(exports, "__esModule", { value: true });
exports.zipRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../authMiddleware");
const types_1 = require("../types");
const db_1 = require("../db");
const router = (0, express_1.Router)();
//@ts-ignore
router.post("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const body = req.body;
    const parsedData = types_1.ZipCreateSchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(400).json({ error: "Invalid request body" });
    }
    yield db_1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const zip = yield db_1.prismaClient.zip.create({
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
        });
        const trigger = yield tx.trigger.create({
            data: {
                triggerId: parsedData.data.availableTriggerId,
                zipId: zip.id
            }
        });
        yield tx.zip.update({
            where: {
                id: zip.id
            },
            data: {
                triggerId: trigger.id
            }
        });
    }));
    return res.json({
        message: "Zip created successfully",
    });
}));
//@ts-ignore
router.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const zips = yield db_1.prismaClient.zip.findMany({
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
    });
    return res.json({
        zips
    });
}));
//@ts-ignore
router.get("/:zipId", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const zipId = req.params.zipId;
    const zip = yield db_1.prismaClient.zip.findFirst({
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
    });
    return res.json({
        zip
    });
}));
exports.zipRouter = router;
