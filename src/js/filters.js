// this filter recives an string and a value which user is searching for
// then it tries to mark the characters of user input whitin the given string and
// returns new string 
// We use it for highlighting searched characters in the autocomplete list 
APP.filter('SearchInText', function () {
    return function (input, search) {
        var regEx = new RegExp(search, "ig");
        return input.replace(regEx, '<span class="search-character">' + search + '</span>');
    };
});

// This filter gets an input ( expected miliseconds) and converts it to
// minuts and seconds..
APP.filter('msToTrackTime', function () {
    return function (input) {
        var time = new Date(0,0,0,0,0,0,input); 
        var s = time.getSeconds();
        if (s < 10) s = '0' + s;
        var m = time.getMinutes();
        var h = time.getHours();
        if (h) m += h * 60;

        return m + ':' + s;
    };
});

// this filter make sure if an item title is longer than specific length of characters
// then it will sub str the input and add "..." and returns it.
APP.filter('itemTitle', function () {
    return function (input) {
        var maxlength = $(window).width() > 400 ? 32 : 16; 
        if (input.length > maxlength)
            input = input.slice(0, maxlength) + '...';
        return input;
    };
});

