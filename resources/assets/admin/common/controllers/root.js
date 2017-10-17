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



}])

.directive('validateregex', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.validateregex = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        if (viewValue) {
          
                var isValid = true;
                
				try {
				    new RegExp(viewValue);
				} catch(e) {
				    isValid = false;
				}

				return isValid;          
        }

        // it is invalid
        return false;
      };
    }
  };
});
