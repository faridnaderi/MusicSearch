var APP = angular.module("MusicSearchApp", ['ngSanitize']);

APP.controller('AppCtrl', ['$scope', '$timeout', '$window', function (S, Timeout, Window) { 
    S.inputFocused = false;
    S.$on("SearchInputFocused", function () {
        S.inputFocused = true;
        $('.banner').css('height', angular.element(Window).innerHeight() / 2 -70);
    });

    S.$on('ItemClicked', function (e, item) { S.$broadcast('ItemClickedToModal', item); });
}]);

APP.controller('BannerCtrl', ['$scope', '$element', '$window', '$timeout', function (S, E, Window, Timeout) { 
    S.CalcHeight = function () {
        if (S.$parent.inputFocused) return; 
        var height = angular.element(Window).innerHeight() -  200 ; 
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
  
APP.controller('SearchCtrl', ['$scope', '$element', '$timeout', '$http', function (S, E, Timeout, Http) {

    S.searchOffset = 0;
    S.searchLimit = 20;
    S.viewMoreShow = false;
    S.allData = [];
    S.oldSearchTerm = '';
    S.searchTerm = '';
    Timeout(function () {
        $(E).find('.fadeIn').removeClass('vertical');
        Timeout(function () {
            $(E).find('.search-input-container > .container > div').removeClass('small');
        }, 400);
    }, 600);
    S.autocompleteOpen = false;
    S.ShowAutocomplete = function () {
        if (!S.autocompleteOpen) {
            S.autocompleteOpen = true;
            Timeout(function () { $('.autocomplete').fadeIn(300).slideDown(300); }, 0);
        }
    }
    S.HideAutocomplete = function () { 
        if (S.autocompleteOpen) {
            S.autocompleteOpen = false;
            Timeout(function () { $('.autocomplete').fadeOut(300).slideUp(300); }, 0);
        } 
    }
    S.InputChanging = function () {
        if (S.searchTerm.length >= 3) {
            Http.get("https://api.spotify.com/v1/search?q=" + S.searchTerm + "&type=album,artist&limit=10").then(function (response) {
                
                S.autocompleteList = S.Shuffle(response.data.albums.items.concat(response.data.artists.items));
                if (S.autocompleteList.length > 0) {
                    S.ShowAutocomplete();
                } else S.HideAutocomplete();
            });
        } else S.HideAutocomplete();
    }

    S.InputFocused = function () {
        Timeout(function () {
            $('body').addClass('overflow-auto');
        }, 800);
        S.$emit("SearchInputFocused");
    } 
    S.InputKeyPressed = function (e) {
        if (e.which === 13) {
            S.Search();
            e.preventDefault();
        }
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
    S.AutocompleteItemClicked = function (name) {
        S.searchTerm = name;
        S.Search();
    }
    S.Search = function () {
        if (!S.inputFocused)
            S.InputFocused();
        S.HideAutocomplete();
        if (S.searchTerm) {
            Http.get("https://api.spotify.com/v1/search?q=" + S.searchTerm + "&type=album,artist&offset=" + (S.searchOffset * S.searchLimit) + "&limit=" + S.searchLimit).then(function (response) { 
                S.data = response.data; 
                if (S.data.albums.next || S.data.artists.next) { 
                    S.viewMoreShow = true;
                }
                var temp = S.data.albums.items.concat(S.data.artists.items);

                if (S.searchTerm !== S.oldSearchTerm)
                    S.allData = [];

                S.allData = S.allData.concat(S.Shuffle(temp));
                S.oldSearchTerm = S.searchTerm;
            });
            
        }
    }

    S.ViewMore = function () {
        S.searchOffset++;
        S.Search();
    }

    S.ItemClicked = function (item) {
        S.$emit('ItemClicked', item);
    }
}]);

APP.filter('SearchInText', function () { 
    return function (input, search) {
        var regEx = new RegExp(search, "ig");
        return input.replace(regEx,'<span class="search-character">'+search+'</span>');
    };
});
APP.filter('msToTrackTime', function () {
    return function (input) {
        var time = new Date(input);
        var s = time.getSeconds();
        if (s < 10) s = '0' + s;
        var m = time.getMinutes(); 

        return m + ':' + s;
    };
});
APP.filter('itemTitle', function () {
    return function (input) { 
        var maxlength = $(window).width > 400 ? 32 : 16;
        if (input.length > maxlength)
            input = input.slice(0, maxlength) + '...';
        return input;
    };
});

APP.directive('detailsModal', function () {
    return {
        restrict: 'E',
        replace:true,
        templateUrl: 'views/details-modal.html', 
        controller: ['$scope', '$element', '$http', '$timeout', function (S, E, Http, Timeout) {
            S.type = '';
            S.$on('ItemClickedToModal', function (e, item) { 
                S.item = item;
                var url = item.type === 'artist' ? 'https://api.spotify.com/v1/artists/' + item.id + '/albums?offset=0&limit=50' : item.href;
                Http.get(url).then(function (response) { 
                    S.data = response.data;
                    S.ShowModal();
                });
               
            });

            S.ShowModal = function () {
                $(E).fadeIn(300);
                $('body').removeClass('overflow-auto');
                Timeout(function(){
                    $('.album-date').each(function () { 
                        $(this).html(S.RandomYear());
                    });
                });
            }
            S.CloseModal = function (e) {

                $(E).fadeOut(300, function () {
                    S.type = '';
                    S.data = {};
                });
                $('body').addClass('overflow-auto');
                e.stopPropagation()
            };
            S.years = [];
            for (var i = 1980; i <= 2017; i++) S.years.push(i);
            S.RandomYear = function () {
               
                return S.years[Math.floor(Math.random() * S.years.length)];
            }
        }]
    }
})