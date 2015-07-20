// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(['$stateProvider','$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'LoginCtrl'
    })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.conversations', {
    url: "/conversations",
    views: {
      'menuContent': {
        templateUrl: "templates/conversations.html",
		    controller: 'ConversationsCtrl'/*,
        resolve: { 
         conversations: function(ConversationsService) {  
         return ConversationsService.getConversations(Parse.User.current())
           }
        }*/
      }
    }
  })

   .state('app.dashboard', {
    url: "/dashboard",
    views: {
      'menuContent': {
        templateUrl: "templates/dashboard.html",
        controller: 'DashboardCtrl'
      }
    }
  })

  .state('app.messaging', {
    url: "/conversations/:conversationID",
    views: {
      'menuContent': {
        templateUrl: "templates/messaging.html",
        controller: 'MessagingCtrl'/*,
         resolve: {
         conversation: function($stateParams, ConversationsService) {   
        return ConversationsService.getConversation($stateParams.conversationID)
      }
    }*/

      }
    }
  })

  .state('app.newBuyPosting', {
    url: "/newBuyPosting",
    views: {
      'menuContent': {
        templateUrl: "templates/newBuyPosting.html",
        controller: 'NewBuyPostingCtrl'
      }
    }
  })

  .state('app.newSellPosting', {
    url: "/newSellPosting",
    views: {
      'menuContent': {
        templateUrl: "templates/newSellPosting.html",
        controller: 'NewSellPostingCtrl'
      }
    }
  })

  .state('app.singleBuyEntry', {
    url: "/singleBuy/:objectId",
    views: {
      'menuContent': {
        templateUrl: "templates/singleBuyEntry.html",
        controller: 'SingleBuyEntryCtrl'
      }
    }
  })

  .state('app.singleSellEntry', {
    url: "/singleSell/:objectId",
    views: {
      'menuContent': {
        templateUrl: "templates/singleSellEntry.html",
        controller: 'SingleSellEntryCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
}]);
