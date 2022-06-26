const amqp = require('amqplib')

const queue_light_products = 'LIGHT_PRODUCTS'
const queue_response       = 'RESPONSE'

const { v4: uuidv4 } = require('uuid');

amqp.connect({
  host: 'localhost',
  port: 5672,
  username: 'admin',
  password: 123456
})
  .then((connection) => {
    connection.createChannel()
      .then((channel) => {
        channel.consume(queue_light_products, (message) => {

          var dataMessage = JSON.parse(message.content.toString())

          var response = {
            id: uuidv4(),
            productId: dataMessage.id,
            enterprise: 'TURBO',
            deliveryDate: Date()
          }

          channel.sendToQueue(queue_response, new Buffer.from(JSON.stringify(response)))
          console.log(message.content.toString())
        }, {noAck: true})
      })
      .catch((error) => console.log(error))
    })
  .catch((error) => console.log(error))

