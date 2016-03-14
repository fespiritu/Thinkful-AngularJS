'use strict';

/**
 * @ngdoc overview
 * @name countriesCapitalApp2App
 * @description
 * # countriesCapitalApp2App
 *
 * Main module of the application.
 */

 /*
    -----------
    CAPITAL:
    http://api.geonames.org/searchJSON?maxRows=1&username=fespiritu
    http://api.geonames.org/searchJSON?maxRows=1&username=fespiritu&country=US&name_equals=Washington
    
    Taking the capital information:
    
    Note: parameter values below taken from the country list
    -----
    
    name_equals=<capital>   (e.g. Washington)
    country=<countryCode>   (e.g. US)
    
    The results will return more than one--so take the first in the list since I found no unique
     id.
     
     -----------------
     NEIGHBORS:
     http://api.geonames.org/neighbours?username=fespiritu&geonameId=6252001
     
     geonameId = <geonameId of country>     (e.g. 2658434 for Switzerland, 6252001 for US )
     &geonameId=2658434
     - Returns multiple countries--use the countryName of each
     - Create dynamic url using the capital URL to return that 1 neighbor country/capital
    
    -----------------
    MAP
    
    http://www.geonames.org/img/country/250/??.png
    where ?? is the upper case countryCode--e.g. US
    /??.png
    
    --
    http://www.geonames.org/flags/x/??.gif
    /??.gif
    where ?? is the lowever case countryCode--e.g. us
    
    */
var gApp = angular
  .module('countriesCapitalApp2App', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'scrollable-table'
  ]);

gApp
    .constant('CC_API_PREFIX','http://api.geonames.org/countryInfoJSON?username=fespiritu')
    .constant('CC_API_CAPITAL_URL', 'http://api.geonames.org/searchJSON?maxRows=1&username=fespiritu')
    .constant('CC_API_NEIGHBORS_URL','http://api.geonames.org/neighboursJSON?username=fespiritu')
 
 
 .run(function($rootScope){
     
     /*
       var gCountryInfo = function(){
            this.isoAlpha3 = '';
            this.popCountry = '';
            this.countryName = '';
            this.countryCode = '' ;
            this.areaInSqKm = 0;
            this.capital = '';
            this.geonameId = 0;
            this.neighborCountryCode = '';  //should be filled when clicking on  a neighbor.
            
            this.capitalInfo = {};    //defined in Capital controller
       }
       var gCapitalInfo = function(){
           
           this.adminCode1 = '';       //e.g. DC, used as an ID
           this.capital_toponymName = '';  //e.g. Washington, D.C.
           this.popCapital = 0;
           this.neighborCountries = [];
        }
       
        $rootScope.CountryInfo = {};
        $rootScope.CapitalInfo = {};
      */
 })
gApp.config(function($stateProvider, $urlRouterProvider){
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
    .state('home',{
        url: '/home',
        templateUrl: '../views/main.html'
    })
    
    .state('countries', {
        url: '/countries',
        templateUrl: '../views/countries.html',
        controller: 'CountriesCtrl'
    })
    
    .state('country', {
        url: '/countries/:country',
        templateUrl: '../views/country.html',
        controller: 'CountryCtrl'
    })
    
});