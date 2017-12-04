let myShoppingList;
let myShoppingItems;
let myURL = window.location.href.split('#')[0];
let myVal;
let myStorage = window.localStorage;

//keep logged in user logged in
function checkUserLogin(){
    if(localStorage.getItem('userId')){
        $('.apiListName').empty()
        $('.loginPage').css('display', 'none')
        $('.createNewList').css('display', 'block')
        showListNames()
    }
}

//log out function
function logOut(){
    $('.logOut').on('click', function(){
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        $('.userNameInput').val('');
        $('.passwordInput').val('');
        $('.createNewList').fadeOut();
        $('.loginPage').delay(500).fadeIn('slow');
    });
}    

//login functions
function userLogin(){
    $('.submitLogin').on('click', function(){
        let username = $('.userNameInput').val();
        let password = $('.passwordInput').val();
        let userLoginInfo = {
            username: username,
            password: password
        }
        $.ajax({
            url: `${myURL}auth/login`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userLoginInfo)
        })
        .done((response) => {
            console.log(`this is a message: ${response.token}`)
            
            if(response.token == 'you must enter a username and password'){
                console.log('error 1')
                missingLoginField();
                return
            }
            if(response.token == 'user does not exist'){
                console.log('error 2')
                userDoesNotExist();
                return
            }
            if(response.token == 'password does not match'){
                console.log('error 3')
                passwordWrong();
                return
            }
            localStorage.setItem('tokenKey', response.token)
            localStorage.setItem('userId', response.userId)
            $('.apiListName').empty()
            $('.loginPage').fadeOut();
            $('.createNewList').delay(400).fadeIn();
            showListNames();  
        })
        .fail((err) => {
            console.log(`something bad happened ${err}`)
        });
    });
}

//login error messages
function missingLoginField(){
    $('.loginPage').fadeOut().delay(1800).fadeIn();
    $('.errorMsg').html('<h1>Please enter valid username and password</h1>');
    $('.errorScreen').delay(400).fadeIn().delay(1000).fadeOut();
}

function userDoesNotExist(){
    $('.loginPage').fadeOut().delay(1800).fadeIn();
    $('.errorMsg').html('<h1>Username does not exist</h1>');
    $('.errorScreen').delay(400).fadeIn().delay(1000).fadeOut();
}

function passwordWrong(){
    $('.loginPage').fadeOut().delay(1800).fadeIn();
    $('.errorMsg').html('<h1>Incorrect password entered</h1>');
    $('.errorScreen').delay(400).fadeIn().delay(1000).fadeOut();
}


//Create new account
function createAccountPageLoad(){
    $('.createNewAct').on('click', function(){
        $('.loginPage').fadeOut();
        $('.createAccountPage').delay(400).fadeIn();
    })
}

//Accout create error and success messages
function actCreatedSuccessMsg(){
    $('.createAccountPage').fadeOut();
    $('.errorMsg').html('<h1>Your account was successfully created!</h1>');
    $('.errorScreen').delay(400).fadeIn().delay(1200).fadeOut();
    $('.loginPage').delay(2100).fadeIn('slow');
}

function errorUsernameMsg(){
    $('.createAccountPage').fadeOut().delay(1800).fadeIn();
    $('.errorMsg').html('<h1>A Username is Required</h1>');
    $('.errorScreen').delay(400).fadeIn().delay(1200).fadeOut();
}

function errorPasswordMsg(){
    $('.createAccountPage').fadeOut().delay(1800).fadeIn();
    $('.errorMsg').html('<h1>A Password is Required</h1>');
    $('.errorScreen').delay(400).fadeIn().delay(1200).fadeOut();
}

