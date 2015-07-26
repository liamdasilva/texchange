angular.module('app.controllers')
//controls the edit entry page
.controller('EditEntryCtrl', ['$scope', '$ionicHistory','$ionicPopup','$stateParams','$state','dashboardEntries',function($scope, $ionicHistory,$ionicPopup,$stateParams,$state,dashboardEntries) {
  //go back to the dashboard if the page mode hasn't been initialized
  if (dashboardEntries.getIndex() == -1){
    $state.go('app.dashboard');
  }
  //create message popup function to use later
  $scope.showAlert = function(title,content) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: content,
      okType: 'button-energized'
    });
    alertPopup.then(function(res) {
      console.log(content);
    });
  };
  $scope.form={};
  $scope.mode = dashboardEntries.getTableName();
  var i = dashboardEntries.getIndex();
  if ($scope.mode == "Buyer"){
    $scope.posting = dashboardEntries.getBuying()[i];
    $scope.viewTitle = "Edit Buy";
  }else{
    $scope.posting = dashboardEntries.getSelling()[i];
    $scope.viewTitle = "Edit Sale";
    $scope.form.condition = $scope.posting.condition;
  }
  $scope.form.courseCode = $scope.posting.courseCode;
  $scope.form.title = $scope.posting.title;
  $scope.form.edition = $scope.posting.edition;
  $scope.form.price = $scope.posting.price;

  //validate and save a change the user has made
  $scope.save = function(){
    if ($scope.mode == "Seller"){$scope.posting.condition = $scope.form.condition;}
    var validation = validatePost($scope.form);
    if (validation == true){
      $scope.form.courseCode=$scope.form.courseCode.toUpperCase();
      $scope.posting.courseCode = $scope.form.courseCode;
      $scope.posting.title = $scope.form.title;
      $scope.posting.edition = $scope.form.edition;
      $scope.posting.price = $scope.form.price;
      updatePostingById($scope.mode,$stateParams.objectId,$scope.posting).then(function(result,object){
        $scope.showAlert("Success", result);
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.dashboard');
      },function(error){
        $scope.showAlert("Error", error);
      });
    }else{
      $scope.showAlert("Error",validation);
    }
  }
  //delete the post and go back to the dasboard
  $scope.delete = function(){
    deletePostingById($scope.mode,$stateParams.objectId).then(function(result){
      $scope.showAlert("Success", result);
      if ($scope.mode == "Buyer"){
        dashboardEntries.getBuying().splice(i,1);
      }else{
        dashboardEntries.getSelling().splice(i,1);
      }
      $scope.$apply();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.dashboard');
    },function(error){
      $scope.showAlert("Error", error);
    });
  }
  //toggle whether the post is visible to the public or not
  $scope.togglePublish = function(){
    if ($scope.mode == "Buyer"){
      setVisibilityById($scope.mode,$stateParams.objectId,!dashboardEntries.getBuying()[i].visibility).then(function(result){
        $scope.showAlert("Success", result);
        dashboardEntries.getBuying()[i].visibility = !dashboardEntries.getBuying()[i].visibility;
      },function(error){
        $scope.showAlert("Error", error);
      });
    }else{
      setVisibilityById($scope.mode,$stateParams.objectId,!dashboardEntries.getSelling()[i].visibility).then(function(result){
        $scope.showAlert("Success", result);
        dashboardEntries.getSelling()[i].visibility = !dashboardEntries.getSelling()[i].visibility;
      },function(error){
        $scope.showAlert("Error", error);
      });
    }
  }
}]);