from flask import Flask
import pika

app = Flask(__name__)

# RabbitMQ connection parameters
rabbitmq_host = "rabbitmq"
rabbitmq_port = 5672
rabbitmq_queue = "shipping_queue"


@app.route('/shipping', methods=['POST'])
def process_shipping():

    return "Shipping processed successfully"


def callback(ch, method, properties, body):
    print("Received shipping request: %r" % body)

    print("Shipping processed successfully")


def start_listening():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=rabbitmq_host, port=rabbitmq_port))
    channel = connection.channel()
    channel.queue_declare(queue=rabbitmq_queue)
    channel.basic_consume(queue=rabbitmq_queue,
                          on_message_callback=callback, auto_ack=True)
    print('Waiting for shipping requests...')
    channel.start_consuming()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4003, debug=True)
    start_listening()
