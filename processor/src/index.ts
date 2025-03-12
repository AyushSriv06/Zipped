import { PrismaClient } from "@prisma/client";
import {Kafka} from "kafkajs";

const TOPIC_NAME = "zip-events2"

const client = new PrismaClient();

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
})

async function main() {
    const producer =  kafka.producer();
    await producer.connect();

    while(1) {
        const pendingRows = await client.zipRunOutbox.findMany({
            where :{},
            take: 10
        })

        producer.send({
            topic: TOPIC_NAME,
            messages: pendingRows.map(r => {
                return {
                    value: r.zipRunId
                }
            })
        })  

        await client.zipRunOutbox.deleteMany({
            where: {
                id: {
                    in: pendingRows.map(x => x.id)
                }
            }
        })
    }
}

main();