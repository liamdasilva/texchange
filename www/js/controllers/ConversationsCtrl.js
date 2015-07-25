angular.module('app.controllers')

//handles the conversation system
.controller('ConversationsCtrl', ['$scope','conversationsService',function($scope, conversationsService) {
  // creates an empty list of conversation object
  $scope.conversations = {};
  // gets the list of conversations from server
  getConversations().then(function(result){
    // converts the list of conversation servers to JSON and formats it for viewing.
     $scope.conversations = getOtherConversationUser(result);
     // sets the conversation service so it can be used by other systems.
     conversationsService.setConversations($scope.conversations);
     // if there are no conversations on the server, show no conversations in the view.
     noConversations = $scope.conversations.length == 0;
     //update the view for new conversations.
     $scope.$apply();
   }, function(error){
    alert(error);
  });
  //refreshes the page when doing pull to refresh.
   $scope.refresh = function(){
    $window.location.reload();
  }
}]);