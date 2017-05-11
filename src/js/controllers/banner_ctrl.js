APP.controller('BannerCtrl', ['$scope', '$element', '$window', '$timeout', function (S, E, Window, Timeout) {

    // this method calculate the height of client and set it for banner
    S.CalcHeight = function () {
        if (S.$parent.inputFocused) return;
        var height = angular.element(Window).innerHeight() - 200;
        $(E).css('height', height);
    }

    // Binds window resize to adjust the height of banner relative to the client height
    angular.element(Window).bind('resize', function () {
        S.CalcHeight();
    });

    // force a first init of banner hieght
    S.CalcHeight();

    // this Time out waits 300ms and then fade all childrens with class of FadeTo over 500ms
    Timeout(function () {
        $(E).find('.fadeTo').fadeIn(500);
    }, 300);

}]);