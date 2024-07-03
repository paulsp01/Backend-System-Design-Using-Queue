const amqp = require("amqplib/callback_api");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "system.log" })],
});

const logRequest = (clientId, request) => {
  logger.info(`Client ${clientId}: ${JSON.stringify(request)}`);
};

const processQueue = (clientId) => {
  amqp.connect("amqp://localhost", (err, connection) => {
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
      channel.consume(
        queue,
        (msg) => {
          const request = JSON.parse(msg.content.toString());
          console.log(`Processing request for client ${clientId}: ${request}`);
          logRequest(clientId, request);
          // Process the request here
          channel.ack(msg);
        },
        { noAck: false }
      );
    });
  });
};

module.exports = processQueue;
