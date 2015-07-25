  angular.module('app.controllers', [])

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
    alert("You are now logged out");
    dashboardEntries.setBuying([]);
    dashboardEntries.setSelling([]);
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('login');
  };
}])
  
  .controller('LoginCtrl', ['$scope', '$ionicModal','dashboardEntries', '$ionicHistory', '$state', function($scope, $ionicModal,dashboardEntries, $ionicHistory,$state) {

    $scope.$on('$ionicView.enter', function(e) {
      if(Parse.User.current()){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.dashboard');
      }
    });
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
        var user = Parse.User.current();
        getPostings("Buyer",user).then(function(result){
          dashboardEntries.setBuying(result);
        }, function(error){
          console.log(error);
        });
        getPostings("Seller",user).then(function(result){
          dashboardEntries.setSelling(result);
        }, function(error){
          console.log(error);
        });
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


  .controller('DashboardCtrl', ['$scope','$location','$ionicLoading','dashboardEntries',function($scope,$location,$ionicLoading,dashboardEntries) {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    $scope.entries = {};
    var user = Parse.User.current();
    getPostings("Buyer",user).then(function(result){
      $scope.entries.buying = result;
      dashboardEntries.setBuying($scope.entries.buying);
    }, function(error){
      console.log(error);
    });
    getPostings("Seller",user).then(function(result){
      $scope.entries.selling = result;
      dashboardEntries.setSelling($scope.entries.selling);
      $ionicLoading.hide();
    }, function(error){
      console.log(error);
    });

    $scope.refresh = function(){
      $scope.entries = {};
      $scope.entries.buying = dashboardEntries.getBuying();
      $scope.entries.selling = dashboardEntries.getSelling();
      $scope.$broadcast("scroll.refreshComplete");
    }
    $scope.setMode = function(table,index){
      dashboardEntries.setIndex(index);
      dashboardEntries.setTableName(table);
    }
  }])

  .controller('SearchCtrl', ['$scope','$window','viewPosting',function($scope,$window, viewPosting) {
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
   $scope.conversations = {};
   getConversations().then(function(result){
     $scope.conversations = getOtherConversationUser(result);
     conversationsService.setConversations($scope.conversations);
     noConversations = $scope.conversations.length == 0;
     $scope.$apply();
   }, function(error){
    alert(error);
  });
   $scope.refresh = function(){
    $window.location.reload();
  }
}])

  .controller('MessagingCtrl', ['$scope', '$stateParams','$state','$window', '$ionicScrollDelegate','$timeout','conversationsService','$interval',function($scope, $stateParams,$state, $window, $ionicScrollDelegate,$timeout, conversationsService,$interval) {
    lastUpdated = new Date();
    $scope.conversations = conversationsService.getConversation();
    $scope.conversationID = $stateParams.conversationID;

    if (conversationsService.getConversations().length == 0){
      getConversations().then(function(result){
       $scope.conversations = getOtherConversationUser(result);
       conversationsService.setConversations($scope.conversations);
       $scope.conversations = conversationsService.getConversation($scope.conversationID);
       console.log($scope.conversations);
       $scope.$apply();

     }, function(error){
      alert(error);
    });
    }else{
      $scope.conversations = conversationsService.getConversation($scope.conversationID);
    }

    $scope.History = [];
    $scope.sendMessage = function(){
      if ($scope.Message.text.trim() != ""){
        saveMessageToParse($scope.Message.text, $scope.conversationID, $scope.conversations.userID).then(function(result){
          lastUpdated = new Date();
          $scope.History.push(result);
          $scope.$apply();
          $scope.scrollToBottom();

        }, function(error){
          alert(error);
        });
      }
      $scope.Message.text = "";
    }

    $scope.Messaging = Parse.User.current().id;
    $scope.Message = "";
    $scope.Message.text = "";
    var user = Parse.User.current();
    getMessages($scope.conversationID).then(function(result){
      $scope.History = result;
      $scope.noHistory = $scope.History.length == 0;
      $scope.scrollToBottom();
      lastUpdated = new Date();
      $scope.update();

    }, function(error){
     alert(error);
   });
    var stop;
    $scope.update = function() {
          // Don't start updating if we are already updating
          if ( angular.isDefined(stop) ) return;
          stop = $interval(function() {
           updateMessages($scope.conversationID, lastUpdated, $scope.conversations.userID).then(function(result){
            lastUpdated = new Date();
            $scope.History =  $scope.History.concat(result); 
            $scope.$apply();
            $scope.scrollToBottom();
          });       
         }, 5000);
        };

        $scope.stopUpdate = function() {
          if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
          }
        };

        $scope.$on('$destroy', function() {
          // Make sure that the interval is destroyed too
          $scope.stopUpdate();
        });

        $scope.scrollToBottom = function() {
          $timeout(function() {
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
          }, 0);
        };
      }])

  .controller('NewPostingCtrl', ['$scope','$state','dashboardEntries',function($scope,$state,dashboardEntries) {
    $scope.posting = {};
    $scope.posting.courseCode = "";
    $scope.posting.price = "";
    $scope.posting.edition = "";
    $scope.posting.title = "";
    $scope.posting.condition = "Good";
    $scope.mode = dashboardEntries.getTableName();
  //console.log($scope.mode);

  $scope.save = function(){
    savePosting($scope.posting,$scope.mode, false).then(function(result,object){
      alert("Save successful");
      afterSave(object);

    }, function(error){
      alert(error);
    });
  }
  $scope.post = function(){
    //save buy posting with visibility as true
    savePosting($scope.posting,$scope.mode, true).then(function(result,object){
      alert("Post successful");
      afterSave(object);
    }, function(error){
      alert(error);
    });
  }
  var afterSave = function(object){
    //update the dashboard list of sell posts
    if ($scope.mode == "Buyer"){
      dashboardEntries.getBuying().push(object.toJSON());
    }else if ($scope.mode == "Seller"){
      dashboardEntries.getSelling().push(object.toJSON());
    }
    //reset the form before leaving
    $scope.posting.courseCode = "";
    $scope.posting.price = "";
    $scope.posting.edition = "";
    $scope.posting.title = "";
    $scope.posting.condition = "Good";
    $state.go('app.dashboard');
  }
}])

  .controller('SingleEntryCtrl', ['$scope', '$stateParams','$state','dashboardEntries','viewPosting',function($scope, $stateParams,$state,dashboardEntries,viewPosting) {
    if (dashboardEntries.getIndex() == -1){
      $state.go('app.dashboard');
    }
    $scope.mode = dashboardEntries.getTableName();
  //console.log($scope.mode);
  var i = dashboardEntries.getIndex();
  if ($scope.mode == "Buyer"){
    $scope.posting = dashboardEntries.getBuying()[i];
  }else{
    $scope.posting = dashboardEntries.getSelling()[i];
  }
  $scope.objectId = $stateParams.objectId;
  if ($scope.mode == "Seller"){
    getPostingsByCourseCode("Buyer",$scope.posting.courseCode).then(function(result){
      $scope.buyers = result;
    }, function(error){
      console.log(error);
    });
  }else if ($scope.mode == "Buyer"){
    getPostingsByCourseCode("Seller",$scope.posting.courseCode).then(function(result){
      $scope.sellers = result;
    }, function(error){
      console.log(error);
    });
  }

  $scope.sendPost = function(index){
    viewPosting.setPosting($scope.buyers[index]);
    if($scope.mode == "Buyer")
      viewPosting.setTableName("Seller");
    else{
      viewPosting.setTableName("Buyer");
    }
  }
}])

  .controller('EditEntryCtrl', ['$scope', '$ionicHistory','$stateParams','$state','dashboardEntries',function($scope, $ionicHistory,$stateParams,$state,dashboardEntries) {
    if (dashboardEntries.getIndex() == -1){
      $state.go('app.dashboard');
    }
    $scope.form={};
    $scope.mode = dashboardEntries.getTableName();
  //console.log($scope.mode);
  var i = dashboardEntries.getIndex();
  if ($scope.mode == "Buyer"){
    $scope.posting = dashboardEntries.getBuying()[i];
  }else{
    $scope.posting = dashboardEntries.getSelling()[i];
    $scope.form.condition = $scope.posting.condition;
  }
  $scope.form.courseCode = $scope.posting.courseCode;
  $scope.form.title = $scope.posting.title;
  $scope.form.edition = $scope.posting.edition;
  $scope.form.price = $scope.posting.price;

  $scope.save = function(){
    $scope.posting.courseCode = $scope.form.courseCode;
    $scope.posting.title = $scope.form.title;
    $scope.posting.edition = $scope.form.edition;
    $scope.posting.price = $scope.form.price;
    if ($scope.mode == "Seller"){$scope.posting.condition = $scope.form.condition;}
    updatePostingById($scope.mode,$stateParams.objectId,$scope.posting).then(function(result,object){
      alert(result);
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.dashboard');
    },function(error){
      alert(error);
    });
  }
  $scope.delete = function(){
    deletePostingById($scope.mode,$stateParams.objectId).then(function(result){
      alert(result);
      if ($scope.mode == "Buyer"){
        dashboardEntries.getBuying().splice(i,1);
      }else{
        dashboardEntries.getSelling().splice(i,1);
      }
      $scope.$apply();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.dashboard');
    },function(error){
      alert(error);
    });
  }
  $scope.togglePublish = function(){
    if ($scope.mode == "Buyer"){
      setVisibilityById($scope.mode,$stateParams.objectId,!dashboardEntries.getBuying()[i].visibility).then(function(result){
        alert(result);
        dashboardEntries.getBuying()[i].visibility = !dashboardEntries.getBuying()[i].visibility;
        $scope.$apply();
      },function(error){
        alert(error);
      });
    }else{
      setVisibilityById($scope.mode,$stateParams.objectId,!dashboardEntries.getSelling()[i].visibility).then(function(result){
        alert(result);
        dashboardEntries.getSelling()[i].visibility = !dashboardEntries.getSelling()[i].visibility;
      },function(error){
        alert(error);
      });
    }
  }
}])

  .controller('ViewPostingsCtrl', ['$scope','$ionicLoading', '$stateParams','$state','viewPosting','conversationsService',function($scope,$ionicLoading, $stateParams,$state,viewPosting,conversationsService) {
   $scope.conversations = [];
   if (conversationsService.getConversations().length ==0){
    console.log("here");
    getConversations().then(function(result){
     $scope.conversations = getOtherConversationUser(result);
     conversationsService.setConversations($scope.conversations);
     noConversations = $scope.conversations.length == 0;
     $scope.$apply();
     console.log($scope.conversations);
   }, function(error){
    alert(error);
  });
  } else{
    $scope.conversations = conversationsService.getConversation();
      console.log($scope.conversations);
  }

  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
  $scope.pageId = $stateParams.objectId;
  $scope.posting = viewPosting.getPosting();
  $scope.author = $scope.posting.author;
  $scope.mode = viewPosting.getTableName();
  $scope.entries = {};
  getPostings("Buyer",$scope.posting.parseAuthor).then(function(result){
    $scope.entries.buying = result;
    $scope.entries.buying = $scope.entries.buying.filter(function(el){
      return el.objectId != $scope.pageId;
    });

  }, function(error){
    console.log(error);
  });
  getPostings("Seller",$scope.posting.parseAuthor).then(function(result){
    $scope.entries.selling = result;
    $scope.entries.selling = $scope.entries.selling.filter(function(el){
      return el.objectId != $scope.pageId;
    });
    $ionicLoading.hide();
  }, function(error){
    console.log(error);
  });

  $scope.startConversation = function(){
    //console.log($scope.author);
    var conversationID = conversationsService.getConversationID($scope.author.objectId);
   // console.log(conversationID.id);
    if (conversationID == null){
      createConversation($scope.posting.parseAuthor).then(function(result){
        conversationID = result;
        name = $scope.author.firstName +" "+ $scope.author.lastName;
        userID=  $scope.author.objectId;
        id = result.objectId;
        conversationsService.addConversation(name, userID, id);
       // console.log(conversationID);
        $state.go('app.messaging', {conversationID: conversationID.objectId });
      })
    }
    else{  
      console.log(conversationID);
      $state.go('app.messaging', {conversationID: conversationID.id} );
  };
}

$scope.refresh = function(){
  $scope.entries = {};
  $scope.entries.buying = dashboardEntries.getBuying();
  $scope.entries.selling = dashboardEntries.getSelling();
  $scope.$broadcast("scroll.refreshComplete");
}

}]);
