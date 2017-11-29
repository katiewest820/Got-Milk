const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config');
const router = express.Router();

const user = require('../model').user;

let token;
//const createAuthToken = function(user) {
  //  return jwt.sign({ user }, config.JWT_SECRET)
}


router.post('/login', (req, res) => {
    //check to see if user exists
    user.findOne({ username: req.body.username })
        .then((user) => {
            //if user does not exist stop and send error
            if (!user) {
                res.send('user does not exist').status(500)
                return
            }
            //check to see if password matches. If not send error
            if (!bcrypt.compare(req.body.password, user.password)) {
                res.send('password does not match').status(500)
                return
            }
            //if you are here, user exists and password matches
            let userToken = {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName
            }
            token = jwt.sign(userToken, config.JWT_SECRET)
            console.log(`token: ${token}`)
            res.send(token).status(200)
        })
        .catch((err) => {
            console.log(err)
            res.send('Somthing bad happened').status(500)
        })
});


//creating new user
router.post('/register', (req, res) => {
    //if UN already exsists send error
    user.findOne({ username: req.body.username })
        .then((user) => {
            if (user) {
                res.send('username already exists, please try again').status(500)
                return
            }
            //if UN is unique, create new user
            const newUser = new user();
            newUser.username = req.body.username;
            newUser.firstName = req.body.firstName;
            newUser.lastName = req.body.lastName;
            newUser.password = bcrypt.hash(req.body.password, 10);

            //saving new user 
            newUser.save((err, user) => {
                if (err) {
                    console.log(err)
                    res.send('Something bad happened').status(500)
                    return
                }
                console.log(user)
                res.send('new user created').status(200)
            })

       	.catch((err) => {
            console.log(err);
            res.send('Something bad happened').status(500)
        });

    });
});

//token refresh when previous token expires
router.post('/refresh', (req, res) => {
	token = jwt.sign(userToken, config.JWT_SECRET)
	console.log(`new token: ${token}`)
    res.send(token).status(200)
})

module.exports = router;