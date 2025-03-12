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
const client_1 = require("@prisma/client");
const kafkajs_1 = require("kafkajs");
const TOPIC_NAME = "zip-events2";
const client = new client_1.PrismaClient();
const kafka = new kafkajs_1.Kafka({
    clientId: "outbox-processor",
    brokers: ["localhost:9092"]
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = kafka.producer();
        yield producer.connect();
        console.log("Kafka Producer Connected. Processing events...");
        while (true) {
            try {
                const pendingRows = yield client.zipRunOutbox.findMany({
                    where: {},
                    take: 10
                });
                if (pendingRows.length === 0) {
                    console.log("No pending records. Sleeping for 2 seconds...");
                    yield new Promise(resolve => setTimeout(resolve, 2000));
                    continue;
                }
                console.log(`Sending ${pendingRows.length} records to Kafka...`);
                yield producer.send({
                    topic: TOPIC_NAME,
                    messages: pendingRows.map(r => ({
                        value: r.zipRunId.toString()
                    }))
                });
                console.log(`Sent ${pendingRows.length} messages. Deleting from DB...`);
                yield client.zipRunOutbox.deleteMany({
                    where: {
                        id: {
                            in: pendingRows.map(x => x.id)
                        }
                    }
                });
                console.log(`Deleted ${pendingRows.length} records. Sleeping before next batch...`);
                yield new Promise(resolve => setTimeout(resolve, 1000)); // Add delay
            }
            catch (error) {
                console.error("Error processing events:", error);
                yield new Promise(resolve => setTimeout(resolve, 5000)); // Wait before retrying on error
            }
        }
    });
}
// Handle graceful shutdown
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Shutting down gracefully...");
    yield client.$disconnect();
    process.exit(0);
}));
// Start the process
main().catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
});
