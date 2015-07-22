<<<<<<< HEAD
/*angular.module('app.controllers','app.services' [])

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
*/
=======
angular.module('app.services', [])

.service('dashboardEntries', function () {
  var user = Parse.User.current();
  var entries = {
    buying: [],
    noBuyPostings: true,
    selling: [],
    noSellPostings: true
  };
  var index = 0;
  getPostings("Buyer",user).then(function(result){
    entries.buying = result;
    entries.noBuyPostings = result.length == 0;
  }, function(error){
    console.log("dashboardEntries service error: "+error);
  });
  getPostings("Seller",user).then(function(result){
    entries.selling = result;
    entries.noSellPostings = result.length == 0;
  }, function(error){
    console.log("dashboardEntries service error: "+error);
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
      }
  };
})
>>>>>>> 75670188cab94cb35baa2c61a09941f92ecbc812
