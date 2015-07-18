angular.module('app.controllers', [])

.controller('DashboardCtrl', ['$scope',function($scope) {
  var user = Parse.User.current();
  getPostings("Buyer",user).then(function(result){
    $scope.buying = result;
    $scope.noBuyPostings = $scope.buying.length == 0;
  }, function(error){
    alert(error);
  });
  getPostings("Seller",user).then(function(result){
    $scope.selling = result;
    $scope.noSellPostings = $scope.selling.length == 0;
  }, function(error){
    alert(error);
  });

}]);