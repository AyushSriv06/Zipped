import { PrismaClient } from "@prisma/client"
import { JsonObject } from "@prisma/client/runtime/library";
import {Kafka} from "kafkajs"
import { parse } from "./parser";


const TOPIC_NAME = "zip-events2"
const prismaclient = new PrismaClient();

const kafka = new Kafka({
    clientId: "zip-events2",
    brokers: ["localhost:9092"],
})

//picking up event from kafka queue and do the process which is needde
//to de done 

async function main() {
    const consumer = kafka.consumer({
        groupId: "zip-events2-group",
    })
    await consumer.connect();

    const producer =  kafka.producer();
    await producer.connect();

    await consumer.subscribe({
        topic: TOPIC_NAME, 
        fromBeginning: true
    })

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({topic, partition, message}) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            })

            if(message.value?.toString()) {
                return;
            }

            const parsedValue = JSON.parse(message.value?.toString() ?? "");
            const zipRunId = parsedValue.zipRunId;
            const stage = parsedValue.stage;

            const zipRunDetails = await prismaclient.zipRun.findFirst({
                where: {
                    id: zipRunId
                }, 
                include: {
                    zip: {
                        include: {
                            actions:{
                                include: {
                                    type: true
                                }
                            }
                        }
                    }
                }
            });

            const currentAction = zipRunDetails?.zip.actions.find(x => x.sortingOrder === stage);

            if(!currentAction) {
                console.log("Current action can't be found");
                return
            }

            const zipRunMetadata = zipRunDetails?.metadata;

            if(currentAction.type.id === "email") {
                console.log("Sending out an email")
                const body = parse((currentAction.metadata as JsonObject)?.body as string, zipRunMetadata);
                const to = parse((currentAction.metadata as JsonObject)?.body as string, zipRunMetadata);
                console.log(`Sending out email to ${to} body is ${body}`)
            }

            if(currentAction.type.id === "send-sol") {
                const amount = parse((currentAction.metadata as JsonObject)?.amount as string, zipRunMetadata);
                const address = parse((currentAction.metadata as JsonObject)?.address as string, zipRunMetadata);
                console.log(`Sending out SOL of ${amount} to address ${address}`)
            }
 
            await new Promise(r => setTimeout(r, 5000));

            const zipId = message.value?.toString();
            const lastStage = (zipRunDetails?.zip.actions?.length || 1) - 1;
            
            if(lastStage !== stage) {

                await producer.send({
                    topic: TOPIC_NAME,
                    messages: [{
                        value: JSON.stringify({
                            stage: stage + 1,
                            zipRunId
                        })
                    }]

                }) 
            }

            console.log("processing done")
            
            await consumer.commitOffsets([{
                topic: TOPIC_NAME,
                partition: partition,
                offset: (parseInt(message.offset) + 1).toString()
            }])
        
        }
    })
}

main();