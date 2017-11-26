const express = require('express');
const shoppingItemModel = require('../model');

const router = express.Router();

// router.use(function(req, res, next) { console.log("route middleware");
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next(); 
//});

router.route('/')
    .get(function(req, res) {
        shoppingItemModel.find({})
            .then(function(items) {
                res.status(200).json(items);

            })
            .catch(function() {
                console.log('inside of catch');
                res.status(500).send('Something happened');
            });
    })

    .post(function(req, res) {
        let newShoppingItem = new shoppingItemModel();
        newShoppingItem.listName = req.body.listName;
        newShoppingItem.item.push(req.body.item);
        newShoppingItem.quantity.push(req.body.quantity);

        newShoppingItem.save()
            .then(function() {
                console.log('inside of then');
                res.status(200).send("Item saved");
            })
            .catch(function() {
                console.log('inside of catch');
                res.status(500).send('Something happened');
            });
        console.log('end of code');
    })

router.route('/id/:id')
    .get(function(req, res) {
        let myId = req.params.id;
        shoppingItemModel.findById(myId)
            .then(function(item) {
                res.status(200).json(item);
            })
            .catch(function() {
                console.log('inside of catch');
                res.status(500).send('Something happened');
            })

    })
    .delete(function(req, res) {
        shoppingItemModel.findByIdAndRemove(req.params.id)
            .then(function(item) {
                res.status(201).send(`your ${item.item} was removed`)
            })
    })

// router.route('/item/:item')
//     .get(function(req, res) {
//         let myItem = req.params.item;
//         shoppingItemModel.find({ item: new RegExp('^' + myItem + '*', "i") })
//             .then(function(items) {
//                 res.status(200).json(items);
//             })
//             .catch(function() {
//                 console.log('inside of catch');
//                 res.status(500).send('Something happened');
//             })
//     })

router.route('/id/:id')
    .put(function(req, res) {
            let editOptions = ['item', 'quantity'];
            let editField = {};

            editOptions.forEach((field) => {
                if (field in req.body) {
                    editField[field] = req.body[field]
                }
            });
            shoppingItemModel.findByIdAndUpdate(req.params.id, { $set: editField }, { new: true })
                .then((item) => {
                    console.log('put successful')
                    res.status(200).json(item);
                })

                .catch(() => {
                    console.log('inside of catch');
                    res.status(400).send('something bad happened')
                })


    });            
            module.exports = router;