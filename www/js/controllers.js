angular.module('app.controllers', [])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', function($scope, $ionicModal, $timeout) {
  
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

  // Form data for the login modal
  $scope.signupData = {};
  $scope.signupData.username="";
  $scope.signupData.email="";
  $scope.signupData.firstName="";
  $scope.signupData.lastName="";
  $scope.signupData.password="";
  $scope.signupData.passwordc="";


  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.signupModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
  };

  // Triggered in the login modal to close it
  $scope.closeSignup = function() {
    $scope.signupModal.hide();
  };
  // Open the login modal
  $scope.signup = function() {
    $scope.signupModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    Parse.User.logIn($scope.loginData.username, $scope.loginData.password,{
      success: function(user){
        var name = user.get("firstName");
        alert("Hello " + name + ", you are now logged in.");
        $scope.closeLogin();
      },
      error:function(user,error){
        alert(error.message);
      }
    });
  };

  $scope.doLogout = function(){
    console.log("logged out");
    Parse.User.logOut();
    alert("You are now logged out");
  };

  $scope.doSignup = function() {
    console.log('Doing signup', $scope.loginData);
    Parse.User.logIn($scope.loginData.username, $scope.loginData.password,{
      success: function(user){
        var name = user.get("firstName");
        alert("Hello " + name + ", you are now logged in.");
        $scope.closeLogin();
      },
      error:function(user,error){
        alert(error.message);
      }
    });
  };
}])

.controller('DashboardCtrl', ['$scope',function($scope) {
  $scope.buying = [];
  $scope.selling = [];
  var user = Parse.User.current();
  $scope.buying = getPostings("Buyer",user);
  $scope.selling = getPostings("Seller",user);
  $scope.noBuyPostings = $scope.buying == [];
  $scope.noSellPostings = $scope.selling == [];

}])
.controller('NewBuyPostingCtrl', ['$scope',function($scope) {

}])
.controller('NewSellPostingCtrl', ['$scope',function($scope) {

}])
.controller('SingleBuyEntryCtrl', ['$scope', '$stateParams',function($scope, $stateParams) {
}])
.controller('SingleSellEntryCtrl', ['$scope', '$stateParams',function($scope, $stateParams) {
}]);
