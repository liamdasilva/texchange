angular.module('app.controllers')
//manages the logout button in the side menu
.controller('AppCtrl', ['$scope', '$ionicHistory','dashboardEntries','$state', function($scope, $ionicHistory,dashboardEntries,$state) {
  //log the user out and take them to the login page
  $scope.doLogout = function(){
    console.log("logged out");
    Parse.User.logOut();
    //alert("You are now logged out");
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('login');
  };
}]);