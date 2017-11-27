const express = require('express');
const { shoppingList, shoppingLocation } = require('../model');
//const shoppingList = require('../model')
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
        shoppingLocation.find({})
            .then(function(items) {
                res.status(200).json(items);

            })
            .catch(function() {
                console.log('inside of catch');
                res.status(500).send('Something happened');
            });
    })

    .post(function(req, res) {
        let newShoppingLocation = new shoppingLocation();
        newShoppingLocation.listName = req.body.listName;
        //newShoppingItem.item.push(req.body.item);
        //newShoppingItem.quantity.push(req.body.quantity);

        newShoppingLocation.save()
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
        shoppingLocation.findById(myId)
            .then(function(item) {
                res.status(200).json(item);
            })
            .catch(function() {
                console.log('inside of catch');
                res.status(500).send('Something happened');
            })

    });

router.delete('/id/:id', (req, res) => {
    console.log('found me')
    shoppingLocation.findByIdAndRemove(req.params.id)
        .then((item) => {
            console.log('inside of delete then')
            res.send('delete successful').status(201)
        })
        .catch((err) => {
            console.log('something bad happened:' + JSON.stringify(err))
            res.status(400).send('something bad happened:' + JSON.stringify(err))
        })
})

router.delete('/id/:shoppingLocationId/:id', (req, res) => {
    shoppingLocation.findById(req.params.shoppingLocationId)
        .then((item) => {
            console.log(item.allItems)
            let myId = req.params.id;
            item.allItems = item.allItems.filter(newArr => newArr._id != myId);
            item.save();
            console.log('delete request processing');
            res.status(201).send(`your ${item} was removed`);
        })
        .catch(function(err) {
            console.log('something bad happened' + err)
            res.status(400).send('something bad happened' + err)
        })
});



router.route('/id/:id')
    .post(function(req, res) {
        let myID = req.params.id
        shoppingLocation.findById(myID)
            .then(function(item) {

                let newShoppingListItem = new shoppingList();
                newShoppingListItem.item = req.body.item;
                newShoppingListItem.quantity = req.body.quantity;
                newShoppingListItem.checked = false;


                item.allItems.push(newShoppingListItem)
                item.save()
                res.send(200)
            })
    });

router.put('/id/:parentId/:id', (req, res) => {
    shoppingLocation.findById(req.params.parentId)
        .then(function(item) {
            let myId = req.params.id;
            for (let i = 0; i < item.allItems.length; i++) {
                if (item.allItems[i]._id == myId) {





                    let editOptions = ['item', 'quantity', 'checked'];


                    editOptions.forEach((field) => {
                        if (field in req.body) {
                            item.allItems[i][field] = req.body[field]
                        }
                    })
                }
            }
            item.save()
        })
        //shoppingList.findByIdAndUpdate(req.params.id, { $set: editField }, { new: true })
        .then((item) => {
            console.log('put successful')

            res.status(200).send('put successful');
        })

        .catch(() => {
            console.log('inside of catch');
            res.status(400).send('something bad happened')
        })


});

module.exports = router;