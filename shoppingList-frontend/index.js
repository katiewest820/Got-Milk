console.log('I am working!!!')

function getAllItems() {
    $.get('http://localhost:8081/item', function(results, error) {
        $('.shoppingList').empty();
        console.log(results);

        results.forEach((item, index) => {
            let html = `<div><p>${index+1}-${item.item}</p><p>${item.quantity}</p>`
            html += `<button value='${item._id}' class='delete'>Delete</button></div>`
            $('.shoppingList').append(html)
        });
    });
};

function deleteItem() {
    $('body').on('click', '.delete', function() {
        let itemId = $(this).val()
        let divToRemove = $(this).parent();
        $.ajax({
                url: `http://localhost:8081/item/id/${itemId}`,
                type: 'DELETE'
            })
            .done(function() {
                console.log('delete was successful')

                divToRemove.remove();

            });
    });
};

function addItem() {
    $('.submitButton').on('click', function() {
        let myItem = {
            item: $('.inputDataItem').val(),
            quantity: $('.inputDataQuantity').val()
        }
        $.ajax({
                url: 'http://localhost:8081/item',
                type: 'POST',
                //dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(myItem)
            })
            .done(function() {
                console.log('post successful')
                getAllItems()


            });
    });
};


deleteItem()
addItem()
getAllItems()