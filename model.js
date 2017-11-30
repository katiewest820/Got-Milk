
const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

//Nested Schema inside of shoppinglocationschema. Contains list itmes
var shoppingListSchema = new mongoose.Schema({
	item: String,
	quantity: String,
	checked: false
})

//Schema that creates list names and stores objects of items
var shoppingLocationSchema = new mongoose.Schema({
		userId: mongoose.Schema.Types.ObjectId,
    	listName: String,
    	allItems: [shoppingListSchema]
});

//auth schema. creates and stores user info
// const UserSchema = mongoose.Schema({
// 	username: {
// 		type: String,
// 		required: true,
// 		unique: true
// 	},
// 	password: {
// 		type: String,
// 		required: true
// 	},
// 	firstName: {type: String, default: ''},
// 	lastName: {type: String, default: ''}
//});

// UserSchema.methods.validatePassword = function(password){
// 	return bcrypt.compare(password, this.password);
// };

// UserSchema.statics.hashPassword = function(password){
// 	return bcrypt.hash(password, 10);
// };


var shoppingList = mongoose.model('ShoppingList', shoppingListSchema);
var shoppingLocation = mongoose.model('ShoppingLocation', shoppingLocationSchema);
//var user = mongoose.model('UserSchema', UserSchema); 

module.exports = {
 	shoppingList: shoppingList,
 	shoppingLocation: shoppingLocation
 	//user: user
 }