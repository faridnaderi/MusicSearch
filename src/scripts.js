var APP = angular.module("MusicSearchApp", ['ngSanitize']);

APP.controller('AppCtrl', ['$scope', '$timeout', '$window', function (S, Timeout, Window) { 
    S.inputFocused = false;
    S.$on("SearchInputFocused", function () {
        S.inputFocused = true;
        $('.banner').css('height', angular.element(Window).innerHeight() / 2 - 25);
    });
}]);

APP.controller('BannerCtrl', ['$scope', '$element', '$window', '$timeout', function (S, E, Window, Timeout) { 
    S.CalcHeight = function () {
        if (S.$parent.inputFocused) return;
        var height = angular.element(Window).innerHeight() -130; 
        $(E).css('height', height);
    }
    angular.element(Window).bind('resize', function () {
        S.CalcHeight();
    });
    S.CalcHeight();
    Timeout(function () {
        $(E).find('.fadeTo').fadeIn(500);
    }, 300);
     
}]);
  
APP.controller('SearchCtrl', ['$scope', '$element', '$timeout', '$http',  function (S, E , Timeout , Http) {
    Timeout(function () {
        $(E).find('.fadeIn').removeClass('vertical');
        Timeout(function () {
            $(E).find('.search-input-container > .container > div').removeClass('small');
        }, 400);
    }, 600);


    S.InputFocused = function () {
        Timeout(function () {
            $('body').addClass('overflow-auto');
        }, 800);
        S.$emit("SearchInputFocused");
    } 

    S.Shuffle = function (a) {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
        return a;
    }
    S.Search = function () {
        if (S.searchTerm) {
            Http.get("https://api.spotify.com/v1/search?q=" + S.searchTerm + "&type=album,artist").then(function (response) { 
                S.data = response.data;
                console.log(S.data);
                S.allData = S.Shuffle(S.data.albums.items.concat(S.data.artists.items));
            });
        }
    }

    S.ViewMore = function () {
        Http.get("https://api.spotify.com/v1/search?q=" + S.searchTerm + "&type=album,artist&offset=20").then(function (response) {
            //S.data = response.data;
            var temp = S.Shuffle(response.data.albums.items.concat(response.data.artists.items));
            S.allData = S.allData.concat(temp);
        });
    }
}]);