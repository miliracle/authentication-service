import express from 'express';
import amqp from 'amqplib';

const app = express();
const port = process.env.AUTH_SERVICE_PORT || 4001;

app.get('/', (req, res) => {
  res.send('Hello, TypeScript Node Express!');
});


app.get('/api/v1/ping', async (req, res) => {
  try {
    amqp.connect('amqp://guest:guest@rabbitmq:5672', function (error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1;
        }
        var queue = 'hello';
        var msg = 'Hello world';

        channel.assertQueue(queue, {
          durable: false
        });

        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
      });

      setTimeout(function () {
        connection.close();
        process.exit(0)
      }, 500);
    });
    res.status(200).send(" [x] Sent %s");

  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});