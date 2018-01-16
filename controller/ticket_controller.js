app.controller("TicketController",function($scope,$state,$rootScope,NgTableParams,Util,$uibModal,TicketService,$stateParams){
  $scope.active_tab = "new";

    $scope.getTickets = function(){
      console.log("inside the method");
      $rootScope.showPreloader = true;
      TicketService.getTickets().get(function(response){
        $rootScope.showPreloader= false;
        console.log(response);
       $scope.ticketList = response.data;
       $scope.ticketData = new NgTableParams;
       $scope.ticketData.settings({
         dataset : $scope.ticketList
       })
      },function(error){
        console.log(error);
      });
    };
    
//function to get ticket details by orderid

    $scope.ticketDetails =  function(){
      console.log("inside ticket details.");
      $scope.orderId=$stateParams.orderId;
      console.log($scope.orderId);
      TicketService.getTicketdetailsById($scope.orderId).get(function(response){
        console.log(response.data);
        $scope.orderDetails = response.data;
        $scope.vehicleData= response.data.orderDtls[0].product.usrVehicle;
        console.log($scope.vehicleData);

      },function(error){

      });

    };


});
