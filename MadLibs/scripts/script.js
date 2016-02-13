
angular.module('myApp',['ngMessages'])
    .controller('ctrlInput', function($scope){
        $scope.IsValidEntry = false;
       
        $scope.master = {
            male_name: '',
            job_title: '',
            tedious_task: '',
            
            dirty_task: '',
            celebrity: '',
            useless_skill: '',
            
            obnoxiuous_celebrity: '',
            hugh_number: '',
            adjective: '',
        }
        
        $scope.reset = function( blnSetPristine){
           //$scope.genForm.$setPristine();
            $scope.user = angular.copy($scope.master);
            $scope.IsValidEntry = false;
            
           if (blnSetPristine === true)
           {
                $scope.genForm.$setPristine();
                       
           }
        }
        
        $scope.generateMadLibs = function  (){
            if ($scope.genForm.$valid)
            {
                $scope.IsValidEntry = true;
                
            }
            else{
                $scope.IsValidEntry = false;
               
            }
            
            
        }
        
        $scope.reset(false);
    });