angular.module('app.controllers')

.controller('LoginCtrl', ['$scope', '$ionicModal','dashboardEntries', '$ionicHistory','$ionicPopup', '$state', function($scope, $ionicModal,dashboardEntries, $ionicHistory,$ionicPopup,$state) {
  $scope.$on('$ionicView.enter', function(e) {
    if(Parse.User.current()){
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.dashboard');
    }
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
  });
  $scope.showAlert = function(title,content) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: content,
      type: 'button-energized'
    });
    alertPopup.then(function(res) {
      console.log(content);
    });
  };
  // Form data for the login view
  $scope.loginData = {};
  $scope.loginData.username="";
  $scope.loginData.password="";

  // Form data for the singup modal
  $scope.signUpData = {};
  $scope.signUpData.username="";
  $scope.signUpData.email="";
  $scope.signUpData.firstName="";
  $scope.signUpData.lastName="";
  $scope.signUpData.password="";
  $scope.signUpData.passwordc="";
  $scope.signUpErrorMessage = "";
  $scope.signUpError = false;
  $scope.passMatch = false;
  $scope.incomplete = true;
  $scope.signupData = {};
  $scope.signupData.username="";
  $scope.signupData.email="";
  $scope.signupData.firstName="";
  $scope.signupData.lastName="";
  $scope.signupData.password="";
  $scope.signupData.passwordc="";

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.signupModal = modal;
  });

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

        //load the dashboard entries upon login
        // var user = Parse.User.current();
        // getPostings("Buyer",user).then(function(result){
        //   dashboardEntries.setBuying(result);
        // }, function(error){
        //   console.log(error);
        // });
        // getPostings("Seller",user).then(function(result){
        //   dashboardEntries.setSelling(result);
        // }, function(error){
        //   console.log(error);
        // });
        $scope.name = user.get("firstName");
        $scope.showAlert("Success","Hello " + $scope.name + ", you are now logged in.");
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.dashboard');
      },
      error:function(user,error){
        $scope.showAlert("Error",error.message);
      }
    });
  };

  $scope.$watch('signUpData.username',function() {$scope.test();});
  $scope.$watch('signUpData.email',function() {$scope.test();});
  $scope.$watch('signUpData.firstName', function() {$scope.test();});
  $scope.$watch('signUpData.lastName', function() {$scope.test();});
  $scope.$watch('signUpData.password', function() {$scope.test();});
  $scope.$watch('signUpData.passwordc', function() {$scope.test();});

  $scope.test = function() {
    if ($scope.signUpData.password !== $scope.signUpData.passwordc) {
      $scope.passMatch = false;
    } else {
      $scope.passMatch = true;
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
    var validation = validateUser($scope.signUpData)
    if (validation == true){
      console.log('Doing signup');
      signUpNewUser($scope.signUpData).then(
      function(result){
        $scope.showAlert("Success", "You have signed up successfully!");
        $scope.closeSignup();
        $scope.signUpData.username="";
        $scope.signUpData.email="";
        $scope.signUpData.firstName="";
        $scope.signUpData.lastName="";
        $scope.signUpData.password="";
        $scope.signUpData.passwordc="";
        $scope.signUpErrorMessage = "";
        $scope.signUpError = false;
        $scope.passMatch = true;
        $scope.incomplete = true;
      },function(error){
        $scope.signUpErrorMessage = error;
        $scope.signUpError = true;
      });
    }else{
      $scope.showAlert("Error",validation);
    }
  };
}]);