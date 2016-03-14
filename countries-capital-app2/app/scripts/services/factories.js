gApp


.factory('ccCountries',['$http','$q','CC_API_PREFIX', function($http,$q,CC_API_PREFIX){
    
 
    return {
        getCountries: function(){
        
        return $http.get(CC_API_PREFIX, {cache: true})
            .then(function(response){
                return $q.when(response.data);
            });
        
        },

 
        getTest: function(){
            return 'from ccCountries factory';
        }
    };//end return
     
}])

.factory('ccCountry', ['$rootScope','$http','$q', 'CC_API_CAPITAL_URL','ccCountries', function($rootScope,$http,$q, CC_API_CAPITAL_URL,ccCountries){
    
    var currentCountryInfo = {};
   // var currentCapitalInfo = {};
    
    return{
        setCountryInfo: function(data){
           
            currentCountryInfo.isoAlpha3 = data.isoAlpha3;        //USA
            currentCountryInfo.popCountry = data.population;
            currentCountryInfo.countryName = data.countryName;
            currentCountryInfo.countryCode = data.countryCode;    //e.g. US
            currentCountryInfo.areaInSqKm = data.areaInSqKm;
            currentCountryInfo.capital = data.capital;
            currentCountryInfo.geonameId = data.geonameId;
            
            //$rootScope.CountryInfo.capitalInfo = new Capit

            currentCountryInfo.neighborCountryCode = '';    //clear after a click from neighbor
            currentCountryInfo.neighborCountries = {};
            //currentCapitalInfo.capitalInfo = {};
            currentCountryInfo.capitalInfo = {};
            
          //  currentCountryInfo.capitalInfo = this.getCapitalInfo(data);
        },
        
        getCurrentCountryInfo: function(countryCode){
                        
            var apiCountryRow = this.getCountryFromList(countryCode);  
            this.setCountryInfo(apiCountryRow);    //transfer data into DTO object
            
            return currentCountryInfo;
        },
        
         getCapitalInfo: function(geoname){
          // var capInfo = new CapitalInfo();
           
           //e.g. DC, used as an ID; capital can be blank so adminCode1 can be undefined
           //--set to blank then. e.g. Antartica (ATA)
           currentCountryInfo.capitalInfo.adminCode1 = (geoname.adminCode1 === undefined) ? '' : geoname.adminCode1;       
           currentCountryInfo.capitalInfo.capital_toponymName = geoname.toponymName;  //e.g. Washington, D.C.
           currentCountryInfo.capitalInfo.popCapital = geoname.population;
           
           return currentCountryInfo.capitalInfo;
        },
        
        getCountryWithCapitalInfo: function(){
            
            var countryCode = '';
            var capital =  '';
            if (currentCountryInfo !== undefined)
            {
                countryCode = currentCountryInfo.countryCode;
                capital =  currentCountryInfo.capital;
            }
            var completePathWithCapital = CC_API_CAPITAL_URL + '&country=' + countryCode + '&name_equals=' + capital;
             
            return $http.get(completePathWithCapital, {cache: true})
                .then(function(response){
                    return $q.when(response.data);
                });
        },
        
        getCountryFromList: function(desiredCountryCode) {
            //$rootScope.countryInfoList.geonames must have the list of countries already
            
            var selectedRow;
            for (var i = 0; i < $rootScope.countryInfoList.geonames.length; i++)
            {
                selectedRow = $rootScope.countryInfoList.geonames[i];
                if (selectedRow.countryCode  === desiredCountryCode)
                    break;
                
            }
            return selectedRow;
            //redirect to country link
                
            
        },
        
                
        
        
    };  //end return
    
}])

.factory('ccNeighbors',['$http','$q', 'CC_API_NEIGHBORS_URL', function($http,$q, CC_API_NEIGHBORS_URL){

    return {
        getNeighbors: function(countryInfo){
          //  if (countryInfo === undefined)
           //     return null;
                
            var geonameId = (countryInfo.geonameId === undefined) ? 0 : countryInfo.geonameId;
            var completePathForNeighborOf =  CC_API_NEIGHBORS_URL + '&geonameId=' + geonameId;
            
            return $http.get(completePathForNeighborOf, {cache: true})
                .then(function(response){
                    return $q.when(response.data);
                })
        }
        
    };  //end return
}])