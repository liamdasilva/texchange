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
    promise.reject("Please leave nothing empty!");
  }
  return promise;
}