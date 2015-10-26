angular.module('SSFAlerts', [])
.service('SSFAlertsService', ['$ionicPopup', function ($ionicPopup) {
    var service = this;
}]);
service.showAlert = function(title, body)
{
    var alertPopup = $ionicPopup.alert({
        title: title,
        template: body
    });
    alertPopup.then();
};
service.showAlert = function(title, body)
{
    var alertPopup = $ionicPopup.alert({
        title: title,
        template: body
    });
    alertPopup.then();
};
