angular.module('app.controllers')

.controller('NewPostingCtrl', ['$scope','$state','$ionicPopup','dashboardEntries',function($scope,$state,$ionicPopup,dashboardEntries) {
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
  //console.log($scope.mode);

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