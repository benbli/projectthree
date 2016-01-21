
function getUsersTextbooks(){
  var userId = $.cookie('user-id');
  $.ajax({
    method: 'get',
    url: '/api/books?user=' + $.cookie('user-id'),
    success: function(data){
      renderCurrentUser(data)
    }
  })
}

function renderCurrentUser(data){
  var data = data.user_id;
  $('#sold-books').empty();
  $('#books-for-sale').empty();
  for (var i = 0; i < data.length; i++) {
    var textbook = data[i];
    var eachBook = $('<div id = "each-book">');
    var title = $('<h5 id = "text-title">').text(textbook.title);
    var author = $('<p id = "text-author">').text('By: ' + textbook.author);
    var isbn = $('<p id = "text-isbn">').text('ISBN#: ' + textbook.isbn);
    var condition = $('<p id = "text-condition">').text('Condition: ' + textbook.condition)
    var image = $('<img id = "text-image">').attr('src', textbook.image);
    if(textbook.price != undefined){
      var price = $('<h5 id = "profile-book-price">').text('$'+ textbook.price);
    }
    eachBook.append(title, author, isbn, condition, image, price);
    if(textbook.status === 0){
      var sellingBookDiv = $('#books-for-sale');
      var soldButton =  $('<button data-id='+textbook._id+' id = "sell-book-link" class = "btn btn">').text('Book Has Been Sold');
      var deleteButton = $('<button data-id='+textbook._id+' id = "delete-book" class = "btn btn">').text('Remove Book');
      eachBook.append(soldButton, deleteButton);
      sellingBookDiv.append(eachBook);
    } else if(textbook.status === 1) {
      var soldBookDiv = $('#sold-books');
      var sellButton = $('<button data-id='+textbook._id+' id = "re-list-book" class = "btn btn">').text("Re-List Book");
      var soldImg = $('<img class="sold-img">').attr('src', "./images/Sold.png");
      eachBook.append(sellButton);
      soldBookDiv.append(eachBook, soldImg);
    }
  }
}

function removeTextbook(textbookId){
  $.ajax({
    method: 'delete',
    url: '/api/books/' + textbookId,
    success: function(){
      getUsersTextbooks();
    }
  })
}

function removeTextbookHandler(){
  $('body').on('click', '#delete-book', function(){
    var textbookId = this.dataset.id;
    removeTextbook(textbookId);
  })
}

function markTextbookAsSold(textbookId, textbookStatus){
  console.log('id: ', textbookId);
  $.ajax({
    method: 'patch',
    url: '/api/books/' + textbookId,
    data: textbookStatus,
    success: function(data){
      console.log('on success data: ', data);
      getUsersTextbooks();
    }
  })
}

function setSellTextbookHandler(){
  $('body').on('click', '#sell-book-link', function(){
    var textbookId = this.dataset.id;
    var textbookStatus = {status: 1};
    markTextbookAsSold(textbookId, textbookStatus);
  })
}

function relistTextbook(textbookId, textbookStatus){
  $.ajax({
    method: 'patch',
    url: '/api/books/' + textbookId,
    data: textbookStatus,
    success: function(data){
      getUsersTextbooks();
    }
  })
}

function setRelistTextbookHandler(){
  $('body').on('click', '#re-list-book', function(){
    var textbookId = this.dataset.id;
    var textbookStatus = {status: 0};
    relistTextbook(textbookId, textbookStatus);
  })
}

function getUserInformation(){
  var userId;
  $.ajax({
    method: 'get',
    url: '/api/users/' + $.cookie('user-id'),
    success: function(data){
      var user = data.users;
      appendUserInformation(user);
    }
  })
}

function appendUserInformation(user){
  $('#hello-user').text("Hello " + user.username + "!");
  $('#college').text("Currently Attending: " + user.college);
  $('#email').text('Email: '+ user.email);
}

$(function(){
  removeTextbookHandler();
  getUsersTextbooks();
  setSellTextbookHandler();
  setRelistTextbookHandler();
  $('#profile-tab').remove();
  getUserInformation();
})
