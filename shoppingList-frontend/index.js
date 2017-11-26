console.log('I am working!!!')

let myShoppingList;
let myURL = window.location.href.split('#')[0];
let myVal;


function showListNames() {
    $('.apiListName').empty()
    $.get(`${myURL}item`, function(results, error) {
        console.log(results)
        results.forEach((item) => {
            $('.apiListName').append(`<a href="#" class="${item._id}">${item.listName}</a>`)
        });
    });
}

function addListName() {
    $('.newListButton').on('click', function() {
        let myListName = {
            listName: $('.inputDataListName').val()
        }
        $.ajax({
                url: 'http://localhost:8081/item',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(myListName)
            })
            .done(function() {
                console.log('post successful')
                showListNames();


            });
    });
};

function showListItems() {
    $('.apiListName').on('click', 'a', function() {
        myVal = $(this).attr('class');
        console.log(myVal)
        getAllItems();
    });
}


function getAllItems() {
    $.get(`${myURL}item/id/${myVal}`, function(results, error) {
        myShoppingList = results;
        console.log(myShoppingList);
        $('.shoppingList').empty();
        $('.createNewList').fadeOut();
        $('.shoppingListItems').fadeIn();
        $('.shoppingList').append(`<h1>${myShoppingList.listName} Shopping List</h1>`)
        for (let i = 0; i < myShoppingList.item.length; i++) {
            $('.shoppingList').append(`<div class="listItems"><p>Item: ${myShoppingList.item[i]}</p><p>Quantity: ${myShoppingList.quantity[i]}</p>
                                        <button class="checkOff">Check off Item</button><button class="delete">Delete Item</button></div>`)
        }

    });

};

function deleteItem() {
    $('.shoppingList').on('click', '.delete',  function() {
        let itemId = myShoppingList._id
        
        $.ajax({
                url: `http://localhost:8081/item/id/${itemId}`,
                type: 'DELETE'
            })
            .done(function() {
                console.log('delete was successful')

                

            });
    });
};

function addItem() {
    $('.submitButton').on('click', function() {
        myShoppingList.item.push($('.inputDataItem').val())
        myShoppingList.quantity.push($('.inputDataQuantity').val())
        let myItem = {
            listName: myShoppingList.listName,
            item: myShoppingList.item,
            quantity: myShoppingList.quantity
        }
        $.ajax({
                url: `${myURL}item/id/${myShoppingList._id}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(myItem)
            })
            .done(function() {
                console.log('put successful')
                getAllItems()


            });
    });
};


deleteItem()
addItem()
//getAllItems()
showListNames()
showListItems()
addListName()