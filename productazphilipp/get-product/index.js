const { CosmosClient } = require("@azure/cosmos")

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const endpoint = "";
    const key = "";
    const client = new CosmosClient({ endpoint, key });

    const { database } =  await client.databases.createIfNotExists({ id: "MyDatabase" });

    const { container } = await database.containers.createIfNotExists({ id: "Product" });

    const { resources } = await container.items
        .query("SELECT * from c")
        .fetchAll();

    context.res = {
        body: resources
    };
}
;


