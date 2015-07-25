angular.module('app.controllers')

.controller('DashboardCtrl', ['$scope','$location','$ionicLoading','dashboardEntries',function($scope,$location,$ionicLoading,dashboardEntries) {
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
  $scope.entries = {};
  var user = Parse.User.current();
  getPostings("Buyer",user).then(function(result){
    $scope.entries.buying = result;
    dashboardEntries.setBuying($scope.entries.buying);
  }, function(error){
    console.log(error);
  });
  getPostings("Seller",user).then(function(result){
    $scope.entries.selling = result;
    dashboardEntries.setSelling($scope.entries.selling);
    $ionicLoading.hide();
  }, function(error){
    console.log(error);
  });

  $scope.refresh = function(){
    $scope.entries = {};
    $scope.entries.buying = dashboardEntries.getBuying();
    $scope.entries.selling = dashboardEntries.getSelling();
    $scope.$broadcast("scroll.refreshComplete");
  }
  $scope.setMode = function(table,index){
    dashboardEntries.setIndex(index);
    dashboardEntries.setTableName(table);
  }
}]);