//Submitting new user to DB
function submitNewUserForm(){
    $('.submitNewAct').on('click', function(){
        let UN = $('.createUN').val();
        let FN = $('.createFN').val();
        let LN = $('.createLN').val();
        let PW = $('.createPW').val();
        let newUser = {
            username: UN,
            firstName: FN,
            lastName: LN,
            password: PW
        }
        console.log(`${UN} ${FN} ${LN} ${PW}`)

        $.ajax({
            url: `${myURL}auth/register`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newUser)
        })
        .done((item) => {
            if(item == 'You must create a username'){
                errorUsernameMsg();
                return
            }
            if(item == 'you must create a password'){
                errorPasswordMsg();
                return
            }else{
                console.log(item)
                actCreatedSuccessMsg();
            }
        })
        .fail((err) => {
            console.log(err)
        })
    })
}


//Cancel account creation
function cancelNewAct(){
    $('.cancelNewAct').on('click', function(){
        $('.createAccountPage').fadeOut();
        $('.loginPage').delay(500).fadeIn();
    })
}

//after login, load user information
function showListNames() {
    $.ajax({
        url: `${myURL}item/getByUser/${localStorage.getItem('userId')}`,
        type: 'GET', 
        headers: {authorization: myStorage.tokenKey}
        })
        .done((results) => {
            console.log(results)
            results.forEach((item) => {
                $('.apiListName').append(`<div class="listNameRow">
                    <i class="fa fa-trash deleteListName" title="Delete List" aria-hidden="true" value="${item._id}"></i>
                    <a href="#" value="${item._id}" class="${item._id}">${item.listName}</a></div>`)
            });
        })
        .fail((err) => {
            console.log(err)
        })
}

//Create new shopping list name
function addListName() {
    $('.newListButton').on('click', function() {
        let listNameVal =  $('.inputDataListName').val()
        let myListName = {
            listName: listNameVal,
            userId: localStorage.getItem('userId')
        }
        console.log(listNameVal.length)
        if(listNameVal.length <= 0){
            entryError();
        }else{
        $.ajax({
                url: `${myURL}item`,
                type: 'POST',
                contentType: 'application/json',
                headers: {authorization: myStorage.tokenKey},
                data: JSON.stringify(myListName)
            })
            .done(function(item) {
                console.log('post successful')
                console.log(item)
                document.getElementById('newList').reset()
                $('.apiListName').prepend(`<div class="listNameRow">
                    <i class="fa fa-trash deleteListName" title="Delete List" aria-hidden="true" value="${item._id}"></i>
                    <a href="#" value="${item._id}" class="${item._id}">${item.listName}</a></div>`)


            });
        }    
    });
};

//Error messages for missed location field entry
function entryError(){
    $('.createNewList').fadeOut().delay(1800).fadeIn();
    $('.errorMsg').html('<h1>Please Complete All fields</h1>');
    $('.errorScreen').delay(400).fadeIn().delay(1000).fadeOut();
}

//Error message for missed item field entry
function entryErrorTwo(){
    $('.shoppingListItems').fadeOut().delay(1800).fadeIn();
    $('.errorMsg').html('<h1>Please Complete All fields</h1>');
    $('.errorScreen').delay(400).fadeIn().delay(1000).fadeOut();
}

