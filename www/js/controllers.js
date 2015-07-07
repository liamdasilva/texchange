angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};
  $scope.loginData.username="";
  $scope.loginData.password="";

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    Parse.User.logIn($scope.loginData.username, $scope.loginData.password,{
      success: function(user){
        alert("logged In");
        $scope.closeLogin();
      },
      error:function(user,error){
        alert(error.message);
      }
    });
  };
})

.controller('BuyingCtrl', function($scope) {
  $scope.buying = [];
  var buyerQuery = new Parse.Query("Buyer");
  var user = Parse.User.current();
  buyerQuery.equalTo("author",user);
  buyerQuery.find({
    success: function(results) {
      //alert("Successfully retrieved " + results.length + " buy posts.");
      // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {
        var object = results[i].toJSON();
        $scope.buying.push(object);
        //alert(object.objectId + ' - ' + object.title);
      }
      $scope.buying = results.toJSON();
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
