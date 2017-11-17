
const mongoose = require('mongoose');

var shoppingItemSchema = new mongoose.Schema({
    item: String,
    quantity: Number,
    date: { type: Date, default: Date.now }
});

module.exports= mongoose.model('ShoppingItem', shoppingItemSchema);