/**
 * Created by rammagar on 10/11/2014.
 */


(function () {

    var ratingsApp = angular.module('ratingsApp', []);

    ratingsApp.controller('MoviesController', function ($scope, $http) {

        var moviesController = this;

        this.starRatings = [1, 2, 3, 4, 5];

        //loading json
        $http.get('json/movies.json')
            .then(function (res) {
                $scope.movies = res.data;
                moviesController.repaint();
            });


        // watched repaint method to update stats and graph accordingly
        this.repaint = function () {
            if ($scope.movies) //checking if 'movies' is loaded from json
            {
                var statsObject = [0, 0, 0, 0, 0, 0];
                for (var i = 0; i < $scope.movies.length; i++) {
                    if (moviesController.isMovieReleased($scope.movies[i].releaseDate))
                        statsObject[$scope.movies[i].rating]++;
                    moviesController.reviewsChart.series[0].setData(statsObject);
                }
            }
        };


        this.reviewsChart = new Highcharts.Chart({
            chart: {
                renderTo: 'reviewStats',
                type: 'column',
                options3d: {
                    enabled: true,
                    alpha: 15,
                    beta: 15,
                    depth: 50
                }
            },
            title: {
                text: 'Statistics'
            },
            subtitle: {
                text: 'Total Movies vs Ratings'
            },
            xAxis: {
                gridLineWidth: 0,
                minorGridLineWidth: 0,
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
                allowDecimals: false,
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                title: {
                    text: 'Total Movies'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px"><b>{point.key} Ratings</b></span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:0f} </b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 0,
                    depth: 25
                }
            },
            series: [
                {
                    name: 'Total Movies',
                    data:[]
                }
            ]
        });

        // check if movie is released ...used in setting the star color and also in displaying
        this.isMovieReleased = function (date) {
            var today = new Date();
            var releaseDate = new Date(date);
            var isReleased = false;
            if (today > releaseDate)
                isReleased = true;

            return isReleased;
        };

        //return Not released: if movie is not release, Not Rated: if rating is zero, else original rating
        this.getNumericRating = function (rating, date) {
            return rating > 0 ? rating : (moviesController.isMovieReleased(date) ? 'Not Rated' : 'Not Released');
        };

        // return style of the class based on the movie rating - empty star or filled star
        this.getStarStyleClass = function (star, movieRating) {
            return star <= movieRating ? 'glyphicon glyphicon-star' : 'glyphicon glyphicon-star-empty';

        };

        //
        this.getRating = function (rate, date) {
            if (moviesController.isMovieReleased(date))
                return rate;
            else {
                //TODO : have to replace this with bootstrap alert
               alert('Are you kidding..?? This movie is not yet released !!!!');
               return 0;
            }
        };

        // watch for changes in movies and invoke repaint method to update the graph
        $scope.$watch('movies', moviesController.repaint, true);
    });


})();