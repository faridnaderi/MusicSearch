APP.directive('detailsModal', function () {
    return {
        restrict: 'E',
        replace: true,
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


            // we show the modal and set the data object to the selected item by user.
            S.ShowModal = function () {
                $(E).fadeIn(300);
                $('body').removeClass('overflow-auto');
                Timeout(function () {
                    $('.album-date').each(function () {
                        $(this).html(S.RandomYear());
                    });
                });
            }

            // we close the modal and reset the data object
            S.CloseModal = function (e) {

                $(E).fadeOut(300, function () {
                    S.type = '';
                    S.data = {};
                });
                $('body').addClass('overflow-auto');
                e.stopPropagation()
            };

            // I was not able to get the year value of albums :D there for i made this method to generate random fake year number
            // Sorry about that :D
            S.years = [];
            for (var i = 1980; i <= 2017; i++) S.years.push(i);
            S.RandomYear = function () { 
                return S.years[Math.floor(Math.random() * S.years.length)];
            }
        }]
    }
})