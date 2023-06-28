const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

const url = 'mongodb://azure-db-philipp:ukwLTam0o39rTv1sItWNwqT7Ws2RLEVO9H6w6dpjWjXKiuNZGeo0RedUUdY1dJ6XMmUscZRQdGcPACDblxypdA==@azure-db-philipp.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@azure-db-philipp@'
const client = new MongoClient(url);

module.exports = async function (context, req) {
 
  await client.connect();
  const database = client.db("Products")
  const collection = database.collection("Products")

  let product = await collection.findOne({ _id : req.params.id })
  
  if (!product){
      return context.res = {
          status:400,
          body: "Couldnt find that product"
      }
  }
 
   return (context.res = {
        // status: 200, /* Defaults to 200 */
        body: product
    });
};