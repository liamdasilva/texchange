angular.module('app.controllers', [])

.controller('NewBuyPostingCtrl', ['$scope', '$state',function($scope,$state) {
  $scope.posting = {};
  $scope.posting.courseCode = "";
  $scope.posting.price = "";
  $scope.posting.edition = "";
  $scope.posting.tName = "";

  $scope.save = function(){
    savePosting($scope.posting,"Buyer", false).then(
      function(result){
      alert("Save successful");
      $scope.posting.courseCode = "";
      $scope.posting.price = "";
      $scope.posting.edition = "";
      $scope.posting.tName = "";
      $state.go('app.dashboard')

    }, function(error){
      alert(error);
    });
  }

  $scope.post = function(){
    //save buy posting with visibility as true
    savePosting($scope.posting,"Buyer", true).then(
      function(result){
      alert("Post successful");
      $scope.posting.courseCode = "";
      $scope.posting.price = "";
      $scope.posting.edition = "";
      $scope.posting.tName = "";
      $state.go('app.dashboard')

    }, function(error){
      alert(error);
    });
  }
}]);