
angular.module('myApp',[])
    .controller('myCtrl', function($scope){
        
        
        
        
       // $scope.Meal.Tax_Amount = 1 * 3; // $scope.Meal.base_meal_price * $scope.Meal.tax_rate ;
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
            return $scope.Customer.subtotal + $scope.Customer.tip;
        }
        function compute_avg_tip_per_meal(tip_total_amount, meal_count){
            return tip_total_amount / meal_count;
        }
        $scope.master = {
            base_meal_price: null,
            tax_rate: null,
            tip_whole: null,
            tax_amount: 0
        }
        
        
        $scope.CustomerMaster = {
            subtotal: 0,
            tip: 0,
            total: 0
        } 
        
        $scope.EarningsInfoMaster = {
            tip_total: 0,
            meal_count: 0,
            avg_tip_per_meal: 0
        }
        
        
        
        $scope.submit = function(){
            if($scope.workForm.$valid)
            {
                //alert('Form submitted');
                //
                $scope.Meal.tax_amount = compute_tax_amount($scope.Meal.base_meal_price,$scope.Meal.tax_rate);
                //
                $scope.Customer.subtotal = compute_subtotal($scope.Meal.base_meal_price, $scope.Meal.tax_amount);
                $scope.Customer.tip = compute_tip($scope.Customer.subtotal, $scope.Meal.tip_whole);
                $scope.Customer.total = computer_total();
                //
                $scope.EarningsInfo.tip_total += $scope.Customer.tip;
                $scope.EarningsInfo.meal_count += 1;
                $scope.EarningsInfo.avg_tip_per_meal = compute_avg_tip_per_meal($scope.EarningsInfo.tip_total, $scope.EarningsInfo.meal_count);
            }
            else{
                alert('Invalid Form submitted');
            }
        }
        $scope.reset = function(blnSetPristine){
            $scope.Meal = angular.copy($scope.master);
            $scope.Customer = angular.copy($scope.CustomerMaster);
            $scope.EarningsInfo = angular.copy($scope.EarningsInfoMaster);
            
            if (blnSetPristine === true){
                //$scope.Meal.tax_amount = 0;
                $scope.workForm.$setPristine();
            }
            else{   
                //user resets all                     
                
            }
        
        }
        $scope.cancelMeal = function(){
            $scope.Meal = angular.copy($scope.master);
        }
        
        
        
        /*
        $scope.compute_subtotal = function (price, tax_amount){
            return price + tax_amount;
        }
        */
        
        
        $scope.reset(false);
    });