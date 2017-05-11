var APP = angular.module("MusicSearchApp", ['ngSanitize']);

APP.controller('AppCtrl', ['$scope', '$timeout', '$window', function (S, Timeout, Window) { 
    S.inputFocused = false;
    S.$on("SearchInputFocused", function () {
        S.inputFocused = true;
        $('.banner').css('height', angular.element(Window).innerHeight() / 2 -70);
    });

    S.$on('ItemClicked', function (e, item) { S.$broadcast('ItemClickedToModal', item); });
}]);


