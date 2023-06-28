from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
import os
import requests
import pika

app = Flask(__name__)


# app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URL') #das hier geändert

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:postgres@postgres_orders:5432/postgres"

db = SQLAlchemy(app)


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)  # unique identifier
    # ACHTUNG HIER BEI DER USER SERVICE ANPASSEN -> INT
    userId = db.Column(db.Integer, nullable=False)
    productIds = db.Column(db.String, nullable=False)

    def json(self):
        return {'userid': self.userId, 'productid': self.productIds}


with app.app_context():
    db.create_all()


def check_user_exists(user_id):
    user_service_url = "http://user_service:4001/users/{}".format(user_id)
    response = requests.get(user_service_url)
    return response.status_code == 200


def check_product_exists(product_id):
    product_service_url = "http://product_service:4002/products/{}".format(
        product_id)
    response = requests.get(product_service_url)
    return response.status_code == 200


def publish_to_rabbitmq(user_id, product_id):
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='rabbitmq'))  # fehlt hier port?
    channel = connection.channel()
    channel.queue_declare(queue='shipping_queue')
    message = f"User ID: {user_id}, Product ID: {product_id}"
    channel.basic_publish(
        exchange='', routing_key='shipping_queue', body=message)
    connection.close()


@app.route('/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    output = []
    for order in orders:
        order_data = {'userId': order.userId, 'productIds': order.productIds}
        output.append(order_data)
    return make_response({"orders": output}, 200)


@app.route('/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.get_or_404(order_id)
    return make_response({"name": order.userId, "productIds": order.productIds}, 200)


# @app.route('/orders', methods=['POST'])
# def create_order():
#     user_id = request.json['userId']
#     product_id = request.json['productIds']

#     if not check_user_exists(user_id):
#         return make_response(jsonify({'message': 'User does not exist'}), 404)

#     if not check_product_exists(product_id):
#         return make_response(jsonify({'message': 'Product does not exist'}), 404)

#     order = Order(userId=user_id, productIds=product_id)
#     db.session.add(order)
#     db.session.commit()
#     return make_response(jsonify({'message': 'order created'}), 201)

@app.route('/orders', methods=['POST'])
def create_order():
    user_id = request.json['userId']
    product_id = request.json['productIds']

    if not check_user_exists(user_id):
        return make_response(jsonify({'message': 'User does not exist'}), 404)

    if not check_product_exists(product_id):
        return make_response(jsonify({'message': 'Product does not exist'}), 404)

    order = Order(userId=user_id, productIds=product_id)
    db.session.add(order)
    db.session.commit()

    # Veröffentlichen der Nachricht an RabbitMQ
    publish_to_rabbitmq(user_id, product_id)

    return make_response(jsonify({'message': 'order created'}), 201)


@app.route('/orders/<order_id>', methods=['PUT'])
def update_order(order_id):
    order = Order.query.get_or_404(order_id)
    order.userId = request.json['userId']
    order.productIds = request.json['productIds']
    db.session.commit()
    return make_response({"name": order.userId, "productIds": order.productIds}, 200)


@app.route('/orders/<order_id>', methods=['DELETE'])
def delete_order(order_id):
    try:
        order = Order.query.filter_by(id=order_id).first()
        if order:
            db.session.delete(order)
            db.session.commit()
            return make_response(jsonify({'message': 'order deleted'}), 200)
        return make_response(jsonify({'message': 'order not found'}), 404)
    except:
        return make_response(jsonify({'message': 'error deleting order'}), 500)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000, debug=True)
