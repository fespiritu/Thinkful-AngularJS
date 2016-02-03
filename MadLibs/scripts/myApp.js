
var app = angular.module("myApp", []);

app.controller("MyCtrl", function($scope){
        $scope.gender="male";
        
          
    
        $scope.getGenderPrep = function(prep){
            var word;
            if ($scope.gender === "female"){
                if (prep === "his")
                    word = "her";
                else if (prep === "him")
                    word = "her";
                else if (prep === "he")
                    word = "she";
                else
                    word = "[unknown]";
                    
            }
            else
            {
                word = prep;
            }
            return word;
        }
        
        
});