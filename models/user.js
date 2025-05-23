const getDb = require('../util/database').getDb;
const {ObjectId} = require('mongodb');


class User {
constructor(username,email,cart,id){
  this.username = username;
  this.email = email;
  this.cart = cart;
  this._id = id;
}

save (){
const db = getDb();
let dbSave;
 return dbSave = db.collection('users').insertOne(this)
.then(result => {
  console.log(result)
})
.catch(err=> console.log(err))
}


addToCart(product){
  const cartProductIndex = this.cart.items.findIndex(cp =>{
    return cp.productId.toString() == product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0){
     newQuantity = this.cart.items[cartProductIndex].quantity + 1;
     updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity
       });
    }

    const updatedCart = { items: updatedCartItems  }

  const db = getDb();
  return db
  .collection('users')
  .updateOne(
    {_id: new ObjectId(this._id)},
    {$set: {cart: updatedCart}}
    
  )};


  getCart(){
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    })
      return db
      .collection('products')
      .find({_id : {$in: productIds}})
      .toArray()
      .then(products =>{
        return products.map( p=> {
          return {
            ...p,
            quantity: this.cart.items.find (i=> {
              return i.productId.toString() === p._id.toString()
            }).quantity
          }
        })
      })
    
  }

  deleteItemFromCart(productId){
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  })
  const db = getDb();
  return db
  .collection('users')
  .updateOne(
    {_id:new ObjectId(this._id)},
    {$set: {cart:{items: updatedCartItems}}})
  
  }


  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.username
          }
        };
        return db.collection('orders').insertOne(order);
      })
      .then(result => {
        this.cart = { items: [] };
        return db.collection('users').updateOne(
          { _id: new ObjectId(this._id) },
          { $set: { cart: { items: [] } } }
        );
      })
      .catch(err => {
        console.error('Failed to place order:', err);
        throw err;
      });
  }

   

  // addOrder(){
  //   const db = getDb();
  //   return this.getCart()
  //   .then(products => {
  //     const order = {
  //   items: products,
  //   user: {
  //     _id: new ObjectId(this._id),
  //     name:this.name
  //   }
  // }
  // return db
  // .collection('orders')
  // .insertOne(order)

  //   })
  //   .then(() => {
  //     this.cart = {items : [] };
  //     return db
  //   .collection('users')
  //    .updateOne(
  //   {_id:new ObjectId(this._id)},
  //   {$set: {cart:{items: [] }}})
  //   });
   
  // }



static findById(userId){
  const db = getDb();
  return db.collection('users')
  .find({_id: new ObjectId(userId)})
  .next()
  .then(user => {
    console.log(user);
    return user;
  })
  .catch(err=> {
    console.log(err)
  })
}

}

module.exports = User;