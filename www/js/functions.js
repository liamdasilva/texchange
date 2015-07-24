var getPostings = function(tableName, user){
  var query = new Parse.Query(tableName);
  query.equalTo("author",user);
  var postings = [];
  //set up a promise to return
  var promise = new Parse.Promise();
  query.find().then(function(results) {
      //alert("Successfully retrieved " + results.length + " buy posts.");
      // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {
        var object = results[i].toJSON();
        postings.push(object);
      }
      //fires the .then() in the code calling this function
      promise.resolve(postings);
    },function(error){
      //fires the error part in the .then() in the code calling this function
      promise.reject("Error: " + error.message);
    });
  return promise;
}

//returns a list of Parse objects containing sell posts and authors
var getPostingsByCourseCode = function(tableName, courseCode){
  var query = new Parse.Query(tableName);
  query.equalTo("courseCode",courseCode);
  query.include("author");
  var postings = [];
  //set up a promise to return
  var promise = new Parse.Promise();
  query.find().then(function(results) {
    for (var i = 0; i < results.length; i++) {
      var object = results[i].toJSON();
      object.author = results[i].get("author").toJSON();
      postings.push(object);
    }
    //fires the .then() in the code calling this function
    promise.resolve(postings);
  },function(error){
    //fires the error part in the .then() in the code calling this function
    promise.reject("Error: " + error.message);
  });
  return promise;
}

//this returns a list of Parse objects containing user1 and user2
var getConversations = function(){
  var query = new Parse.Query("Conversations");
  query.include("user1");
  query.include("user2");
  var postings = [];
  //set up a promise to return
  var promise = new Parse.Promise();
  query.find().then(function(results) {
      promise.resolve(results);
    },function(error){
      //fires the error part in the .then() in the code calling this function
      promise.reject("Error: " + error.message);
    });
  return promise;
}

var getOtherConversationUser = function(conversations){
  var newList = [];
  if(Parse.User.current()){
    for (var i = 0; i < conversations.length; i++) {
      conversation = conversations[i];
      var convo = {};
      convo.updatedAt = conversation.get("updatedAt");
      if(Parse.User.current().get("username") == conversation.get("user1").get("username")){
        convo.name = conversation.get("user2").get("firstName") + " "+ conversation.get("user2").get("lastName");
        convo.userID = conversation.get("user2").id;
        convo.id = conversation.id;
      }else{
        convo.name = conversation.get("user1").get("firstName") + " "+ conversation.get("user1").get("lastName");
        convo.userID = conversation.get("user1").id;
        convo.id = conversation.id;
      }
      newList.push(convo);
    }
  }
  return newList;
}

var getPostingById = function(tableName,id){
  var query = new Parse.Query(tableName);
  //set up a promise to return
  var promise = new Parse.Promise();
  query.get(id, {
  success: function(result) {
      promise.resolve(result.toJSON());
  },
  error: function(object, error) {
    // The object was not retrieved successfully.
      promise.reject("Error: "+error.message);
  }
});
  return promise;
}

var updatePostingById = function(tableName,ID,postData){
  // Create a pointer to an object of class tableName with id ID
  var Posting = Parse.Object.extend(tableName);
  var posting = new Posting();
  posting.id = ID;

  // Set a new value on quantity
  posting.set("courseCode", postData.courseCode);
  posting.set("title", postData.title);
  posting.set("price", Number(postData.price));
  posting.set("edition", Number(postData.edition));
  posting.set("visibility", postData.visibility);//a saved post can only be seen by the user
  var promise = new Parse.Promise();
  // Save
  posting.save(null, {
    success: function(post) {
      promise.resolve("Save successful",post);
    },
    error: function(post, error) {
      // The save failed.
      promise.reject("Error: " + error.message);
    }
  });
  return promise;
}

var deletePostingById = function(tableName,ID){
  // Create a pointer to an object of class tableName with id ID
  var Posting = Parse.Object.extend(tableName);
  var posting = new Posting();
  posting.id = ID;
  // Set a new value on quantity
  var promise = new Parse.Promise();
  // Save
  posting.destroy({
    success: function(post) {
      promise.resolve("Delete successful",post);
    },
    error: function(post, error) {
      // The save failed.
      promise.reject("Error: " + error.message);
    }
  });
  return promise;
}

//signs up a new user and logs them in given a userData object
//the userData object contains username, email, password, firstName and lastName
var signUpNewUser = function(userData){
  var user = new Parse.User();
  user.set("username", userData.username);
  user.set("password", userData.password);
  user.set("email", userData.email);
  user.set("firstName", userData.firstName);
  user.set("lastName", userData.lastName);
  var promise = new Parse.Promise();
  user.signUp(null, {
    success: function(user) {
        promise.resolve("Sign Up successful");
    },
    error: function(user, error) {
      // Show the error message somewhere and let the user try again.
        promise.reject("Error: " + error.message);
    }
  });
  return promise;
}

