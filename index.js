const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

const router = express.Router();
router.route('/hello')
	.get(function (req, res){
		res.send('Hello World');	
	}); 



app.all('/');
app.use('/', router)

app.listen(3000, function(){
	console.log("I\"m working");
});

