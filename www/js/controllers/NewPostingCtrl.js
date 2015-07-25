angular.module('app.controllers')
//controls the new posting page
.controller('NewPostingCtrl', ['$scope','$state','$ionicPopup','dashboardEntries',function($scope,$state,$ionicPopup,dashboardEntries) {
  //creates the message popup function to be used later
  $scope.showAlert = function(title,content) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: content,
      type: 'button-energized'
    });
    alertPopup.then(function(res) {
      console.log(content);
    });
  };
  $scope.posting = {};
  $scope.posting.courseCode = "";
  $scope.posting.price = "";
  $scope.posting.edition = "";
  $scope.posting.title = "";
  $scope.posting.condition = "Good";
  $scope.mode = dashboardEntries.getTableName();

  //validate and save the new post for later
  $scope.save = function(){
    var validation = validatePost($scope.posting);
    if (validation == true){
      $scope.posting.courseCode = $scope.posting.courseCode.toUpperCase();
      savePosting($scope.posting,$scope.mode, false).then(function(result,object){
        $scope.showAlert("Success", "Save Successful");
        afterSave(object);
      }, function(error){
        alert(error);
      });
    }else{
      $scope.showAlert("Error", validation);
    }
  }
  //validate and post the new post to the public
  $scope.post = function(){
    //save buy posting with visibility as true
    var validation = validatePost($scope.posting);
    if (validation == true){
      $scope.posting.courseCode = $scope.posting.courseCode.toUpperCase();
      savePosting($scope.posting,$scope.mode, true).then(function(result,object){
        $scope.showAlert("Success", "Post Successful");
        afterSave(object);
      }, function(error){
        alert(error);
      });
    }else{
      $scope.showAlert("Error", validation);
    }
  }
  //used by post and save to carry out common tasks
  //updates the dashboardEntries service so the dashboard is updated, and clears the fields
  var afterSave = function(object){
    //update the dashboard list of sell posts
    if ($scope.mode == "Buyer"){
      dashboardEntries.getBuying().push(object.toJSON());
    }else if ($scope.mode == "Seller"){
      dashboardEntries.getSelling().push(object.toJSON());
    }
    //reset the form before leaving
    $scope.posting.courseCode = "";
    $scope.posting.price = "";
    $scope.posting.edition = "";
    $scope.posting.title = "";
    $scope.posting.condition = "Good";
    $state.go('app.dashboard');
  }
}]);