angular.module('app.controllers', [])


.controller('AppCtrl', ['$scope', '$ionicModal', '$ionicHistory','$state', function($scope, $ionicModal, $ionicHistory,$state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  $scope.doLogout = function(){
    console.log("logged out");
    Parse.User.logOut();
    alert("You are now logged out");
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('login');
  };
}])
.controller('LoginCtrl', ['$scope', '$ionicModal', '$ionicHistory', '$state', function($scope, $ionicModal, $ionicHistory,$state) {
  $scope.$on('$ionicView.enter', function(e) {
    if(Parse.User.current()){
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.dashboard');
    }
  });
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
        $scope.name = user.get("firstName");
        alert("Hello " + $scope.name + ", you are now logged in.");
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.dashboard');
      },
      error:function(user,error){
        alert(error.message);
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
        $scope.signUpError = false;
        $scope.passMatch = true;
        $scope.incomplete = true;
        $scope.closeLogin();
    },function(error){
      $scope.signUpErrorMessage = error;
      $scope.signUpError = true;
    });
  };
}])

.controller('DashboardCtrl', ['$scope','$window','dashboardEntries',function($scope,$window,dashboardEntries) {
  // var user = Parse.User.current();
  // getPostings("Buyer",user).then(function(result){
  //   $scope.buying = result;
  //   $scope.noBuyPostings = $scope.buying.length == 0;
  //    $scope.$apply();
  // }, function(error){
  //   alert(error);
  // });
  // getPostings("Seller",user).then(function(result){
  //   $scope.selling = result;
  //   $scope.noSellPostings = $scope.selling.length == 0;
  // }, function(error){
  //   alert(error);
  // });
  $scope.entries = dashboardEntries.getEntries();
  
  $scope.refresh = function(){
    $scope.entries = dashboardEntries.getEntries();
    $scope.$apply();
  }
  $scope.setIndex = function(index){
    dashboardEntries.setIndex(index);
  }
}])

