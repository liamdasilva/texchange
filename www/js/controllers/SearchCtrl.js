angular.module('app.controllers')

.controller('SearchCtrl', ['$scope','$window','viewPosting',function($scope,$window,viewPosting) {
 // var user = Parse.User.current();
 $scope.search = {};
 $scope.search.option = "Buying";
 // console.log($scope.search.option);
  //console.log($scope.search.text);
  $scope.getSearchResults = function(){
    console.log($scope.search.text);
    console.log($scope.search.option);
    if ($scope.search.option == "Buying"){
      getAllPostsByTitle($scope.search.text, "Buyer").then(function(result){
        $scope.results  = result;
        $scope.noResults = $scope.results.length == 0;
        $scope.$apply();

      }, function (error){
        alert (error);
      });
    }
    else if ($scope.search.option == "Selling"){
      getAllPostsByTitle($scope.search.text, "Seller").then(function(result){
        $scope.results  = result;
      // console.log($scope.results.length);
        $scope.noResults = $scope.results.length == 0;
        $scope.$apply();

        console.log($scope.results);
      }, function (error){
        alert (error);
      });
    }
  }

  $scope.refresh = function(){
    $window.location.reload();
  }

  $scope.sendPost = function(index){
    console.log($scope.results[index]);
    viewPosting.setPosting($scope.results[index]);
    if($scope.search.option == "Buying")
      viewPosting.setTableName("Buyer");
    else{
      viewPosting.setTableName("Seller");
    }
  }
}]);