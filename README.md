# Cloud Curriculum

This repository serves for practicing cloud technologies only.

Overview local deployment:
Four REST APIs are created, which are written in TypeScript (UserService, ProductService) and Python (ShippingService, OrderService). First they will be dockerized and then launched using a common Docker Compose. A PostgreSQL database is linked to each the User and Order Service, while MongoDB is linked to the ProductService. RabbitMQ will be added between Product- and ShippingService. To simplify the service access, ngix is used.

-  http://localhost:80/users
-  http://localhost:80/products
-  http://localhost:80/orders
