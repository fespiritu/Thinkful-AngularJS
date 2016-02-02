
/* THIS DOESN'T WORK SOMEHOW. POSSIBLY HIDDEN CHARS LIKE TAB OR SPACES
angular.module('myApp', [])
    .controler('MyCtrl', function($scope){
       
    });
 */   


angular.module('myApp', [])
    .controller('MyCtrl', function($scope){
    
});

/* FROM COURSE PLNKR--WORKS
angular.module('myApp', [])
		.controller('MyCtrl', function( $scope) {
		 // $scope.version = '2.1';
	  });
      
  */