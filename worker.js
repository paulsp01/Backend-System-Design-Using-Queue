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
    if (err) throw err;
    connection.createChannel((err, channel) => {
      if (err) throw err;
      const queue = `queue_${clientId}`;
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