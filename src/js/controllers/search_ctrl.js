APP.controller('SearchCtrl', ['$scope', '$element', '$timeout', '$http', function (S, E, Timeout, Http) {

    S.searchOffset = 0;             // offset of search in Spotify request
    S.searchLimit = 20;             // number of items in each page in Spotify request
    S.viewMoreShow = false;         // controls weither view more button should be visible or not
    S.allData = [];
    S.oldSearchTerm = '';
    S.searchTerm = '';

    // this method makes an animation for banner at the begining of the page load
    // waits 600ms to remove vertical class from banner
    // then waits 400ms to remove small class from search input
    Timeout(function () {
        $(E).find('.fadeIn').removeClass('vertical');
        Timeout(function () {
            $(E).find('.search-input-container > .container > div').removeClass('small');
        }, 400);
    }, 600);


    S.autocompleteOpen = false;            // controls visibility of autocomplete list area

    // Show the autocomplete list area, with an slide down animation
    S.ShowAutocomplete = function () {
        if (!S.autocompleteOpen) {
            S.autocompleteOpen = true;
            Timeout(function () { $('.autocomplete').fadeIn(300).slideDown(300); }, 0);
        }
    }

    // Hide the autocomplete list area, with an slide up animation
    S.HideAutocomplete = function () {
        if (S.autocompleteOpen) {
            S.autocompleteOpen = false;
            Timeout(function () { $('.autocomplete').fadeOut(300).slideUp(300); }, 0);
        }
    }

    // On click over autocomplet items, we call the search method with the item value
    S.AutocompleteItemClicked = function (name) {
        S.searchTerm = name;
        S.Search();
    }

    // This method sends request to spotify api if user typed more than 2 characters in search input
    // if the response from API has items, it shows and create the auto complete list 
    // else it hides the autocomplete area if it was already open
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

    // I added an animation to banner whenever the search input get focused.
    S.InputFocused = function () {
        Timeout(function () {
            $('body').addClass('overflow-auto');
        }, 800);
        S.$emit("SearchInputFocused");
    }

    // Bind search method to the Enter key while typeing in search input field.
    S.InputKeyPressed = function (e) {
        if (e.which === 13) {
            S.Search();
            e.preventDefault();
        }
    }

    // This is a helper method and just for an example to shuffle the items returned from spotify request.
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


    // This is main search method, makes the query based on user input, offset and limit of the search  and sends to Spotify API
    // Recieves the response and fill the data object required for ng-repeat in search results area
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

    // On clicking View more button, we adjust the offset of the search and call the search method again
    S.ViewMore = function () {
        S.searchOffset++;
        S.Search();
    }

    // This method is being called when user clicks on an item after searched. to open the modal with details.
    S.ItemClicked = function (item) {
        S.$emit('ItemClicked', item);
    }
}]);
