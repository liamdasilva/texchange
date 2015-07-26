angular.module('app.controllers')
//manages the conversations page, getting all conversations upon loading the page
.controller('ConversationsCtrl', ['$scope','conversationsService',function($scope, conversationsService) {
  $scope.conversations = {};
  //get conversations of user
  getConversations().then(function(result){
     $scope.conversations = getOtherConversationUser(result);
     conversationsService.setConversations($scope.conversations);
     noConversations = $scope.conversations.length == 0;
          $scope.$apply();

   }, function(error){
    alert(error);
  });
  //reload the page if the user clicks pulls to refresh
  $scope.refresh = function(){
    getConversations().then(function(result){
       $scope.conversations = getOtherConversationUser(result);
       conversationsService.setConversations($scope.conversations);
       noConversations = $scope.conversations.length == 0;
       $scope.$broadcast("scroll.refreshComplete");
     }, function(error){
      alert(error);
    });
  }
}]);