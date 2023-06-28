const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

const url = ''
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
