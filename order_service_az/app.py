# from flask import Flask, request, jsonify, make_response
# from azure.cosmos import CosmosClient, exceptions
# import requests

# app = Flask(__name__)

# config = {
#     'ENDPOINT': 'https://cosmos-orderservice.documents.azure.com:443/',
#     'MASTERKEY': "LEucwMbBuwS4hpZaNQ4FdPoEVKTcSRCgazU9jPPNtXxfX6AlivPuT5Ttm2J2mkX5ifFlFiOr5L1xACDbm1tLCg==",
#     'DATABASE': 'MyDatabase',
#     'CONTAINER': 'Order'
# }

# client = CosmosClient(
#     config['ENDPOINT'], {'masterKey': config['MASTERKEY']})


# class Order():
#     def __init__(self, userId, productIds):
#         self.userId = userId
#         self.productIds = productIds


# # def check_user_exists(user_id):
# #     user_service_url = "http://user_service:4001/users/{}".format(user_id)
# #     response = requests.get(user_service_url)
# #     return response.status_code == 200


# # def check_product_exists(product_id):
# #     product_service_url = "http://product_service:4002/products/{}".format(
# #         product_id)
# #     response = requests.get(product_service_url)
# #     return response.status_code == 200


# @app.route('/orders', methods=['GET'])
# def get_orders():
#     query = "SELECT * FROM c"
#     try:
#         options = {}
#         options['enableCrossPartitionQuery'] = True
#         orders = client.QueryDocuments(config['CONTAINER'], query, options)
#         output = []
#         for order in orders:
#             order_data = {'userId': order['userId'],
#                           'productIds': order['productIds']}
#             output.append(order_data)
#         return make_response({"orders": output}, 200)
#     except errors.HTTPFailure as e:
#         return make_response(jsonify({'message': 'Failed to retrieve orders'}), 500)


# @app.route('/orders/<order_id>', methods=['GET'])
# def get_order(order_id):
#     try:
#         options = {}
#         options['enableCrossPartitionQuery'] = True
#         query = f"SELECT * FROM c WHERE c.id = '{order_id}'"
#         result = client.QueryDocuments(config['CONTAINER'], query, options)
#         order = next(iter(result))
#         return make_response({"name": order['userId'], "productIds": order['productIds']}, 200)
#     except (errors.HTTPFailure, StopIteration) as e:
#         return make_response(jsonify({'message': 'Order not found'}), 404)


# @app.route('/orders', methods=['POST'])
# def create_order():
#     user_id = request.json['userId']
#     product_id = request.json['productIds']

#     # if not check_user_exists(user_id):
#     #     return make_response(jsonify({'message': 'User does not exist'}), 404)

#     # if not check_product_exists(product_id):
#     #     return make_response(jsonify({'message': 'Product does not exist'}), 404)

#     order = Order(userId=user_id, productIds=product_id)

#     try:
#         created_order = client.CreateDocument(
#             config['CONTAINER'], order.__dict__)
#         return make_response(jsonify({'message': 'Order created'}), 201)
#     except errors.HTTPFailure as e:
#         return make_response(jsonify({'message': 'Failed to create order'}), 500)


# @app.route('/orders/<order_id>', methods=['PUT'])
# def update_order(order_id):
#     try:
#         options = {}
#         options['enableCrossPartitionQuery'] = True
#         query = f"SELECT * FROM c WHERE c.id = '{order_id}'"
#         result = client.QueryDocuments(config['CONTAINER'], query, options)
#         order = next(iter(result))
#         order['userId'] = request.json['userId']
#         order['productIds'] = request.json['productIds']
#         updated_order = client.ReplaceDocument(order['_self'], order)
#         return make_response({"name": updated_order['userId'], "productIds": updated_order['productIds']}, 200)
#     except (errors.HTTPFailure, StopIteration) as e:
#         return make_response(jsonify({'message': 'Order not found'}), 404)


# @app.route('/orders/<order_id>', methods=['DELETE'])
# def delete_order(order_id):
#     try:
#         options = {}
#         options['enableCrossPartitionQuery'] = True
#         query = f"SELECT * FROM c WHERE c.id = '{order_id}'"
#         result = client.QueryDocuments(config['CONTAINER'], query, options)
#         order = next(iter(result))
#         client.DeleteDocument(order['_self'])
#         return make_response(jsonify({'message': 'Order deleted'}), 200)
#     except (errors.HTTPFailure, StopIteration) as e:
#         return make_response(jsonify({'message': 'Order not found'}), 404)


# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=4000, debug=True)


from flask import Flask, request
from flask_restful import Api, Resource
from azure.cosmos import exceptions, CosmosClient, PartitionKey
import uuid

app = Flask(__name__)
api = Api(app)

# Initialize Azure Cosmos DB client
url = 'https://order-serviceps.documents.azure.com:443/'
key = '8zT6p6ibjc1tVAKR8QRGqnZmKih3sfEULDdbHKfcwC9StBjMWLqoTTPRuyWTirsMlWye98E5GNGVACDbVPO3gw=='
client = CosmosClient(url, credential=key)
database_name = 'MyDatabase'
container_name = 'order'
database = client.get_database_client(database_name)
container = database.get_container_client(container_name)


class Order(Resource):
    def get(self, order_id):
        try:
            order = container.read_item(item=order_id, partition_key=order_id)
            return order, 200
        except exceptions.CosmosHttpResponseError as e:
            if e.status_code == 404:
                return {'message': 'Order not found'}, 404
            return {'message': 'Internal Server Error'}, 500

    def get(self):
        try:
            items = container.read_all_items()
            orders = list(items)
            return orders, 200
        except exceptions.CosmosHttpResponseError:
            return {'message': 'Internal Server Error'}, 500

    def post(self):
        data = request.get_json()
        user_id = data.get('user_id')
        product_id = data.get('product_id')

        order = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'product_id': product_id
        }

        try:
            container.create_item(body=order)
            return order, 201
        except exceptions.CosmosHttpResponseError:
            return {'message': 'Internal Server Error'}, 500

    def delete(self, order_id):
        try:
            container.delete_item(item=order_id, partition_key=order_id)
            return {'message': 'Order deleted'}, 200
        except exceptions.CosmosHttpResponseError as e:
            if e.status_code == 404:
                return {'message': 'Order not found'}, 404
            return {'message': 'Internal Server Error'}, 500


api.add_resource(Order, '/order', '/order/<string:order_id>')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
