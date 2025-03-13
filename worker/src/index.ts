import {Kafka} from "kafkajs"

const TOPIC_NAME = "zip-events2"

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

            await new Promise(r => setTimeout(r, 5000));

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