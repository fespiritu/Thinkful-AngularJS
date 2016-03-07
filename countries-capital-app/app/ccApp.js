var gApp = angular.module('ccApp',['ngRoute','ngAnimate','scrollable-table'])
 
 gApp
    .constant('CC_API_PREFIX','http://api.geonames.org/countryInfoJSON?username=fespiritu')
    .constant('CC_API_CAPITAL_URL', 'http://api.geonames.org/searchJSON?maxRows=1&username=fespiritu')
    .constant('CC_API_NEIGHBORS_URL','http://api.geonames.org/neighboursJSON?username=fespiritu')
    
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
    
    .constant('CC_API_KEY','')

    .factory('ccRequest',['$http','$q','CC_API_PREFIX', function($http,$q,CC_API_PREFIX){
        return function(params){
            var reqParams = angular.extend({}, params);
            return $http.get(CC_API_PREFIX, {params: reqParams})
                .then(function(response){
                    return $q.when(response.data);
                });
        };
    }])
    .factory('ccCountries',['$http','$q','CC_API_PREFIX', function($http,$q,CC_API_PREFIX){
        return function(){
           
            return $http.get(CC_API_PREFIX, {cache: true})
                .then(function(response){
                    return $q.when(response.data);
                });
        };
    }])
    //Was trying to pass CountryInfo object here but provider could not be found error
    .factory('ccCountry',['$rootScope','$http','$q','CC_API_CAPITAL_URL','$location',function($rootScope,$http,$q,CC_API_CAPITAL_URL,$location){
        return function(){
            if ($rootScope.CountryInfo === undefined)
                $location.path('/countries');
                
            var countryCode = '';
            var capital =  '';
            if ($rootScope.CountryInfo !== undefined)
            {
                countryCode = $rootScope.CountryInfo.countryCode;
                capital =  $rootScope.CountryInfo.capital;
            }
            var completePathWithCapital = CC_API_CAPITAL_URL + '&country=' + countryCode + '&name_equals=' + capital;
             
            return $http.get(completePathWithCapital, {cache: true})
                .then(function(response){
                    return $q.when(response.data);
                });
        };
               
    }])  
    .factory('ccNeighbors',['$rootScope','$http','$q', 'CC_API_NEIGHBORS_URL','$location', function($rootScope,$http,$q, CC_API_NEIGHBORS_URL,$location){
        return function(){
            if ($rootScope.CountryInfo === undefined)
                $location.path('/countries');
                
            var geonameId = ($rootScope.CountryInfo.geonameId === undefined) ? 0 : $rootScope.CountryInfo.geonameId;
            var completePathForNeighborOf =  CC_API_NEIGHBORS_URL + '&geonameId=' + geonameId;
            
            return $http.get(completePathForNeighborOf, {cache: true})
                .then(function(response){
                    return $q.when(response.data);
                })
            
        };
    }])
    .run(function($rootScope, $location, $timeout){
        $rootScope.$on('routeChangeError', function(){
            $location.path("/error");
        });
        $rootScope.$on('$routeChangeStart', function() {
            $rootScope.isLoading = true;
        });
        $rootScope.$on('$routeChangeSuccess', function(){
            $timeout(function(){
                $rootScope.isLoading = false;
            }, 1000);
        });
        
        
    })
    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/', {
            templateUrl: 'homeView/home.html',
            controller: 'HomeCtrl'
        }).when('/countries', {
            templateUrl: 'countriesView/countries.html',
            controller: 'CountriesCtrl'
            
        }).when('/countries/:country', {
            templateUrl: 'countryView/country.html',
            controller: 'CountryCtrl',
            resolve:{
                country: function(ccCountry,ccNeighbors, $route,$location,$rootScope){
                    var countryCodeCheck = ($rootScope.CountryInfo === undefined) ? '' : $rootScope.CountryInfo.countryCode;
                    
                    var country = $route.current.params.country;    //country is a countryCode (e.g. US)
                    if (ccCountry == undefined){
                        $location.path('/error');
                        return;
                    }
                    
                    if (country === countryCodeCheck)
                        return country;     //returns the value of the url variable, which is :country
                    else
                    {
                        //$rootScope.CountryInfo = {};    //click came from a neighbor hyperlink
                        $rootScope.CountryInfo.neighborCountryCode = country;
                        $location.path('/countries');   //force to back to the countries ctrl
                    }
                }
            }
        }).when('/error', {
            template: '<p>Error - Country not found.</p>'
        })
    }])
    .controller('HomeCtrl', ['$scope', function($scope){
        
    }])
   
    .controller('CountriesCtrl', function($rootScope,$scope, ccCountries, $timeout, $window,$location) {
       
       var CountryInfo = function(){
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
       var CapitalInfo = function(){
           
           this.adminCode1 = '';       //e.g. DC, used as an ID
           this.capital_toponymName = '';  //e.g. Washington, D.C.
           this.popCapital = 0;
           this.neighborCountries = [];
        }
        /***********************************/
        
        
      
            
        ccCountries().then (function(response){
            $scope.countryInfoList = response;
             
             $scope.selected  = null;
            $scope.setSelected = function(selectedRow){
                $rootScope.CountryInfo = null;
                $rootScope.CountryInfo = {};
                $rootScope.CountryInfo.capitalInfo = {};
                
                $scope.selected = ($scope.selected  === selectedRow.countryName) ? null : selectedRow.countryName;
                $scope.selectedRow = selectedRow;
                                
                var countryCode = ($scope.selected === null) ? '' : $scope.selectedRow.countryCode;
 
 
                //Save Country info for the Capital controller
                $rootScope.CountryInfo.isoAlpha3 = $scope.selectedRow.isoAlpha3;        //USA
                $rootScope.CountryInfo.popCountry = $scope.selectedRow.population;
                $rootScope.CountryInfo.countryName = $scope.selectedRow.countryName;
                $rootScope.CountryInfo.countryCode = $scope.selectedRow.countryCode;    //e.g. US
                $rootScope.CountryInfo.areaInSqKm = $scope.selectedRow.areaInSqKm;
                $rootScope.CountryInfo.capital = $scope.selectedRow.capital;
                $rootScope.CountryInfo.geonameId = $scope.selectedRow.geonameId;
                
                //$rootScope.CountryInfo.capitalInfo = new Capit
 
                $rootScope.CountryInfo.neighborCountryCode = '';    //clear after a click from neighbor
               $location.path('/countries/' + countryCode);
                
            }
            
            if ($rootScope.CountryInfo !== undefined
                && $rootScope.CountryInfo.countryCode !== undefined
                //&& $rootScope.CountryInfo.neighborCountryCode !== undefined
                && $rootScope.CountryInfo.neighborCountryCode !== '')
            {
                //redirect from country
                //get new country info from memory
                //I can't find a filter so use the for loop
                
                var neighborCountryCode = $rootScope.CountryInfo.neighborCountryCode;
                
                var selectedRow;
                for (var i = 0; i < $scope.countryInfoList.geonames.length; i++)
                {
                    selectedRow = $scope.countryInfoList.geonames[i];
                    if (selectedRow.countryCode  === $rootScope.CountryInfo.neighborCountryCode)
                        break;
                    
                }
                if (selectedRow !== undefined)
                {
                    $scope.selectedRow = selectedRow;
                    $scope.setSelected(selectedRow);
                    
                }
                //redirect to country link
                
            }
       
            
            
           
        });
        
        
       
    
    
    })
    .controller('CountryCtrl', ['$rootScope', '$scope','ccCountry','$location', 'country', 'ccNeighbors',function($rootScope,$scope,ccCountry,$location,country,ccNeighbors){
        //incoming country param is from the url
        
        var setCapitalInfo = function(geoname){
          // var capInfo = new CapitalInfo();
           
           //e.g. DC, used as an ID; capital can be blank so adminCode1 can be undefined
           //--set to blank then. e.g. Antartica (ATA)
           this.adminCode1 = (geoname.adminCode1 === undefined) ? '' : geoname.adminCode1;       
           this.capital_toponymName = geoname.toponymName;  //e.g. Washington, D.C.
           this.popCapital = geoname.population;
           
           return this;
        }
        //The incoming country is a variable from the URL
        ccCountry().then(function(response){
            $scope.geoname = response.geonames[0];
            $rootScope.CountryInfo.capitalInfo = setCapitalInfo($scope.geoname);
            
           //get neighbors
           ccNeighbors().then(function(response){
               $scope.CountryInfo.neighborCountries = response.geonames; //contains totalResultsCount and geoname[] array
               $scope.neighborCount = (response.geonames === undefined) ? 0 : response.geonames.length;
           });
           
           
          
            $scope.CountryInfo = $rootScope.CountryInfo;
            
          
        })
        
    }]);