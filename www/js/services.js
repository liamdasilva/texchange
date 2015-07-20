/*angular.module('app.service', [])

.factory('ConversationsService', function($q) {
  return {
    conversations: [getConversations(Parse.User.current())]
    ,
    getConversations: function() {
      return this.conversations
    },
    getConversation: function(conversationID) {
      var dfd = $q.defer()
      this.conversations.forEach(function(conversation) {
        if (conversation.conversationID === conversationID) dfd.resolve(conversation)
      })
      return dfd.promise
    }

  }
})*/