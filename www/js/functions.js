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

//this returns a Parse object containing user1 and user2
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
  var user, user1;
    if(Parse.User.current()){
    for (var i = 0; i < conversations.length; i++) {
      conversation = conversations[i];
      var convo = {};
      convo.updatedAt = conversation.get("updatedAt");
      if(Parse.User.current().get("username") == conversation.get("user1").get("username")){
        convo.name = conversation.get("user2").get("firstName");

      }else{
        convo.name = conversation.get("user1").get("firstName");
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