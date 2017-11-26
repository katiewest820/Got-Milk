
const mongoose = require('mongoose');

var shoppingItemSchema = new mongoose.Schema({
    
    	listName: String,
    	item: [],
    	quantity: []
    //date: { type: Date, default: Date.now }

	
});

shoppingItemSchema.methods.apiRepr = function() {
	return{
		listName: this.listName,
		item: item.push(this.item),
		quantity : quantity.push(this.quantity),
		id: this._id
	}
}

module.exports= mongoose.model('ShoppingItem', shoppingItemSchema);