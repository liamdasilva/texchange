angular.module('app.controllers')

.controller('AppCtrl', ['$scope', '$ionicHistory','dashboardEntries','$state', function($scope, $ionicHistory,dashboardEntries,$state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.doLogout = function(){
    console.log("logged out");
    Parse.User.logOut();
    //alert("You are now logged out");
    dashboardEntries.setBuying([]);
    dashboardEntries.setSelling([]);
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('login');
  };
}]);