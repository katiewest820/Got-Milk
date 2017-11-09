const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();



const shoppingItemRoute = require('./routes/shoppingitem');

app.all('/');
app.use('/item', shoppingItemRoute);

app.listen(8080, function(){
	console.log("I\"m working");
});

