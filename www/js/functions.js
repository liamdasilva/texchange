var getPostings = function(tableName,user){
  var query = new Parse.Query(tableName);
  query.equalTo("author",user);
  var postings = [];
  query.find({
    success: function(results) {
      //alert("Successfully retrieved " + results.length + " buy posts.");
      // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {
        var object = results[i].toJSON();
        postings.push(object);
        //alert(object.objectId + ' - ' + object.title);
      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
  return postings;
}
  