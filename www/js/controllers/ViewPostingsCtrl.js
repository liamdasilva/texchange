angular.module('app.controllers')
//controls the view posting page - where you can view all of one persons posts
.controller('ViewPostingsCtrl', ['$scope','$ionicLoading', '$stateParams','$state','viewPosting','conversationsService',function($scope,$ionicLoading, $stateParams,$state,viewPosting,conversationsService) {
   $scope.conversations = [];
   if (conversationsService.getConversations().length ==0){
    console.log("here");
    getConversations().then(function(result){
     $scope.conversations = getOtherConversationUser(result);
     conversationsService.setConversations($scope.conversations);
     noConversations = $scope.conversations.length == 0;
     $scope.$apply();
     console.log($scope.conversations);
   }, function(error){
    alert(error);
  });
  } else{
    $scope.conversations = conversationsService.getConversation();
      console.log($scope.conversations);
  }

  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
  $scope.pageId = $stateParams.objectId;
  $scope.posting = viewPosting.getPosting();
  $scope.author = $scope.posting.author;
  $scope.mode = viewPosting.getTableName();
  $scope.entries = {};
  getPostings("Buyer",$scope.posting.parseAuthor).then(function(result){
    $scope.entries.buying = result;
    $scope.entries.buying = $scope.entries.buying.filter(function(el){
      return el.objectId != $scope.pageId;
    });

  }, function(error){
    console.log(error);
  });
  getPostings("Seller",$scope.posting.parseAuthor).then(function(result){
    $scope.entries.selling = result;
    $scope.entries.selling = $scope.entries.selling.filter(function(el){
      return el.objectId != $scope.pageId;
    });
    $ionicLoading.hide();
  }, function(error){
    console.log(error);
  });
   $scope.startConversation = function(){
    //console.log($scope.author);
    var conversationID = conversationsService.getConversationID($scope.author.objectId);
   // console.log(conversationID.id);
    if (conversationID == null){
      createConversation($scope.posting.parseAuthor).then(function(result){
        conversationID = result;
        name = $scope.author.firstName +" "+ $scope.author.lastName;
        userID=  $scope.author.objectId;
        id = result.objectId;
        conversationsService.addConversation(name, userID, id);
       // console.log(conversationID);
        $state.go('app.messaging', {conversationID: conversationID.objectId });
      })
    }
    else{  
      console.log(conversationID);
      $state.go('app.messaging', {conversationID: conversationID.id} );
  };
}

$scope.refresh = function(){
  $scope.entries = {};
  $scope.entries.buying = dashboardEntries.getBuying();
  $scope.entries.selling = dashboardEntries.getSelling();
  $scope.$broadcast("scroll.refreshComplete");
}

}]);