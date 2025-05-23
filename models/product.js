const getDb = require('../util/database').getDb
const {ObjectId} = require('mongodb');

class Product {
  constructor(title,price,description,imageUrl,id,userId){
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id =  id ? new ObjectId(id) : null;
    this.userId = userId;
  }
   save() {
    const db = getDb();
    let dbOp;
    if(this._id){
      dbOp = db.collection('products').updateOne({_id:this._id}, {$set:this});
    } else {
      dbOp =  db.collection('products').insertOne(this)
    }
    console.log(this)
     return dbOp
    .then(result => {
      console.log('product inserted',result)
     return result;
})
    .catch(err => {console.log(err)
    })
   }

   static fetchAll(){
    const db = getDb();
    return db.collection('products').find().toArray()
    .then(products => {
      console.log(products)
      return products;
    })
    .catch(err=>
     console.log(err))
   }
   static findById(prodId){
    const db = getDb();
    return db.collection('products')
    .find({_id: new ObjectId(prodId) })
    .next()
    .then( product => {
      console.log(product);
      return product;
    })
    .catch(err=> {
      console.log(err)
    })

   }

   static deleteById(prodId){
    const db = getDb()
    return db.collection('products').deleteOne({_id: new ObjectId(prodId)})
    .then(result => {
      console.log('deleted successfully');
    })
    .catch(err=> {
      console.log(err);
    })
   }
}

// const Product = sequelize.define('product', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

module.exports = Product;
