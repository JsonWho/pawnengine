'use strict';

angular.module('pawnengine_admin').controller('rootController',['$scope','$http','$mdDialog', function($scope, $http, $mdDialog) {

var vm = this;

  $scope.showConfirm = function(ev, title) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title(title)
          .ariaLabel('Delete Input')
          .targetEvent(ev)
          .ok('OK')
          .cancel('Cancel');

    return $mdDialog.show(confirm);

}



}]);
