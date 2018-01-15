app.controller('service_controller',function($scope,ApiCall){
    $scope.active_tab = "major";
    $scope.tabChange = function(tab){
      $scope.active_tab = tab;
    };
    //function to get all services
    $scope.getAllServices = function(serviceType){

        $scope.serviceType = serviceType;
        console.log($scope.serviceType);
        // service to get all services
        ApiCall.getAllServices(function(response){
            console.log(response);
        }, function(error){
            console.log(error);
        });
    };
});