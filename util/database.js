const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = async() => {
  try {
    const client = await MongoClient.connect('mongodb+srv://gabzy4lif3:alakue14@cluster0.v4m8k.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0');
    console.log('connected to mongodb');
  _db = client.db();
  return _db;
  } catch (err){
  console.error('database connection failed', err)
  throw err;
  }
};

const getDb = () => {
  if(!_db){
    throw new Error('no available database')
  }
  return _db
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

