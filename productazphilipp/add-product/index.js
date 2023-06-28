// const { MongoClient } = require("mongodb")
// const { v4:uuidv4 } = require("uuid")

// const url = 'mongodb://azure-db-philipp:ukwLTam0o39rTv1sItWNwqT7Ws2RLEVO9H6w6dpjWjXKiuNZGeo0RedUUdY1dJ6XMmUscZRQdGcPACDblxypdA==@azure-db-philipp.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@azure-db-philipp@'
// const client = new MongoClient(url)



// let myproducts = [
//     {
//         _id : uuidv4(),
//         name: "test",
//         description: 'Afasdafsd',
//     },
//         {
//         _id : uuidv4(),
//         name: "test2",
//         description: 'Casdffasd',
//     },
//         {
//         _id : uuidv4(),
//         name: "test3",
//         description: 'Pdsafas',
//     },
//         {
//         _id : uuidv4(),
//         name: "test4",
//         description: 'Cdfasfa',
//     },
    
    
// ]


// module.exports = async function (context, req) {

//     await client.connect();
//     const database = client.db("Products")
//     const collection = database.collection("Products")
//     await collection.deleteMany({})
//     await collection.insertMany(myproducts);
    
//         context.res = {
//         // status: 200, /* Defaults to 200 */
//         body: "Init is done"
//     };
// }


const { CosmosClient } = require("@azure/cosmos")

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    const description = (req.query.description || (req.body && req.description.name));
    const id = (req.query.id || (req.body && req.body.id));

    const endpoint = "https://azure-db-philipp.documents.azure.com:443/";
    const key = "l31FevtivlF067vIjf2Wm0C0eJW52cwmvDh7i7G4MAA7f4fMAyCepQqBfgyGVv9oKnsDP4UOo3qcACDbkXBIRg==";
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
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        body: responseMessage
    };
}
;