
angular.module('myApp',[])
    .controller('myCtrl', function($scope,$http,$q){
        
     $scope.httpError = '';
     $scope.notifySearchingMsg = '';
     
     
    
     $scope.SearchFlickr = function() {
         
         var tag = $scope.search_tag;
         $scope.search_tag = '';
        
         var config = {
                
               // method: 'flickr.photos.search',
               // api_key: 'f9791ef32ee97c1ddce53c2a7941a7b8',
                tags: tag,
               // format: 'json',
               // nojsoncallback: 1
            }
            // alert('config: ' + req.url);
     
         $scope.httpError = '';
         $scope.notifySearchingMsg = "Searching Instagram for photos logged with '" + tag + "'";
         
         //$scope.httpError = 'Error in searching ' + tag;
         
         $http.get('https://api.flickr.com/services/rest/?method=flickr.photos.search&tags=' + tag + '&api_key=f9791ef32ee97c1ddce53c2a7941a7b8&format=json&nojsoncallback=1'
         
         )
         .then(function(response){
             $scope.images = response.data;
             var count = $scope.images.photos.total;
             alert ('count: ' + count);
             
             $scope.notifySearchingMsg = "We found " + count + " results for '" +  tag + "'";
         }, function error(response){
             $scope.httpError = 'Error in searching ' + tag + '<br/>' + response;
         }
         
       );
         
     }
     
        
    });