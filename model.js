
const mongoose = require('mongoose');


var shoppingListSchema = new mongoose.Schema({
	item: String,
	quantity: String,
	checked: false
})

var shoppingLocationSchema = new mongoose.Schema({
    	listName: String,
    	allItems: [shoppingListSchema],
    	//quantity: []
    //date: { type: Date, default: Date.now }

	
});





var shoppingList = mongoose.model('ShoppingList', shoppingListSchema);
var shoppingLocation = mongoose.model('ShoppingLocation', shoppingLocationSchema)
 
module.exports = {
 	shoppingList: shoppingList,
 	shoppingLocation: shoppingLocation
 }