var savePosting = function(postData, tableName, visible){
  //set up a promise to return
  var promise = new Parse.Promise();
  if (tableName == "Buyer" && postData.courseCode != "" && postData.title != "" && postData.price != ""){
    var Posting = Parse.Object.extend(tableName);
    var posting = new Posting();

    if (postData.edition != ""){
      posting.set("edition", Number(postData.edition));
    }
    posting.set("author",Parse.User.current());
    posting.set("courseCode", postData.courseCode);
    posting.set("title", postData.title);
    posting.set("price", Number(postData.price));
    posting.set("visibility", visible);//a saved post can only be seen by the user
    if(!visible){
      posting.setACL(new Parse.ACL(Parse.User.current()));
    }else{
      var myACL = new Parse.ACL(Parse.User.current());
      myACL.setPublicReadAccess(true);
      posting.setACL(myACL);
    }
    posting.save(null, {
      success: function(user) {
          promise.resolve("Save successful",user);
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
          promise.reject("Error: " + error.message);
      }
    });
  } else if (tableName == "Seller" && postData.courseCode != "" && postData.title != "" && postData.price != "" && postData.condition != "" && postData.edition != ""){
    var Posting = Parse.Object.extend(tableName);
    var posting = new Posting();

    if (postData.edition != ""){
      posting.set("edition", Number(postData.edition));
    }
    posting.set("author",Parse.User.current());
    posting.set("courseCode", postData.courseCode);
    posting.set("title", postData.title);
    posting.set("price", Number(postData.price));
    posting.set("condition", postData.condition);
    posting.set("visibility", visible);//a saved post can only be seen by the user
    if(!visible){
      posting.setACL(new Parse.ACL(Parse.User.current()));
    }else{
      var myACL = new Parse.ACL(Parse.User.current());
      myACL.setPublicReadAccess(true);
      posting.setACL(myACL);
    }
    posting.save(null, {
      success: function(user) {
          promise.resolve("Save successful",user);
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
          promise.reject("Error: " + error.message);
      }
    });
  }else{
    if (tableName == "Seller"){
      promise.reject("All fields are required.");
    } else{
      promise.reject("Course Code, Textbook Name and Looking Price are required.");
    }
  }
  return promise;
}

var pushToList = function (results){
	var outputList = [];
	for (var i = 0; i < results.length; i++)
	{
        var object = results[i].toJSON();
        inputList.push(object);
        //alert(object.objectId + ' - ' + object.title);
	return outputList;
    }
}

var getListOfUsernames = function(ListofUsers){
	var userList = [];
    for (var i = 0; i < ListofUsers.length; i++) {
		getUsernamesByID(ListofUsers[i]).then(function(results){
      userList.push(results);
    });
	}
	return userList;
}


var getUsernamesByID = function(userID){
  var query = new Parse.Query(Parse.User);
  var name = "";
  query.equalTo("objectId", userID);
  //set up a promise to return
  var promise = new Parse.Promise();
  query.get(userID, {
  success: function(result) {
      var userObject = result.toJSON();
      name = userObject.firstName + " " + userObject.lastName;
      promise.resolve(name);
  },
  error: function(object, error) {
    // The object was not retrieved successfully.
      promise.reject("Error: "+error.message);
  }
});
  return promise;
}

var saveMessageToParse = function(messageText, conversationID, receiverID){
  if ( messageText.trim() != ""){
  var currentUserID = Parse.User.current().id;
  var promise = new Parse.Promise();
  var Message = Parse.Object.extend("Messages");
  var message = new Message();
  message.set("ConversationID", conversationID);
  message.set("Sender", Parse.User.current());
  message.set("Message", messageText);
  var myACL = new Parse.ACL(Parse.User.current());
  myACL.setWriteAccess(currentUserID, true);
  myACL.setWriteAccess(receiverID, true);
  myACL.setPublicReadAccess(true);
  //console.log(message);

  message.save(null,(function(results) {
    // The save was successful.
  }, function(error) {
    // The save failed.  Error is an instance of Parse.Error.
  }));
}
    return true;
  
}

var getMessages = function(conversationID){
  var query = new Parse.Query("Messages");
  var name = "";
  query.equalTo("ConversationID", conversationID);
  //set up a promise to return
  var promise = new Parse.Promise();
  var messages = [];
  query.find().then(function(results) {
     
    for (var i = 0; i < results.length; i++) {
      var object = results[i].toJSON();
      messages.push(object);
     // console.log(messages);
    }
    promise.resolve(messages);
    //  console.log(conversations[0].user1.objectId);
    },function(error){
      //fires the error part in the .then() in the code calling this function
      promise.reject("Error: " + error.message);
    });
  return promise;
}

var getAllPostsByTitle = function(search, tableName){
  var queryTitle = new Parse.Query(tableName);
  queryTitle.matches("title", "("+search+")", "i");
  var queryCode = new Parse.Query(tableName);
  queryCode.matches("courseCode", "("+search+")", "i");
  var mainQuery = Parse.Query.or(queryCode,queryTitle);
  var promise = new Parse.Promise();
  var postings = [];
  mainQuery.find().then(function(results) {
     
    for (var i = 0; i < results.length; i++) {
      var object = results[i].toJSON();
      postings.push(object);
     // console.log(messages);
    }
    promise.resolve(postings);
    //  console.log(conversations[0].user1.objectId);
    },function(error){
      //fires the error part in the .then() in the code calling this function
      promise.reject("Error: " + error.message);
    });
  return promise;
}

var setVisibilityById = function(tableName,ID,visibility){
  // Create a pointer to an object of class tableName with id ID
  var Posting = Parse.Object.extend(tableName);
  var posting = new Posting();
  posting.id = ID;

  // Set a new value on quantity
  posting.set("visibility", visibility);
  if(!visibility){
    posting.setACL(new Parse.ACL(Parse.User.current()));
  }else{
    var myACL = new Parse.ACL(Parse.User.current());
    myACL.setPublicReadAccess(true);
    posting.setACL(myACL);
  }
  var promise = new Parse.Promise();
  // Save
  posting.save(null, {
    success: function(post) {
      promise.resolve("Save successful",post);
    },
    error: function(post, error) {
      // The save failed.
      promise.reject("Error: " + error.message);
    }
  });
  return promise;
}



