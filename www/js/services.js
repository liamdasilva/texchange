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
  var user = Parse.User.current();
  var entries = {
    buying: [],
    noBuyPostings: true,
    selling: [],
    noSellPostings: true
  };
  var index = 0;
  var tableName = "";
  getPostings("Buyer",user).then(function(result){
    entries.buying = result;
    entries.noBuyPostings = result.length == 0;
  }, function(error){
    console.log("dashboardEntries service error: " + error);
  });
  getPostings("Seller",user).then(function(result){
    entries.selling = result;
    entries.noSellPostings = result.length == 0;
  }, function(error){
    console.log("dashboardEntries service error: " + error);
  });

  return {
    getEntries: function () {
      return entries;
    },
    setBuying: function(value) {
      entries.buying = value;
      entries.noBuyPostings = value.length ==0;
    },
    setSelling: function(value) {
      entries.selling = value;
      entries.noSellPostings = value.length == 0;
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

