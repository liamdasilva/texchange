angular.module('app.services', [])

.service('conversationsService', function () {
  // Sends the conversations objects between controllers
  var user = Parse.User.current();
  var conversationsHistory = [];
  return {
    // returns all the conversations stored in this service.
    getConversations: function () {
      return conversationsHistory;
    },
    addConversation: function (inName, inUserID, inConversationID) {
      //adds a new conversation object to this service using our format for the object.
      var newConversationObject = {
          updatedAt: null,
          name: inName,
          userID: inUserID,
          id: inConversationID
        };
      conversationsHistory.push(newConversationObject);
    },
    setConversations: function (conversations) {
      // sets the conversation history given an array of conversation objects.
      conversationsHistory = conversations;
    },
    getConversation: function(ID) {
      // returns a conversation object from the history given the conversation ID
      result = null;
      conversationsHistory.forEach(function(conversation) {
        if (conversation.id === ID) result = conversation;
      })
      return result
    },
    getConversationID: function(userID) {
      // returns a conversation object given the id of the other user in this conversation/
      result = null;
      conversationsHistory.forEach(function(conversation) {
        if (conversation.userID === userID) result = conversation;
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