function deleteListName(){
    $('.apiListName').on('click', '.deleteListName', function(){
        let thisDiv = $(this).parent('.listNameRow')
        console.log(thisDiv)
        let myId = $(this).attr('value')
        console.log(myId)
        $.ajax({
            url: `${myURL}item/id/${myId}`,
            type: 'DELETE',
            headers: {authorization: myStorage.tokenKey}
        })
        .done(function(item){
            console.log('successful delete')
            console.log(item)
            $(thisDiv).remove()
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
    $.ajax({
        url: `${myURL}item/id/${myVal}`, 
        type: 'GET',
        headers: {authorization: myStorage.tokenKey}
    })    
    .done((results) => {
        myShoppingList = results;
        console.log(myShoppingList.allItems);
        myShoppingItems = myShoppingList.allItems
        $('.shoppingList').empty();
        $('.createNewList').fadeOut();
        $('.shoppingListItems').delay(500).fadeIn('slow');
        $('.title').html(`${myShoppingList.listName} Shopping List`)
        let obj = myShoppingList.allItems
        for (x in obj) {
            console.log(obj[x])
            //sorting items by checked status
            let sorted = obj.sort((a,b) => {
                return a.checked - b.checked
            })
            console.log(sorted)

           let checked = '';
           if(obj[x].checked == true){
            checked = 'checked'
           }
           $('.shoppingList').append(`<div id='${obj[x]._id}' class='${checked}'>
                                    <p>Item: ${obj[x].item}</p>
                                    <p>Quantity: ${obj[x].quantity}</p>
                                    <i class="fa fa-check checkOff" title="Check Off Item" aria-hidden="true"></i>
                                    <i class="fa fa-trash delete" title="Delete Item" aria-hidden="true"></i></div>`)
        }

    })
    .fail((err) => {
        console.log(err)
    });

};


function cancelEntry(){
    $('.cancelEntry').on('click', function(){
        $('input[type="text"], textarea').val('');
        $('#inputBox').slideUp('slow');
        $('.addItemScreenButtons').delay(400).fadeIn();
    });
}


function addItem() {
    $('.submitButton').on('click', function() {
        console.log('beginning of post')
        let itemVal = $('.inputDataItem').val();
        console.log(itemVal)
        let quantityVal = $('.inputDataQuantity').val();
        console.log(quantityVal)
        let myItem = {  
            item: itemVal,
            quantity: quantityVal,
            checked: false
        }

        if(quantityVal <= 0 || itemVal <= 0){
            entryErrorTwo()
        }else{
        $.ajax({
                url: `${myURL}item/id/${myShoppingList._id}`,
                type: 'POST',
                contentType: 'application/json',
                headers: {authorization: myStorage.tokenKey},
                data: JSON.stringify(myItem)
            })
            .done(function() {
                console.log('post successful')
                $('input[type="text"], textarea').val('');
                $('#inputBox').slideUp('slow');
                $('.addItemScreenButtons').delay(400).fadeIn();
                getAllItems();

            })
            .fail(function(jqXHR, textStatus, err) {
                console.log('something bad happened' + err)
                console.log(textStatus)
            })
        }    
    });
};

function deleteItem() {
    $('.shoppingList').on('click', '.delete',  function() {
        let parentId = myShoppingList._id
        let itemId = $(this).parent().attr('id')
        console.log(itemId)
        $.ajax({
                 url: `${myURL}item/id/${parentId}/${itemId}`,
                 type: 'DELETE',
                 headers: {authorization: myStorage.tokenKey}
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
            headers: {authorization: myStorage.tokenKey},
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

function deleteAllCheckedOff(){
    $('.deleteAllChecked').on('click', function(){
        let parentId = myShoppingList._id;
        //let itemId = myShoppingItems._id;
        $.ajax({
            url: `${myURL}item/completed/id/${parentId}`,
            type: 'DELETE',
            headers: {authorization: myStorage.tokenKey}
        })
        .done(() =>{
            console.log('delete many success')
            getAllItems()
        })
        .fail((err) =>{
            console.log('something bad happened' + err)
        })


    })
}

function showAddItemsForm(){
    $('.addItemsButton').on('click', function(){
        $('#inputBox').slideDown('slow').css('display', 'grid')
        $('.submitButton').delay(500).fadeIn();
        $('.cancelEntry').delay(500).fadeIn();
        $('.addItemScreenButtons').fadeOut();
       
    })
}

function backToLists(){
    $('.back').on('click', function(){
        myShoppingList = ' ';
        myShoppingItems = ' ';
        myVal = ' ';
        $('.apiListName').empty()
        $('.shoppingListItems').fadeOut();
        $('.createNewList').delay(500).fadeIn('slow');
        showListNames()
    })
}


checkUserLogin()
logOut()
userLogin()
createAccountPageLoad()
submitNewUserForm()
cancelNewAct()
deleteItem()
addItem()
showListItems()
addListName()
checkOffListItem()
backToLists()
deleteListName()
showAddItemsForm()
cancelEntry()

deleteAllCheckedOff()