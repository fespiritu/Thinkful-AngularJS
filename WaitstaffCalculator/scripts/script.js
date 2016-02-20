
angular.module('myApp',['ngRoute'])
    .run(function($rootScope, $location){
        $rootScope.$on('$routeChangeError', function(){
            $location.path('/');    //we want to go to index/home on error per requirement
        });
    })
    //.value('isExecuted',true)
    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/', {
            templateUrl: 'home.html',
            controller: 'HomeCtrl'
        }).when ('/new-meal', {
            templateUrl: 'new-meal.html',
            controller: 'NewMealCtrl'
        }).when ('/my-earnings',{
            templateUrl: 'my-earnings.html',
            controller: 'EarningsCtrl'
      /*
        }).when('/error',{
            template: '<p>Error - Page Not Found</p>'
     */
        }).otherwise ('/', {
            template: '<p>Error - Page Not Found</p>'
       
        });
    }])
    .controller('NewMealCtrl', function($rootScope, $scope){
        
        
        if ($rootScope.Meal === undefined)
            $rootScope.Meal = angular.copy($rootScope.master);
        
        if ($rootScope.Customer === undefined)    
            $rootScope.Customer = angular.copy($rootScope.CustomerMaster);
            
        if ($rootScope.EarningsInfo === undefined)
            $rootScope.EarningsInfo = angular.copy($rootScope.EarningsInfoMaster);
        
        
        
        function compute_tax_amount (amount,tax){
            var taxInt = tax/100;
            return amount * taxInt;
        }
        function compute_subtotal (amount, tax_amount){
            return amount + tax_amount;
        }
        function compute_tip (amount, tip_whole){
            var tip_pct = tip_whole/100;
            return amount * tip_pct;
        }
        
        function computer_total(){
            return $rootScope.Customer.subtotal + $rootScope.Customer.tip;
        }
        function compute_avg_tip_per_meal(tip_total_amount, meal_count){
            return tip_total_amount / meal_count;
        }
        
        $rootScope.submit = function(){
            
            if($scope.workForm.$valid)
            {
                //alert('Form submitted');
                //
                $rootScope.Meal.tax_amount = compute_tax_amount($rootScope.Meal.base_meal_price,$rootScope.Meal.tax_rate);
                //
                $rootScope.Customer.subtotal = compute_subtotal($rootScope.Meal.base_meal_price, $rootScope.Meal.tax_amount);
                $rootScope.Customer.tip = compute_tip($rootScope.Customer.subtotal, $rootScope.Meal.tip_whole);
                $rootScope.Customer.total = computer_total();
                //
                $rootScope.EarningsInfo.tip_total += $rootScope.Customer.tip;
                $rootScope.EarningsInfo.meal_count += 1;
                $rootScope.EarningsInfo.avg_tip_per_meal = compute_avg_tip_per_meal($rootScope.EarningsInfo.tip_total, $rootScope.EarningsInfo.meal_count);
            }
            else{
                alert('Invalid Form submitted');
            }
        }
        
        $rootScope.cancelMeal = function(){
            $rootScope.Meal = angular.copy($rootScope.master);
        }
        
    })
    .controller('EarningsCtrl', function($rootScope){
        
        $rootScope.reset = function(blnSetPristine){
            $rootScope.Meal = angular.copy($rootScope.master);
            $rootScope.Customer = angular.copy($rootScope.CustomerMaster);
            $rootScope.EarningsInfo = angular.copy($rootScope.EarningsInfoMaster);
            
            if (blnSetPristine === true){
                //$rootScope.Meal.tax_amount = 0;
                $rootScope.workForm.$setPristine();
            }
            else{   
                //user resets all                     
                
            }
        
        }
      
    })
    .controller('IndexCtrl', function($rootScope){
        
        
    })
    .controller('HomeCtrl', function($rootScope){
      //  $scope.message = $scope.EarningsInfoMaster.tip_total;
       // var isExecuted = null;
        
        // $scope.Meal.Tax_Amount = 1 * 3; // $scope.Meal.base_meal_price * $scope.Meal.tax_rate ;
      
        $rootScope.master = {
            base_meal_price: null,
            tax_rate: null,
            tip_whole: null,
            tax_amount: 0
        }
        
        
        $rootScope.CustomerMaster = {
            subtotal: 0,
            tip: 0,
            total: 0
        } 
        
        $rootScope.EarningsInfoMaster = {
            tip_total: 0,
            meal_count: 0,
            avg_tip_per_meal: 0
        }
        
   
       
       //$scope.reset(false);
        
      
    });
   