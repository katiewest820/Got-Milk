const express = require('express');


const router = express.Router(); 

router.route('/')
	.get(function(req, res){
		res.send("this GET request is working");
	});

module.exports = router;	