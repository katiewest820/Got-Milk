console.log('I am working!!!')

let myShoppingList;
let myShoppingItems;
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
        console.log(myShoppingList.allItems);
        myShoppingItems = myShoppingList.allItems
        $('.shoppingList').empty();
        $('.createNewList').fadeOut();
        $('.shoppingListItems').fadeIn();
        $('.shoppingList').append(`<h1>${myShoppingList.listName} Shopping List</h1>`)
        let obj = myShoppingList.allItems
        for (x in obj) {
            
            console.log(obj[x])
           let checked = '';
           if(obj[x].checked == true){
            checked = 'checked'
           }
           $('.shoppingList').append(`<div id='${obj[x]._id}'' class='${checked}'><p>Item: ${obj[x].item}</p><p>Quantity: ${obj[x].quantity}</p>
                                        <button class="checkOff">Check off Item</button><button class="delete">Delete Item</button></div>`)
        }

    });

};


function addItem() {
    $('.submitButton').on('click', function() {
        console.log('beginning of post')
        let myItem = {  
            item: $('.inputDataItem').val(),
            quantity: $('.inputDataQuantity').val(),
            checked: false
        }
        $.ajax({
                url: `${myURL}item/id/${myShoppingList._id}`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(myItem)
            })
            .done(function() {
                console.log('post successful')
                getAllItems()
            })
            .fail(function(jqXHR, textStatus, err) {
                console.log('something bad happened' + err)
                console.log(textStatus)
            })
    });
};

function deleteItem() {
    $('.shoppingList').on('click', '.delete',  function() {
        let parentId = myShoppingList._id
        let itemId = $(this).parent().attr('class')
        console.log(itemId)
        $.ajax({
                 url: `${myURL}item/id/${parentId}/${itemId}`,
                 type: 'DELETE'
             })
            .done(function() {
                 console.log('delete was successful')
                 getAllItems()
            })
            .fail(function(jqXHR, textStatus, err){
                console.log('something bad happened' + err)
                console.log(textStatus)
            })
    });
};

function checkOffListItem(){
    $('.shoppingList').on('click', '.checkOff', function(){
        $(this).parent('div').toggleClass('checked')
        let checked = $(this).parent('div').hasClass('checked')

        
        let myId = $(this).parent('div').attr('id')
        let parentId = myShoppingList._id
        $.ajax({
            url: `${myURL}item/id/${parentId}/${myId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                checked: checked
            })
        })    
            .done(function(){
                console.log('put success')
                getAllItems()
            })
            .fail(function(err){
                console.log('something happened' + JSON.stringify(err))
            });
    });
}

deleteItem()
addItem()
showListNames()
showListItems()
addListName()
checkOffListItem()