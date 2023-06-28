

const { CosmosClient } = require("@azure/cosmos")

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    const description = (req.query.description || (req.body && req.description.name));
    const id = (req.query.id || (req.body && req.body.id));

    const endpoint = "";
    const key = "";
    const client = new CosmosClient({ endpoint, key });

    const { database } =  await client.databases.createIfNotExists({ id: "MyDatabase" });

    const { container } = await database.containers.createIfNotExists({ id: "Product" });

    if (id) {
        // Edit product
        await container.items.upsert({
            id: id,
            name: name,
            description: description,
        });
    } else {
        // Add product
        await container.items.create({
            name: name,
            description: description,
        });
    }

    const responseMessage = name
        ? name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully.";

    context.res = {
        body: responseMessage
    };
}
;
