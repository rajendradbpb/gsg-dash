app.controller('service_controller',function($scope,ApiCall,NgTableParams){
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
            $scope.serviceArr = [];
            angular.forEach(response.data,function(item){
                if(item.category == serviceType){
                    $scope.serviceArr.push(item);
                }
            });
            console.log($scope.serviceArr);
            $scope.serviceData = new NgTableParams;
            $scope.serviceData.settings({
              dataset : $scope.serviceArr 
            })
        }, function(error){
            console.log(error);
        });
    };
});