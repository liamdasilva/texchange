angular.module('app.controllers')

.controller('SingleEntryCtrl', ['$scope', '$stateParams','$state','dashboardEntries','viewPosting',function($scope, $stateParams,$state,dashboardEntries,viewPosting) {
  if (dashboardEntries.getIndex() == -1){
    $state.go('app.dashboard');
  }
  $scope.mode = dashboardEntries.getTableName();
  //console.log($scope.mode);
  var i = dashboardEntries.getIndex();
  if ($scope.mode == "Buyer"){
    $scope.posting = dashboardEntries.getBuying()[i];
    $scope.viewTitle = "You're Buying";
  }else{
    $scope.posting = dashboardEntries.getSelling()[i];
    $scope.viewTitle = "You're Selling";
  }
  $scope.objectId = $stateParams.objectId;
  if ($scope.mode == "Seller"){
    getPostingsByCourseCode("Buyer",$scope.posting.courseCode).then(function(result){
      $scope.buyers = result;
    }, function(error){
      console.log(error);
    });
  }else if ($scope.mode == "Buyer"){
    getPostingsByCourseCode("Seller",$scope.posting.courseCode).then(function(result){
      $scope.sellers = result;
    }, function(error){
      console.log(error);
    });
  }

  $scope.sendPost = function(index){
    viewPosting.setPosting($scope.buyers[index]);
    if($scope.mode == "Buyer")
      viewPosting.setTableName("Seller");
    else{
      viewPosting.setTableName("Buyer");
    }
  }
}]);