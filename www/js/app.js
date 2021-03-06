// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers','app.services'])
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

/*
The config file sets up the routing for the app. 
Each "state" has an associated template to set up each view, 
a controller that will call functions relevant to that view,
set a URL for a subsystem, as well as any state params to send to
an email. */

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
          templateUrl: "templates/search.html",
          controller: 'SearchCtrl'

        }
      }
    })

    .state('app.conversations', {
      url: "/conversations",
      views: {
        'menuContent': {
          templateUrl: "templates/conversations.html",
          controller: 'ConversationsCtrl'
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
      }})

    .state('app.messaging', {
      cache: false,
      url: "/conversations/:conversationID",

      
      views: {
        'menuContent': {
          templateUrl: "templates/messaging.html",
          controller: 'MessagingCtrl'

        }
      }
    })

    .state('app.newPosting', {
      url: "/newPosting",
      views: {
        'menuContent': {
          templateUrl: "templates/newPosting.html",
          controller: 'NewPostingCtrl'
        }
      }
    })

    .state('app.singleEntry', {
      url: "/single/:objectId",
      views: {
        'menuContent': {
          templateUrl: "templates/singleEntry.html",
          controller: 'SingleEntryCtrl'
        }
      }
    })
    .state('app.editEntry', {
      url: "/singleEdit/:objectId",
      views: {
        'menuContent': {
          templateUrl: "templates/editEntry.html",
          controller: 'EditEntryCtrl'
        }
      }
    })

    .state('app.viewPostings', {
      url: "/viewPostings/:objectId",
      views: {
        'menuContent': {
          templateUrl: "templates/viewPostings.html",
          controller: 'ViewPostingsCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
}]);
