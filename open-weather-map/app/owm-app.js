
angular.module('OWMApp',['ngRoute'])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/', {
            templateUrl: 'home.html',
            controller: 'HomeCtrl'
        }).when('/cities/:city', {
            templateUrl: 'city.html',
            controller: 'CityCtrl',
            resolve: {
                city: function(owmCities, $route, $location){
                    var city = $route.current.params.city;
                    if(owmCities.indexOf(city) === -1){
                        $location.path('/error');
                        return;
                    }
                    return city;
                }
            }
        }).when ('/error', {
            template: '<p>Error - Page Not Found</p'
        })
    }])
    .value('owmCities', ['Irvine','Huntington Beach','New York'])
    .controller('HomeCtrl', ['$scope', function($scope){
        $scope.city = 'Huntington Beach';
    }])
    .controller('CityCtrl', function($scope, city){
 
        if(city === 'Irvine')
        {
            $scope.city = 'Irvine, my new job city!';
        }
        else{
            $scope.city = city + '--sounds too far';
        }
        
    });