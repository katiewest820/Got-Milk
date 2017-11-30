const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');
const config = require('../config');
const router = express.Router();

const UserSchema = require('../authModel');

mongoose.Promise = global.Promise;

let token;
let loggedInUser;

const createAuthToken = function(user) {
    return jwt.sign({ user }, config.JWT_SECRET)
}

//UserSchema.statics.hashPassword = function(password){
//   return bcrypt.hash(password, 10);
//

router.post('/login', (req, res) => {
    //check to see if User exists

    UserSchema.findOne({ username: req.body.username })
        .then((user) => {
            loggedInUser = user;
            //if User does not exist stop and send error
            if (!user) {
                res.send('user does not exist').status(500)
                return
            }
            //check to see if password and username are included
            if(!req.body.password && req.body.username){
                res.send('you must enter a username and password')
                return
            }
            //check to see if password matches. If not send error
            if (!bcrypt.compareSync(req.body.password, user.password)) {

                res.send('password does not match').status(500)
                return
            } else {

                //if you are here, User exists and password matches
                let userToken = {
                    username: UserSchema.username,
                    firstName: UserSchema.firstName,
                    lastName: UserSchema.lastName
                }
                token = jwt.sign(userToken, config.JWT_SECRET)
                console.log(`token: ${token}`)
                res.send(`password matches! Token: ${token}`).status(200)

            }

        })


        .catch((err) => {
            console.log(err)
            res.send('Somthing bad happened').status(500)
        })
})


//creating new user
router.post('/register', (req, res) => {
    //if UN already exsists send error
    UserSchema.findOne({ username: req.body.username })
        .then((user) => {

            if (user) {
                res.send('username already exists, please try again').status(500)
                return
            }
            //if UN is unique, create new user
            const newUser = new UserSchema()
            newUser.username = req.body.username;
            newUser.firstName = req.body.firstName;
            newUser.lastName = req.body.lastName;
            //taking password and running through hash function
            bcrypt.hash(req.body.password, 8, (err, hash) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(hash)
                }
                newUser.password = hash
                //saving new user 
                newUser.save((err, user) => {
                    if (err) {
                        console.log(err)
                        res.send(err).status(500)
                        return
                    }
                    res.send('new user created').status(200)
                })
            })
        })
        .catch((err) => {
            console.log(err);
            res.send('Something bad happened').status(500)
        });
});


//token refresh when previous token expires
router.post('/refresh', (req, res) => {
    let userToken = {
        username: UserSchema.username,
        firstName: UserSchema.firstName,
        lastName: UserSchema.lastName
    }

    token = jwt.sign(userToken, config.JWT_SECRET)
    console.log(`new token: ${token}`)
    res.send(token).status(200)
})

module.exports = router;
