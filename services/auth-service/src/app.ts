import express from 'express';
import amqplib from 'amqplib';

// Define the AMQP URL for connecting to RabbitMQ
const amqpUrl = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_SERVICE_NAME}:${process.env.RABBITMQ_PORT}`;
;

// Create an Express application
const app = express();
// Set the port for the application, defaulting to 4001 if not specified in environment variables
const port = process.env.AUTH_SERVICE_PORT || 4001;

// Define a simple route to respond with a welcome message
app.get('/', (req, res) => {
  res.send('Hello, TypeScript Node Express!');
});

// Define a route to test AMQP message publishing
app.get('/api/v1/ping', async (req, res) => {
  try {
    // Establish a connection to RabbitMQ
    const connection = await amqplib.connect(amqpUrl, 'heartbeat=60');
    // Create a channel for communication
    const channel = await connection.createChannel();
    try {
      console.log('Publishing');
      // Define the exchange for routing messages
      const exchange = 'task_exchange';
      // Define the queue where messages will be stored
      const queue = 'task_queue';
      // Define the routing key to route messages to the correct queue
      const routingKey = 'task';

      // Ensure the exchange and queue exist, and bind them
      await channel.assertExchange(exchange, 'direct', { durable: true });
      await channel.assertQueue(queue, { durable: true });
      await channel.bindQueue(queue, exchange, routingKey);

      // Create a message with a random ID and a sample email
      const msg = { 'id': Math.floor(Math.random() * 1000), 'email': 'user@domail.com', name: 'firstname lastname' };
      // Publish the message to the exchange with the specified routing key
      await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(msg)));
      console.log('Message published');
    } catch (e) {
      console.error('Error in publishing message', e);
    } finally {
      console.info('Closing channel and connection if available');
      // Close the channel and connection to RabbitMQ
      await channel.close();
      await connection.close();
      console.info('Channel and connection closed');
    }
    // Send a success response
    res.status(200).send(" [x] Sent %s");

  } catch (error) {
    // Send an error response if something goes wrong
    res.status(500).send(error);
  }
});

// Start the Express server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});