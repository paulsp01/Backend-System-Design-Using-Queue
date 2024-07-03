const amqp = require("amqplib/callback_api");

const createQueue = (clientId) => {
  amqp.connect("amqp://127.0.0.1", (err, connection) => {
    if (err) {
      console.error(`Failed to connect to RabbitMQ: ${err.message}`);
      throw err;
    }
    connection.createChannel((err, channel) => {
      if (err) {
        console.error(`Failed to create channel: ${err.message}`);
        throw err;
      }
      const queue = `queue_${clientId}`;
      channel.assertQueue(queue, { durable: true });
      console.log(`Queue created for client ${clientId}`);
    });
  });
};

module.exports = createQueue;
