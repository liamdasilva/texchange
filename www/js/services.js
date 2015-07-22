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