angular.module('app.services', [])

.service('conversationsService', function () {
  var user = Parse.User.current();
  var conversationsHistory = [];
  return {
    getConversations: function () {
      return conversationsHistory;
    },
    setConversations: function (conversations) {
      conversationsHistory = conversations;
    },
    getConversation: function(ID) {
      result = null;
      conversationsHistory.forEach(function(conversation) {
        if (conversation.id === ID) result = conversation;
      })
      return result
    }
  };
})


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