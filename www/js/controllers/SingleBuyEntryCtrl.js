angular.module('app.controllers', [])

.controller('SingleBuyEntryCtrl', ['$scope', '$stateParams',function($scope, $stateParams) {
  $scope.buyId = $stateParams.objectId;
}]);