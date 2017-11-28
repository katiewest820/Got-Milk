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
            $('.apiListName').append(`<div class="listNameRow"><i class="fa fa-trash deleteListName" aria-hidden="true" value="${item._id}"></i><a href="#" value="${item._id}" class="${item._id}">${item.listName}</a></div>`)
        });
    });
}

function addListName() {
    $('.newListButton').on('click', function() {
        let myListName = {
            listName: $('.inputDataListName').val()
        }
        $.ajax({
                url: `${myURL}item`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(myListName)
            })
            .done(function() {
                console.log('post successful')
                document.getElementById('newList').reset()
                showListNames();


            });
    });
};

function deleteListName(){
    $('.apiListName').on('click', '.deleteListName', function(){
        let myId = $(this).attr('value')
        console.log(myId)

        $.ajax({
            url: `${myURL}item/id/${myId}`,
            type: 'DELETE'
        })
        .done(function(){
            console.log('successful delete')
            showListNames()
        })
        .fail(function(err){
            console.log('something bad happened' + err)

        })
    })
}

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
        $('.title').html(`${myShoppingList.listName} Shopping List`)
        let obj = myShoppingList.allItems
        for (x in obj) {
            
            console.log(obj[x])
           let checked = '';
           if(obj[x].checked == true){
            checked = 'checked'
           }
           $('.shoppingList').append(`<div id='${obj[x]._id}' class='${checked}'><p>Item: ${obj[x].item}</p><p>Quantity: ${obj[x].quantity}</p>
                                        <i class="fa fa-check fa-2x checkOff" aria-hidden="true"></i><i class="fa fa-trash fa-2x delete" aria-hidden="true"></i></div>`)
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
                $('input[type="text"], textarea').val('');
                $('.addItemsButton').fadeIn();
                $('#inputBox').fadeOut();
                getAllItems();

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
        let itemId = $(this).parent().attr('id')
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

function showAddItemsForm(){
    $('.addItemsButton').on('click', function(){
        $('#inputBox').slideDown('slow').css('display', 'grid')
        $('.submitButton').delay(500).fadeIn()
        $('.addItemsButton').fadeOut();
       
    })
}

function backToLists(){
    $('.back').on('click', function(){
        myShoppingList = ' ';
        myShoppingItems = ' ';
        myVal = ' ';
        $('.shoppingListItems').fadeOut();
        $('.createNewList').fadeIn();
        showListNames()
    })
}

deleteItem()
addItem()
showListNames()
showListItems()
addListName()
checkOffListItem()
backToLists()
deleteListName()

showAddItemsForm()