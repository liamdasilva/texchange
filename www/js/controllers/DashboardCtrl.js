angular.module('app.controllers')
//controls the dashboard functionality
.controller('DashboardCtrl', ['$scope','$location','$ionicLoading','dashboardEntries',function($scope,$location,$ionicLoading,dashboardEntries) {
  //show loading icon upon load start
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
  $scope.entries = {};
  var user = Parse.User.current();
  //get current users buy posts
  getPostings("Buyer",user).then(function(result){
    $scope.entries.buying = result;
    dashboardEntries.setBuying($scope.entries.buying);
  }, function(error){
    console.log(error);
  });
  //get current users sell posts
  getPostings("Seller",user).then(function(result){
    $scope.entries.selling = result;
    dashboardEntries.setSelling($scope.entries.selling);
    //hide loading icon upon load complete
    $ionicLoading.hide();
  }, function(error){
    console.log(error);
  });
  //reload the page if the user clicks pulls to refresh
  $scope.refresh = function(){
    $scope.entries = {};
    $scope.entries.buying = dashboardEntries.getBuying();
    $scope.entries.selling = dashboardEntries.getSelling();
    $scope.$broadcast("scroll.refreshComplete");
  }
  //set the mode in the dashboardEntries servide to either buy or sell
  $scope.setMode = function(table,index){
    dashboardEntries.setIndex(index);
    dashboardEntries.setTableName(table);
  }
}]);