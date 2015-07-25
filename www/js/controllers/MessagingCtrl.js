angular.module('app.controllers')

.controller('MessagingCtrl', ['$scope', '$stateParams','$state','$window', '$ionicScrollDelegate','$timeout','conversationsService','$interval',function($scope, $stateParams,$state, $window, $ionicScrollDelegate,$timeout, conversationsService,$interval) {
  lastUpdated = new Date();
  $scope.conversations = conversationsService.getConversation();
  $scope.conversationID = $stateParams.conversationID;

  if (conversationsService.getConversations().length == 0){
    getConversations().then(function(result){
     $scope.conversations = getOtherConversationUser(result);
     conversationsService.setConversations($scope.conversations);
     $scope.conversations = conversationsService.getConversation($scope.conversationID);
     console.log($scope.conversations);
     $scope.$apply();

   }, function(error){
    alert(error);
  });
  }else{
    $scope.conversations = conversationsService.getConversation($scope.conversationID);
  }

  $scope.History = [];
  $scope.sendMessage = function(){
    if ($scope.Message.text.trim() != ""){
      saveMessageToParse($scope.Message.text, $scope.conversationID, $scope.conversations.userID).then(function(result){
        lastUpdated = new Date();
        $scope.History.push(result);
        $scope.$apply();
        $scope.scrollToBottom();

      }, function(error){
        alert(error);
      });
    }
    $scope.Message.text = "";
  }

  $scope.Messaging = Parse.User.current().id;
  $scope.Message = "";
  $scope.Message.text = "";
  var user = Parse.User.current();
  getMessages($scope.conversationID).then(function(result){
    $scope.History = result;
    $scope.noHistory = $scope.History.length == 0;
    $scope.scrollToBottom();
    lastUpdated = new Date();
    $scope.update();

  }, function(error){
   alert(error);
 });
  var stop;
  $scope.update = function() {
    // Don't start updating if we are already updating
    if ( angular.isDefined(stop) ) return;
    stop = $interval(function() {
     updateMessages($scope.conversationID, lastUpdated, $scope.conversations.userID).then(function(result){
      lastUpdated = new Date();
      $scope.History =  $scope.History.concat(result); 
      $scope.$apply();
      $scope.scrollToBottom();
    });       
   }, 5000);
  };

  $scope.stopUpdate = function() {
    if (angular.isDefined(stop)) {
      $interval.cancel(stop);
      stop = undefined;
    }
  };

  $scope.$on('$destroy', function() {
    // Make sure that the interval is destroyed too
    $scope.stopUpdate();
  });

  $scope.scrollToBottom = function() {
    $timeout(function() {
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
    }, 0);
  };
}]);