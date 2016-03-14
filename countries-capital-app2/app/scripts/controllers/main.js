'use strict';

/**
 * @ngdoc function
 * @name countriesCapitalApp2App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the countriesCapitalApp2App
 */


gApp

.controller('CountriesCtrl', ['$rootScope','$scope','$state','ccCountries', 'ccCountry', function($rootScope,$scope,$state,ccCountries, ccCountry){
  //  $scope.test = "I'm in CountriesCtrl";
   // $scope.factoryTest = ccCountries.getTest();
  
    ccCountries.getCountries().then(function(data){
        //$scope.countryInfoList = data;
        $rootScope.countryInfoList = data;
    });
    
    $scope.selected = null;
    
    /*
    $scope.setSelected = function(response){       
        $scope.selectedRow = response;
        $scope.selected = $scope.selectedRow.countryName;
       // alert ('He clicked a country! ' + selectedRow.countryName);
       
       var countryCode = ($scope.selected === null) ? '' : $scope.selectedRow.countryCode;
        
        ccCountry.setCountryInfo($scope.selectedRow);
        
       $state.go('country', {
           country: countryCode
       });
    };
    */
    
}])


.controller('CountryCtrl',['$rootScope','$scope','$state', '$stateParams','ccCountry', 'ccNeighbors', function($rootScope,$scope, $state,$stateParams,ccCountry,ccNeighbors){
   //$scope.test = 'Now I am in CountryCtrl ';   
    $scope.countryCode = $stateParams.country;
   
    if ($rootScope.countryInfoList === undefined)
    {
        //this happens when user refreshes screen while in the Country page
        //so redirect to the countries page to pull call api again to refresh country list
        $state.go('countries');
    }
    else
    {
        $scope.currentCountryInfo = ccCountry.getCurrentCountryInfo($scope.countryCode);
        
        $scope.neighborCount = 0;
        
        ccCountry.getCountryWithCapitalInfo().then(function(response){
            if (response !== null && response.geonames.length > 0)
            {
                
                    $scope.currentCountryInfo.capitalInfo =  ccCountry.getCapitalInfo(response.geonames[0]);

                //get neighbors
                ccNeighbors.getNeighbors($scope.currentCountryInfo).then(function(response){
                    $scope.currentCountryInfo.neighborCountries = response.geonames; //contains totalResultsCount and geoname[] array
                    $scope.neighborCount = (response.geonames === undefined) ? 0 : response.geonames.length;
                });
                
            }

        });        
    }
  
   
   
}]);