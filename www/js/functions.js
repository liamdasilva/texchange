var getPostings = function(tableName, user){
  /* getPostings gets all postings from our Parse server.
  Each table has a name. User would be a user object. 
  This function is expected to be given "Buyer" or "Seller" as a 
  tablename and the logged in user's Parse object and lets you get all buy and sell
  postings for a user.
  */
  var query = new Parse.Query(tableName); //create the query object
  query.equalTo("author",user); // set the user for whom the query is going to query for.
  var postings = []; // create an empty postings list
  //set up a promise to return, so the function can manage asyncynchronous calls.
  var promise = new Parse.Promise();
  query.find().then(function(results) {
      //alert("Successfully retrieved " + results.length + " buy posts.");
      // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {
        var object = results[i].toJSON(); //converts a Parse objec to a JSON for each access and viewing.
        postings.push(object);  // pushes the converted object onto the postings list.
      }
      //fires the .then() in the code calling this function
      promise.resolve(postings); 
    },function(error){
      //fires the error part in the .then() in the code calling this function
      promise.reject("Error: " + error.message);
    });
  return promise; // when the call completes, this returns the postings
}

//returns a list of Parse objects containing sell posts and authors
var getPostingsByCourseCode = function(tableName, courseCode){
    /* getPostingsByCourseCode gets all postings from our Parse server.
  Each table has a name. courseCode would be a course code string. 
  This function is expected to be given "Buyer" or "Seller" as a 
  tablename and the logged in user's Parse object and lets you get all buy and sell
  postings for a given course code.
  */
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
      object.parseAuthor = results[i].get("author");
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
  //this converts the list of Parse object containing user1 and user2 to a list of JSON objects
  // to be used for the conversations and messaging subsystem. It only uses the relevant information
  // which is the Parse User id, the conversation id, and their name (first name + last name)
  //Parse object attributes are extracted using the .get command on each object.
  var newList = [];
  var user, user1;
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
      /* getPostingByID gets a posting object from our Parse server.
  Each table has a name. id would be a object id associated with each posting. 
  This function is expected to be given "Buyer" or "Seller" as a 
  tablename and object id and lets you get the posting detail for that id. 
  */
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
  // Based on a unique object id associated with a posting, it updates the
  // posting detail with given posting date.
  var Posting = Parse.Object.extend(tableName);
  var posting = new Posting();
  posting.id = ID;
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
  // delete a posting object in the Parse database given a posting id.
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
  //saves a posting to Parse, given its data and whether it is a
  //buying or selling post. Users have the option of saving or publishing their post.
  //If the user selects to save a posting, it will only be visible to them.
  //If a user selects to publish a posting, it will be visible to all users.
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
    if (tableName == "Seller"){ // Posting date requirements must be satisfied to post.
      promise.reject("All fields are required.");
    } else{
      promise.reject("Course Code, Textbook Name and Looking Price are required.");
    }
  }
  return promise;
}

var pushToList = function (results){
  //converts a list of object toJSON and return the new list.
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
      // gets a list of of usersname based on their on their objectID
     var userList = [];
     for (var i = 0; i < ListofUsers.length; i++) {
      getUsernamesByID(ListofUsers[i]).then(function(results){
        userList.push(results);
      });
    }
    return userList;
  }


  var getUsernamesByID = function(userID){
    //gets  a username based on their user object id.
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
  // When a message is sent by a user, each individual message is saved to the server.
  // Each message has associated text, is associated with a conversation id, and records 
  // of the message.
  // Permissions are also set so that only the sender and receiver of each object
  // will be able to read or write a message within a each conversation.
  var currentUser = Parse.User.current();
  var promise = new Parse.Promise();
  var Message = Parse.Object.extend("Messages");
  var message = new Message();

  message.set("ConversationID", conversationID);
  message.set("Sender", currentUser);
 message.set("Message", messageText);

 var myACL = new Parse.ACL();
 myACL.setWriteAccess(currentUser, true);
 myACL.setWriteAccess(receiverID, true);
 myACL.setReadAccess(currentUser, true);
 myACL.setReadAccess(receiverID, true);  
 message.setACL(myACL);

 message.save(null,{
  success: (function(results) {
    promise.resolve(results.toJSON());

   }),
  error: (function(error) {
    console.log(error);
    // error is a Parse.Error with an error code and message.
  })
})
  //console.log(message.toJSON());
  return promise;
  
}

var getMessages = function(conversationID){
  // Gets a list of messages objects for a conversation and sorts is in the order it was created with
  // the oldest messages listed first.
  var query = new Parse.Query("Messages");
  var name = "";
  query.equalTo("ConversationID", conversationID);
  query.ascending("createdAt");
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
  // gets all postings that start with the given title or course code.
  // Utilized by the search system.
  // Does not return a post if the it belongs to the current user.
  var queryTitle = new Parse.Query(tableName);
  queryTitle.matches("title", "("+search+")", "i");
  var queryCode = new Parse.Query(tableName);
  queryCode.matches("courseCode", "("+search+")", "i");
  var mainQuery = Parse.Query.or(queryCode,queryTitle);
  mainQuery.include("author");
  var promise = new Parse.Promise();
  var postings = [];
  var user = Parse.User.current();
  mainQuery.notEqualTo("author", user);
  mainQuery.find().then(function(results) {
    for (var i = 0; i < results.length; i++) {
      var object = results[i].toJSON();
      object.author = results[i].get("author").toJSON();
      object.parseAuthor = results[i].get("author");

      postings.push(object);
   }
   promise.resolve(postings);
  },function(error){
      //fires the error part in the .then() in the code calling this function
      promise.reject("Error: " + error.message);
    });
  return promise;
}

