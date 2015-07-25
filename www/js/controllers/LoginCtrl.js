angular.module('app.controllers')
//responsible for controlling sign up and sign in
.controller('LoginCtrl', ['$scope', '$ionicModal','dashboardEntries', '$ionicHistory','$ionicPopup', '$state', function($scope, $ionicModal,dashboardEntries, $ionicHistory,$ionicPopup,$state) {
  $scope.$on('$ionicView.enter', function(e) {
    //bypass the login page if the user is logged in
    if(Parse.User.current()){
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.dashboard');
    }
    //remove cache and history if a previous user was signed in.
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
  });

  //shows an ionic popup given a title and message content, and logs the content to the console
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

  // Form data for the signup modal
  $scope.signUpData = {};
  $scope.signUpData.username="";
  $scope.signUpData.email="";
  $scope.signUpData.firstName="";
  $scope.signUpData.lastName="";
  $scope.signUpData.password="";
  $scope.signUpData.passwordc="";
  $scope.passMatch = false; //used to disable the signup button if passwords don't match
  $scope.incomplete = true; //used to disable the signup button if fields are empty

  // Create the signup modal that we will use later
  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.signUpModal = modal;
  });

  // Triggered in the signup modal to close it
  $scope.closeSignup = function() {
    $scope.signUpModal.hide();
  };

  // Opens the signup modal
  $scope.signup = function() {
    $scope.signUpModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login');
    Parse.User.logIn($scope.loginData.username, $scope.loginData.password,{
      success: function(user){
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

  //make sign up button dynamically disable if info is invalid
  $scope.$watch('signUpData.username',function() {$scope.test();});
  $scope.$watch('signUpData.email',function() {$scope.test();});
  $scope.$watch('signUpData.firstName', function() {$scope.test();});
  $scope.$watch('signUpData.lastName', function() {$scope.test();});
  $scope.$watch('signUpData.password', function() {$scope.test();});
  $scope.$watch('signUpData.passwordc', function() {$scope.test();});

  //make sign up button dynamically disable if info is invalid
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
  //Perform the signup action when the user submits the signup form
  $scope.doSignUp = function() {
    var validation = validateUser($scope.signUpData)
    if (validation == true){
      console.log('Doing signup');
      $scope.signUpData.firstName=$scope.signUpData.firstName.capitalizeFirstLetter();
      $scope.signUpData.lastName=$scope.signUpData.lastName.capitalizeFirstLetter();
      $scope.signUpData.username = $scope.signUpData.username.toLowerCase();
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
        
      },function(error){
        $scope.showAlert("Error",error);
      });
    }else{
      $scope.showAlert("Error",validation);
    }
  };
}]);