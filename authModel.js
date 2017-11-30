const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	firstName: {type: String, default: ''},
	lastName: {type: String, default: ''}
});

UserSchema.methods.validatePassword = function(password){
	return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password){
	return bcrypt.hash(password, 10);
};


module.exports = mongoose.model('UserSchema', UserSchema); 