.controller('SearchCtrl', ['$scope','$window',function($scope,$window) {
   // var user = Parse.User.current();
    $scope.search = {};
   // console.log($scope.search.option);
    //console.log($scope.search.text);
    $scope.getSearchResults = function(){
      console.log($scope.search.text);
      console.log($scope.search.option);
      if ($scope.search.option == "Buying"){
        getAllPostsByTitle($scope.search.text, "Buyer").then(function(result){
          console.log(result[0]);
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
            console.log($scope.results.length);
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
}])


.controller('NewBuyPostingCtrl', ['$scope', '$state','dashboardEntries',function($scope,$state,dashboardEntries) {
  $scope.posting = {};
  $scope.posting.courseCode = "";
  $scope.posting.price = "";
  $scope.posting.edition = "";
  $scope.posting.tName = "";
  $scope.save = function(){
    savePosting($scope.posting,"Buyer", false).then(function(result,object){
      alert("Save successful");
      dashboardEntries.getEntries().buying.push(object.toJSON());
      //reset values in textboxes
      $scope.posting.courseCode = "";
      $scope.posting.price = "";
      $scope.posting.edition = "";
      $scope.posting.tName = "";
      $state.go('app.dashboard');
    },function(error){
      alert(error);
    })
  }
  $scope.post = function(){
    //save buy posting with visibility as true
    savePosting($scope.posting,"Buyer", true).then(function(result,object){
      alert("Post successful");
      dashboardEntries.getEntries().buying.push(object.toJSON());
      //reset values in textboxes
      $scope.posting.courseCode = "";
      $scope.posting.price = "";
      $scope.posting.edition = "";
      $scope.posting.tName = "";
      $state.go('app.dashboard');
    }, function(error){
      alert(error);
    });
  }
}])



.controller('ConversationsCtrl', ['$scope','conversationsService',function($scope, conversationsService) {
  $scope.refresh = function(){
    $window.location.reload();
  }
  var user = Parse.User.current();
  getConversations().then(function(result){
    $scope.conversations = getOtherConversationUser(result);
    $scope.conversationID = result;
   // console.log($scope.conversations);
    $scope.noConversations = $scope.conversations.length == 0;
    conversationsService.set($scope.conversations);
    //console.log(conversationsService.get());
   // console.log($scope.conversations[0].id);
   $scope.$apply();
   console.log(conversationsService.getConversation($scope.conversations[0].id));
    }, function(error){
      alert(error);
    });
}])

.controller('MessagingCtrl', ['$scope', '$stateParams','$state','$window', '$ionicScrollDelegate',function($scope, $stateParams,$state, $window, $ionicScrollDelegate) {
   
  $scope.conversation = $stateParams.conversationID;
  console.log($stateParams);
  var username = getUsernamesByID($scope.conversation);
  $scope.History = [];
  $scope.sendMessage = function(){
    saveMessageToParse($scope.Message.text, $scope.conversation, user.id);
    $scope.Message.text = "";
  }
  $scope.Messaging = Parse.User.current().id;
  $scope.Message = "";
  $scope.Message.text = "";
  var user = Parse.User.current();
  console.log($scope.conversation);
  getMessages($scope.conversation).then(function(result){
    console.log(result);

  $scope.History = result;
    $scope.noHistory = $scope.History.length == 0;

       
    }, function(error){
       alert(error);
    });
  $scope.refresh = function(){
    $window.location.reload();
  }

}])

.controller('NewSellPostingCtrl', ['$scope','$state','dashboardEntries',function($scope,$state,dashboardEntries) {
  $scope.posting = {};
  $scope.posting.courseCode = "";
  $scope.posting.price = "";
  $scope.posting.edition = "";
  $scope.posting.tName = "";
  $scope.posting.condition = "Good";

  $scope.save = function(){
    savePosting($scope.posting,"Seller", false).then(function(result,object){
      alert("Save successful");
      //update the dashboard list of sell posts
      dashboardEntries.getEntries().selling.push(object.toJSON());
      //reset the form before leaving
      $scope.posting.courseCode = "";
      $scope.posting.price = "";
      $scope.posting.edition = "";
      $scope.posting.tName = "";
      $scope.posting.condition = "Good";
      $state.go('app.dashboard');

    }, function(error){
      alert(error);
    });
  }

  $scope.post = function(){
    //save buy posting with visibility as true
    savePosting($scope.posting,"Seller", true).then(function(result,object){
      alert("Post successful");
      //update the dashboard list of sell posts
      dashboardEntries.getEntries().selling.push(object.toJSON());
      //reset the form before leaving
      $scope.posting.courseCode = "";
      $scope.posting.price = "";
      $scope.posting.edition = "";
      $scope.posting.tName = "";
      $state.go('app.dashboard');
    }, function(error){
      alert(error);
    });
  }
}])
.controller('SingleBuyEntryCtrl', ['$scope', '$stateParams','$state','dashboardEntries',function($scope, $stateParams,$state,dashboardEntries) {
  $scope.save = function(){
    updatePostingById("Buyer",$stateParams.objectId,$scope.posting).then(function(result,object){
        alert(result);
        var i = dashboardEntries.getIndex();
        dashboardEntries.getEntries().buying[i] = object.toJSON();
        
    },function(error){
      alert(error);
    });
  }
  $scope.delete = function(){
    deletePostingById("Buyer",$stateParams.objectId).then(function(result,post){
        alert(result);
        var i = dashboardEntries.getIndex();
        dashboardEntries.getEntries().buying.splice(i,1);
        $state.go('app.dashboard');
    },function(error){
      alert(error);
    });
  }
  getPostingById("Buyer",$stateParams.objectId).then(function(object){
    $scope.posting = {};
    $scope.posting.courseCode = object.courseCode;
    $scope.posting.price = object.price;
    $scope.posting.edition = object.edition;
    $scope.posting.tName = object.title;
    $scope.posting.visibility = object.visibility;
  },function(error){
    alert(error);
  });
}])
.controller('SingleSellEntryCtrl', ['$scope', '$stateParams','$state','dashboardEntries',function($scope, $stateParams,$state,dashboardEntries) {
  $scope.save = function(){
    updatePostingById("Seller",$stateParams.objectId,$scope.posting).then(function(result){
        alert(result);

    },function(error){
      alert(error);
    });
  }
  $scope.delete = function(){
    deletePostingById("Seller",$stateParams.objectId).then(function(result){
        alert(result);
        $state.go('app.dashboard');
    },function(error){
      alert(error);
    });
  }
  getPostingById("Seller",$stateParams.objectId).then(function(object){
    $scope.posting = {};
    $scope.posting.courseCode = object.courseCode;
    $scope.posting.price = object.price;
    $scope.posting.edition = object.edition;
    $scope.posting.tName = object.title;
    $scope.posting.condition = object.condition;
    $scope.posting.visibility = object.visibility;
  },function(error){
    alert(error);
  });
}]);

