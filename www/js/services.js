angular.module('app.services', [])

.service('dashboardEntries', function () {
  //initialize index at -1 for error checking in single entry controller
  var index = -1;
  var tableName = "";
  var entries = {
    buying: [],
    selling: []
  }
  //load dashboard entries on service intialization only if user is logged in
  if(Parse.User.current()){
    var user = Parse.User.current();
    getPostings("Buyer",user).then(function(result){
      entries.buying = result;
    }, function(error){
      console.log(error);
    });
    getPostings("Seller",user).then(function(result){
      entries.selling = result;
      //alert("Service - Dashboard reloaded");     
    }, function(error){
      console.log(error);
    });
  }
  
  return {
      getBuying: function(value) {
          return entries.buying;
      },
      setBuying: function(value) {
        entries.buying = value;
      },
      getSelling: function(value) {
          return entries.selling;
      },
      setSelling: function(value) {
          entries.selling = value;
      },
      getIndex: function(){
        return index;
      },
      setIndex: function(value){
        index = value;
      },
      getTableName: function(){
        return tableName;
      },
      setTableName: function(value){
        tableName = value;
      }
  };
})

.service('conversationsService', [function(conversationsService) {
  var conversations = [];
  function set(data) {
  conversations = data;
 }
 function get() {
  return conversations;
 }
 function getConversation(id) {
      console.log(conversations);
      var result ;
      conversations.forEach(function(conversation) {
     // console.log(id + "1");
      //console.log(conversation );

        if (conversation.id === id){
          result=conversation;
          }
         })
  return result;
}
 return {
  set: set,
  get: get,
  getConversation: getConversation
 }
}])

.service('viewPosting', function () {
  //initialize index at -1 for error checking in single entry controller
  var tableName = "";
  var entry = {};
  return {
      getPosting: function(value) {
          return entry;
      },
      setPosting: function(value) {
        entry = value;
      },
      getTableName: function(){
        return tableName;
      },
      setTableName: function(value){
        tableName = value;
      }
  };
})