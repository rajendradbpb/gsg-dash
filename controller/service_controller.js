app.controller('service_controller',function($scope,ApiCall,NgTableParams){
    $scope.active_tab = "MAJOR";
    $scope.getAllServices = function(){
        $scope.services = {};
        ApiCall.getAllServices(function(response){
            $scope.services.serviceList = response.data;
            console.log($scope.services);
            $scope.tabChange("MAJOR");
        }, function(error){
            console.log(error);
        });
    };
    $scope.tabChange = function(tab){
         $scope.active_tab = tab;
        //  $scope.serviceList = [];
         if(!$scope.services[tab] || $scope.services[tab].length == 0){
            $scope.services[tab] = [];
             angular.forEach($scope.services.serviceList , function(item){
                if(item.category == tab){
                    $scope.services[tab].push(item);
                }
             });
         }
         
        $scope.serviceData = new NgTableParams;
                $scope.serviceData.settings({
                  dataset :$scope.services[tab] 
                }) 
         console.log($scope.services);
     };
});