var setVisibilityById = function(tableName,ID,visibility){
  // Create a pointer to an object of class tableName with id ID
  // Changes the visibility of a posting object if a user decides to publish
  // or unpublish a saved post.
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
      if (visibility){
        promise.resolve("Published successfully.",post);
      }else{
        promise.resolve("Unpublished successfully.",post);
      }
    },
    error: function(post, error) {
      // The save failed.
      promise.reject("Error: " + error.message);
    }
  });
  return promise;
}

var updateMessages = function(conversationID, lastUpdated, otherUserID){
  // Updates messages that were sent to this user in this conversation thread.
  // The function only gets messages that are sent after the conversation was
  // last updated.
 var query = new Parse.Query("Messages");
 query.equalTo("ConversationID", conversationID);
  query.ascending("createdAt");
  //set up a promise to return
  var promise = new Parse.Promise();
  var updatedHistory =[];
  query.greaterThan("createdAt",lastUpdated)
  query.find().then(function(results) {
    for (var i = 0; i < results.length; i++) {
      var object = results[i].toJSON();
      updatedHistory.push(object);
   }
   promise.resolve(updatedHistory);
  },function(error){
      //fires the error part in the .then() in the code calling this function
      promise.reject("Error: " + error.message);
    });
  return promise;
}

var createConversation = function(otherUser){
  // When you choose to send a message to a user you have never messaged before,
  // it creates a conversation thread object.
  // This is used to store who is involved in a conversation, as well as the name 
  // of the other user to display.
  var currentUser = Parse.User.current();
  var promise = new Parse.Promise();
  var Conversation = Parse.Object.extend("Conversations");
  var conversation = new Conversation();

  conversation.set("user1", currentUser);
  conversation.set("user2", otherUser);
  conversation.set("visibleToUser1", true);
  conversation.set("visibleToUser2", true);

  var myACL = new Parse.ACL();
  myACL.setWriteAccess(currentUser, true);
  myACL.setWriteAccess(otherUser, true);
  myACL.setReadAccess(currentUser, true);
  myACL.setReadAccess(otherUser, true);  
  conversation.setACL(myACL);

  conversation.save(null,{
    success: (function(results) {
      promise.resolve(results.toJSON());
    
   }),
    error: (function(error) {
      alert(error);
    // error is a Parse.Error with an error code and message.
  })
  })
  return promise;
}

function validateUser(user){
  // Ensures the user data inputted for signup is valid with respect to characters used and length.
  var ck_firstName = /^[A-Za-z0-9 ]{2,20}$/;
  var ck_lastName = /^[A-Za-z0-9 ]{2,30}$/;
  var ck_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i 
  var ck_username = /^[A-Za-z0-9_]{1,20}$/;
  var ck_password =  /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;
  var errors = [];

  if (!ck_firstName.test(user.firstName)) {
    errors[errors.length] = "Invalid First Name.";
  }
  if (!ck_lastName.test(user.lastName)) {
    errors[errors.length] = "Invalid Last Name.";
  }
  if (!ck_email.test(user.email)) {
    errors[errors.length] = "Invalid email address.";
  }
  if (!ck_username.test(user.username)) {
    errors[errors.length] = "Invalid username.";
  }
  if (!ck_password.test(user.password)) {
    errors[errors.length] = "Password must be at least 6 characters.";
  }
  if (errors.length > 0) {
    return reportErrors(errors);
  }
  return true;
}

var validatePost = function(post){
    // Ensures the post data inputted for signup is valid with respect to characters used, length, and format.

  var ck_courseCode = /^[A-Za-z]{2}[1-4]{1}[0-9]{2}$/;
  
  var errors = [];
  if (!ck_courseCode.test(post.courseCode)) {
    errors[errors.length] = "Invalid course code.";
  }
  if (post.title.length <4) {
    errors[errors.length] = "Invalid title.";
  }
  if (post.price.length ==0 || isNaN(post.price)) {
    errors[errors.length] = "Invalid price.";
  }
  if (post.edition.length ==0||isNaN(post.edition)||post.edition <=0||post.edition >99) {
    errors[errors.length] = "Invalid edition.";
  }

  if (errors.length > 0) {
    return reportErrors(errors);
  }
  return true;
}

function reportErrors(errors){
// creates a friendly message that shows the error messages.
 var msg = "Please Enter Valid Data:\n";
 for (var i = 0; i<errors.length; i++) {
   var numError = i + 1;
   msg += "\n" + numError + ". " + errors[i];
 }
 return(msg);
}

String.prototype.capitalizeFirstLetter = function() {
  // capitalizes the first letter.
  return this.charAt(0).toUpperCase() + this.slice(1);
}
