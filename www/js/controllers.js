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
  $scope.signUpData = {};
  $scope.signUpData.username="";
  $scope.signUpData.email="";
  $scope.signUpData.firstName="";
  $scope.signUpData.lastName="";
  $scope.signUpData.password="";
  $scope.signUpData.passwordc="";
  $scope.signUpErrorMessage = "";
  $scope.error = false;
  $scope.incomplete = true;  

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
    console.log('Doing login');
    Parse.User.logIn($scope.loginData.username, $scope.loginData.password,{
      success: function(user){
        $scope.name = user.get("firstName");
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
  $scope.$watch('signUpData.username',function() {$scope.test();});
  $scope.$watch('signUpData.email',function() {$scope.test();});
  $scope.$watch('signUpData.firstName', function() {$scope.test();});
  $scope.$watch('signUpData.lastName', function() {$scope.test();});
  $scope.$watch('signUpData.password', function() {$scope.test();});
  $scope.$watch('signUpData.passwordc', function() {$scope.test();});

  $scope.test = function() {
    if ($scope.signUpData.password !== $scope.signUpData.passwordc) {
      $scope.error = true;
    } else {
      $scope.error = false;
    }
    $scope.incomplete = false;
    if (!$scope.signUpData.username.length ||
      !$scope.signUpData.lastName.length ||
      !$scope.signUpData.firstName.length || 
      !$scope.signUpData.password.length || 
      !$scope.signUpData.email.length) {
          $scope.incomplete = true;
    }
  };

  $scope.doSignUp = function() {
    console.log('Doing signup');
    signUpNewUser($scope.signUpData).then(
      function(result){
        alert("You successfully signed up!");
        $scope.closeSignup();
        $scope.signUpData.username="";
        $scope.signUpData.email="";
        $scope.signUpData.firstName="";
        $scope.signUpData.lastName="";
        $scope.signUpData.password="";
        $scope.signUpData.passwordc="";
        $scope.signUpErrorMessage = "";
        $scope.error = false;
        $scope.incomplete = true;
        $scope.closeLogin();
    },function(error){
      $scope.signUpErrorMessage = error;
      $scope.signUpError = true;
    });
  };
}])

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

}])
.controller('NewBuyPostingCtrl', ['$scope', '$state',function($scope,$state) {
  $scope.posting = {};
  $scope.posting.courseCode = "";
  $scope.posting.price = "";
  $scope.posting.edition = "";
  $scope.posting.tName = "";

  $scope.save = function(){
    saveBuyPosting($scope.posting,"Buyer", false).then(
      function(result){
      alert("Save successful");
      $scope.posting.courseCode = "";
      $scope.posting.price = "";
      $scope.posting.edition = "";
      $scope.posting.tName = "";
      $state.go('app.dashboard')

    }, function(error){
      alert(error);
    });
  }

  $scope.post = function(){
    //save buy posting with visibility as true
    saveBuyPosting($scope.posting,"Buyer", true).then(
      function(result){
      alert("Post successful");
      $scope.posting.courseCode = "";
      $scope.posting.price = "";
      $scope.posting.edition = "";
      $scope.posting.tName = "";
      $state.go('app.dashboard')

    }, function(error){
      alert(error);
    });
  }
}])
.controller('NewSellPostingCtrl', ['$scope','$state',function($scope,$state) {
  $scope.posting = {};
  $scope.posting.courseCode = "";
  $scope.posting.price = "";
  $scope.posting.edition = "";
  $scope.posting.tName = "";
  $scope.posting.condition = "Good";

  $scope.save = function(){
    savePosting($scope.posting,"Seller", false).then(
      function(result){
      alert("Save successful");
      $scope.posting.courseCode = "";
      $scope.posting.price = "";
      $scope.posting.edition = "";
      $scope.posting.tName = "";
      $state.go('app.dashboard')

    }, function(error){
      alert(error);
    });
  }

  $scope.post = function(){
    //save buy posting with visibility as true
    savePosting($scope.posting,"Seller", true).then(
      function(result){
      alert("Post successful");
      $scope.posting.courseCode = "";
      $scope.posting.price = "";
      $scope.posting.edition = "";
      $scope.posting.tName = "";
      $state.go('app.dashboard')

    }, function(error){
      alert(error);
    });
  }
}])
.controller('SingleBuyEntryCtrl', ['$scope', '$stateParams',function($scope, $stateParams) {
  $scope.buyId = $stateParams.objectId;
}])
.controller('SingleSellEntryCtrl', ['$scope', '$stateParams',function($scope, $stateParams) {
  $scope.sellId = $stateParams.objectId;
}]);
