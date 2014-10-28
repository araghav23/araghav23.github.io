/**
 * Created by rammagar on 10/11/2014.
 */


(function () {

    var ratingsApp = angular.module('ratingsApp', []);

    ratingsApp.controller('MoviesController', function ($scope, $http) {

        var moviesController = this;

        this.starRatings = [1, 2, 3, 4, 5];

        $http.get('json/movies.json')
            .then(function (res) {
                $scope.movies = res.data;
                moviesController.repaint();
            });

        this.repaint = function () {
            if ($scope.movies) //checking if 'movies' is loaded from json
            {
                var statsObject = [0, 0, 0, 0, 0, 0];
                for (var i = 0; i < $scope.movies.length; i++) {
                    if (moviesController.isMovieReleased($scope.movies[i].releaseDate))
                        statsObject[$scope.movies[i].rating]++;

                    $(function () {
                        $('#reviewStats').highcharts({
                            chart: {
                                type: 'column'
                            },
                            title: {
                                text: 'Statistics'
                            },
                            subtitle: {
                                text: 'Total Movies vs Ratings'
                            },
                            xAxis: {
                                categories: [
                                    '0',
                                    '1',
                                    '2',
                                    '3',
                                    '4',
                                    '5'
                                ]
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Total Movies'
                                }
                            },
                            tooltip: {
                                headerFormat: '<span style="font-size:10px"><b>{point.key} Ratings</b></span><table>',
                                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                    '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                                footerFormat: '</table>',
                                shared: true,
                                useHTML: true
                            },
                            plotOptions: {
                                column: {
                                    pointPadding: 0,
                                    borderWidth: 0
                                }
                            },
                            series: [
                                {
                                    name: 'Total Movies',
                                    data: statsObject
                                }
                            ]
                        });
                    });
                }
            }
        };


        this.isMovieReleased = function (date) {
            var today = new Date();
            var releaseDate = new Date(date);
            var isReleased = false;
            if (today > releaseDate)
                isReleased = true;

            return isReleased;
        };

        this.getNumericRating = function (rating, date) {
            return rating > 0 ? rating : (this.isMovieReleased(date) ? 'Not Rated' : 'Not Released');
        };

        this.getStarStyleClass = function (star, movieRating) {
            return star <= movieRating ? 'glyphicon glyphicon-star' : 'glyphicon glyphicon-star-empty';

        };

        this.getRating = function (rate, date) {
            if (this.isMovieReleased(date))
                return rate;
            else {
                alert('You are kidding....this movie is not yet released!!!');
                return 0;
            }
        };


        $scope.$watch('movies', moviesController.repaint, true);
    });


})();
