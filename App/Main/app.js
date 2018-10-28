(function () {
    'use strict';

    var app = angular.module('app', [
    ]);

})();

(function () {
    var controllerId = 'AppCtrl';
    angular
        .module('app')
        .controller(controllerId, [
            '$scope', '$rootScope', function ($scope, $rootScope) {
                $scope.from = 0;
                $scope.to = 0;
                $scope.isValid = false;

                //$scope.$on('onTimeSlotChanged', function (evt, data) {
                //    console.log("From:" + data.from + " to " + data.to + ", IsValid:" + data.isValid);
                //});

                $scope.handleTimeslotChanged = function (data) {
                    try {
                        console.log("From:" + data.from + " to " + data.to + ", IsValid:" + data.isValid);
                        $scope.from = angular.copy(data.from);
                        $scope.to = angular.copy(data.to);
                        $scope.isValid = angular.copy(data.isValid);
                        $scope.$apply();
                    } catch (e) {

                    }
                };
            }
        ]);
})();