angular.module('app.controllers')

.controller('ConversationsCtrl', ['$scope','conversationsService',function($scope, conversationsService) {
  $scope.conversations = {};
  getConversations().then(function(result){
     $scope.conversations = getOtherConversationUser(result);
     conversationsService.setConversations($scope.conversations);
     noConversations = $scope.conversations.length == 0;
     $scope.$apply();
   }, function(error){
    alert(error);
  });
   $scope.refresh = function(){
    $window.location.reload();
  }
}]);