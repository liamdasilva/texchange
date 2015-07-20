var getPostings = function(tableName,user){
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
  posting.set("title", postData.tName);
  posting.set("price", Number(postData.price));
  posting.set("edition", Number(postData.edition));
  posting.set("visibility", postData.visibility);//a saved post can only be seen by the user
  var promise = new Parse.Promise();
  // Save
  posting.save(null, {
    success: function(post) {
      promise.resolve("Save successful");
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
      promise.resolve("Delete successful");
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
  if (tableName == "Buyer" && postData.courseCode != "" && postData.tName != "" && postData.price != ""){
    var Posting = Parse.Object.extend(tableName);
    var posting = new Posting();

    if (postData.edition != ""){
      posting.set("edition", Number(postData.edition));
    }
    posting.set("author",Parse.User.current());
    posting.set("courseCode", postData.courseCode);
    posting.set("title", postData.tName);
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
          promise.resolve("Save successful");
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
          promise.reject("Error: " + error.message);
      }
    });
  } else if (tableName == "Seller" && postData.courseCode != "" && postData.tName != "" && postData.price != "" && postData.condition != "" && postData.edition != ""){
    var Posting = Parse.Object.extend(tableName);
    var posting = new Posting();

    if (postData.edition != ""){
      posting.set("edition", Number(postData.edition));
    }
    posting.set("author",Parse.User.current());
    posting.set("courseCode", postData.courseCode);
    posting.set("title", postData.tName);
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
          promise.resolve("Save successful");
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
/* var getConversations = function(user){
  var query = new Parse.Query("Conversations");
  query.equalTo("User1",user);
  var conversations = [];
  query.find({
    success: function(results) {
      //alert("Successfully retrieved " + results.length + " buy posts.");
      // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {
        var object = results[i].toJSON();
        conversations.push(object);
        //alert(object.objectId + ' - ' + object.title);
      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
  query.equalTo("User2",user);
   query.find({
    success: function(results) {
      //alert("Successfully retrieved " + results.length + " buy posts.");
      // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {
        var object = results[i].toJSON();
        conversations.push(object);
        //alert(object.objectId + ' - ' + object.title);
      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
  var conversations_list = []
  return conversations;
}
 */
/* var getConversations = function(user){
//console.log(user);
  var query = new Parse.Query("Conversations");
  query.equalTo("User1",user);
  query.include("User1");
  var conversations = [];
  query.find({
    success: function(results) {
      //alert("Successfully retrieved " + results.length + " buy posts.");
      // Do something with the returned Parse.Object values.
      for (var i = 0; i < results.length; i++) {
        var convoObject = results[i].toJSON();
	//	convoObject.get(i).getParseObject("User1").getString("username");
        conversations.push(convoObject);
		var username = new Parse.Query ("_User");
		username.get(convoObject.User1);
		//console.log(username.get(convoObject.User1).getString("username"));
        //alert(object.objectId + ' - ' + object.title);
      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
  query.equalTo("User2",user);
   query.find({
    success: function(results) {
      //alert("Successfully retrieved " + results.length + " buy posts.");
      // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {
        var object = results[i].toJSON();
        conversations.push(object);
        //alert(object.objectId + ' - ' + object.title);
      }

    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
  var usernameQuery = new Parse.Query("User");
  console.log(conversations.length);
  usernameQuery.equalTo("objectId",conversations[0].id);
  var usernameList = [];
  usernameQuery.find({
    success: function(results) {
      //alert("Successfully retrieved " + results.length + " buy posts.");
      //Do something with the returned Parse.Object values
	  //console.log(results.length);
      for (var i = 0; i < results.length; i++) {
        var object = results[i].toJSON();
        usernameList.push(object);
		    console.log(object.username);
        //alert(object.objectId + ' - ' + object.title);
      }

    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
  var conversations_list = []
  return conversations;
}
 */
var getConversations = function(user){
  console.log("bby please");
  var query = new Parse.Query("Conversations");
  var conversations = [];
  //set up a promise to return
  var promise = new Parse.Promise();
  query.find().then(function(results) {
     
      for (var i = 0; i < results.length; i++) {
        var object = results[i].toJSON();

       if ( object.user1.objectId ===user.id ){
          conversations.push(object.objectId, object.user2.objectId);//.then(
       }
       else {
          conversations.push(object.id,object.user1.objectId);
       }
   }
      promise.resolve(conversations);
    //  console.log(conversations[0].user1.objectId);
    },function(error){
      //fires the error part in the .then() in the code calling this function
      promise.reject("Error: " + error.message);
    });
  return promise;
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
  message.set("ConversationID", "nncQEfm6JY");
  message.set("Sender", Parse.User.current());
  message.set("Message", messageText);
  var myACL = new Parse.ACL(Parse.User.current());
  myACL.setWriteAccess(currentUserID, true);
  myACL.setWriteAccess(receiverID, true);
  myACL.setPublicReadAccess(true);
  //console.log(message);

  message.save(null,(function(results) {
    console.log("why");
    // The save was successful.
  }, function(error) {
    // The save failed.  Error is an instance of Parse.Error.
  }));
    return promise;
  }
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

var getUsernameByConversationID = function(conversationID){
  var query = new Parse.Query("Conversations");
  var name = "";
  query.equalTo("objectId", conversationID);
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

