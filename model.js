
const mongoose = require('mongoose');

//Nested Schema inside of shoppinglocationschema. Contains list itmes
var shoppingListSchema = new mongoose.Schema({
	item: String,
	quantity: String,
	checked: false
});

//Schema that creates list names and stores objects of items
var shoppingLocationSchema = new mongoose.Schema({
		userId: mongoose.Schema.Types.ObjectId,
    	listName: String,
    	allItems: [shoppingListSchema]
});


var shoppingList = mongoose.model('ShoppingList', shoppingListSchema);
var shoppingLocation = mongoose.model('ShoppingLocation', shoppingLocationSchema);


module.exports = {
 	shoppingList: shoppingList,
 	shoppingLocation: shoppingLocation
 }