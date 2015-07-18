angular.module('app.controllers', [])

.controller('SingleSellEntryCtrl', ['$scope', '$stateParams',function($scope, $stateParams) {
  $scope.sellId = $stateParams.objectId;
}]);
