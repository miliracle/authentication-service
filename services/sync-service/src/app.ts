import amqplib from 'amqplib';
const amqpUrl = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_SERVICE_NAME}:${process.env.RABBITMQ_PORT}`;

async function processMessage(msg: amqplib.ConsumeMessage) {
  console.log(msg.content.toString(), 'Call email API hereee');
}

(async () => {
    const connection = await amqplib.connect(amqpUrl, "heartbeat=60");
    const channel = await connection.createChannel();
    channel.prefetch(10);
    const queue = 'task_queue';
    process.once('SIGINT', async () => { 
      console.log('got sigint, closing connection');
      await channel.close();
      await connection.close(); 
      process.exit(0);
    });

    await channel.assertQueue(queue, {durable: true});
    await channel.consume(queue, async (msg) => {
      console.log('processing messages');      
      await processMessage(msg as amqplib.ConsumeMessage);
      await channel.ack(msg as amqplib.Message);
    }, 
    {
      noAck: false,
      consumerTag: 'email_consumer'
    });
    console.log(" [*] Waiting for messages. To exit press CTRL+C");
})();