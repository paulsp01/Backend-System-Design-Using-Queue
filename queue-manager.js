const amqp = require("amqplib/callback_api");

const createQueue = (clientId) => {
  amqp.connect("amqp://localhost", (err, connection) => {
    if (err) throw err;
    connection.createChannel((err, channel) => {
      if (err) throw err;
      const queue = `queue_${clientId}`;
      channel.assertQueue(queue, { durable: true });
      console.log(`Queue created for client ${clientId}`);
    });
  });
};

module.exports = createQueue;