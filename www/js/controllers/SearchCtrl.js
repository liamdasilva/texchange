angular.module('app.controllers')
//controls the search page
.controller('SearchCtrl', ['$scope','viewPosting',function($scope,viewPosting) {
  // var user = Parse.User.current();
  $scope.search = {};
  $scope.search.option = "Buying";

  //gets the search results when the user clicks search
  $scope.getSearchResults = function(){
    if ($scope.search.option == "Buying"){
      getAllPostsByTitle($scope.search.text, "Buyer").then(function(result){
        $scope.results  = result;
        $scope.$apply();

      }, function (error){
        alert (error);
      });
    }
    else if ($scope.search.option == "Selling"){
      getAllPostsByTitle($scope.search.text, "Seller").then(function(result){
        $scope.results  = result;
        $scope.$apply();

        console.log($scope.results);
      }, function (error){
        alert (error);
      });
    }
  }
  //set mode of search and the post data into the viewPostings service 
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