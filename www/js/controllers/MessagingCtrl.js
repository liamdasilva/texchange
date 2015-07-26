angular.module('app.controllers')

//handles the messaing subsystem
.controller('MessagingCtrl', ['$scope', '$stateParams','$state','$window', '$ionicScrollDelegate','$timeout','conversationsService','$interval',function($scope, $stateParams,$state, $window, $ionicScrollDelegate,$timeout, conversationsService,$interval) {
  var currentUser = Parse.User.current();
  if (!currentUser) { $state.go('app');}
    lastUpdated = new Date(); // sets lastUpdated to now
    // the conversation will update as soon as the messaging view is activated.
    $scope.conversations = conversationsService.getConversation(); // gets the conversations from the conversations service.
    $scope.conversationID = $stateParams.conversationID; // sets the conversation id for this specific conversation thread.
    // Mostly for debugging, if the conversationsService hasn't been set before reaching this view,
    // it MUST update to get the name, userID, and conversation id to be used by this system.
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
    //if the conversations service has been set, then use it.
    $scope.conversations = conversationsService.getConversation($scope.conversationID);
  }

  $scope.History = []; //list of messages objects, which contain the text of each message sent between users.
  $scope.sendMessage = function(){
    //ensures whitespace messages are not sent.
    if ($scope.Message.text.trim() != ""){
      //saves the messages to the server using the text, conversation id for this thread, and the other user id for 
      // permissions setting.
      saveMessageToParse($scope.Message.text, $scope.conversationID, $scope.conversations.userID).then(function(result){
        //adds the new messages to the history.
        $scope.History.push(result);
        // applys changes to the history list to the view.
        $scope.$apply();
        //scroll to the bottom of the view to see the new message.
        $scope.scrollToBottom();
      }, function(error){
        alert(error);
      });
    }
    // once the message has been sent, reset the message text to empty string.
    $scope.Message.text = "";
  }

  $scope.Message = ""; // initialize the message object, set to null.
  $scope.Messaging = Parse.User.current().id; // initialize the message object, set to null.

  $scope.Message.text = ""; // set the text to empty string
  getMessages($scope.conversationID).then(function(result){
    // get all messages associated with this conversation id and that will be used
    // as a history of the conversation.
    $scope.History = result;
    $scope.noHistory = $scope.History.length == 0;
    //scroll to the bottom of the page and start updating messages on interval. Since messages have been updated
    //from the server, update the lastUpdated time.
    $scope.scrollToBottom();
    lastUpdated = new Date();
    lastUpdated.setSeconds(lastUpdated.getSeconds() + 2);
    $scope.update();

  }, function(error){
   alert(error);
 });
  var stop; // create the interval variable.
  // For our messages to update automatically, we have to poll the server for new messages.
  // Our policy decision was to do so every 5 seconds.
  $scope.update = function() {
    // Don't start updating if we are already updating
    if ( angular.isDefined(stop) ) return;
    //starts the interval if it has not already been defined.
    stop = $interval(function() {
      //calls the function which updates the message.
     updateMessages($scope.conversationID, lastUpdated, $scope.conversations.userID).then(function(result){
      //updates lastUpdated since messages have been updated.
      lastUpdated = new Date();
      lastUpdated.setSeconds(lastUpdated.getSeconds() + 2);
      //Adds all the new messages to our history list.
      $scope.History =  $scope.History.concat(result); 
      $scope.$broadcast('scroll.refreshComplete');
      // apply the changes to the view and go to the bottom.
      $scope.$apply();
      $scope.scrollToBottom();
    });       
   }, 5000);
  };

  $scope.stopUpdate = function() {
    //when the view is left, the will destroy the interval, so that the system won't continue querying the server.
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
    // scrolls to the bottom of the page. Timeout is used since the DOM isn't fully loaded when the function is called.
    $timeout(function() {
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
    }, 0);
  };
}]);