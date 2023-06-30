# Cloud Curriculum
This repository serves for practicing cloud technologies only.

Topics:
- mSvc, REST APIs (python, typescript, javascript)
- Docker-/Docker Compose
- Databases (PostgreSQL, MongoDB), Message Broker (RabbitMQ)
- IaC (Pulumi)
- Microsoft Azure
- Github Actions

## Overview local deployment:
![cd challange](https://github.com/pschengel/cloudcurriculum/assets/136333034/86e49ef2-e23d-47a5-971b-fac865b69683)

-  http://localhost:80/users
-  http://localhost:80/products
-  http://localhost:80/orders


## Overview Cloud deployment

![azure](https://github.com/pschengel/cloudcurriculum/assets/136333034/96ef58da-0520-4d64-837d-cf003e2f29d8)

- "productsazphilipp" contains the reimplementation of the product service for usage as azure functions. The product serice is connected with a azure cosmos db account.
  - functions: "add_edit-product", "delete-product", "get-product"
    
- "order_service_az" contains the reimplementage of the order service for usage as azure app service. A Docker images is pushed to a azure service registery. From there it is deployed to a web app. The order serice is connected with a azure cosmos db account aswell.
  - '/order', '/order/<string:order_id>'

Azure Resource Groups: spc1bs-test, spc1bs-storage
