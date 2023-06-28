const { CosmosClient } = require("@azure/cosmos")

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const endpoint = "https://azure-db-philipp.documents.azure.com:443/";
    const key = "l31FevtivlF067vIjf2Wm0C0eJW52cwmvDh7i7G4MAA7f4fMAyCepQqBfgyGVv9oKnsDP4UOo3qcACDbkXBIRg==";
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


