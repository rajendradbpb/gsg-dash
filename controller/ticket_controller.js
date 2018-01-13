app.controller("TicketController",function($scope,$state,$rootScope,NgTableParams,Util,$uibModal,TicketService,$stateParams){
  $scope.active_tab = "new";
  $scope.tabChange = function(tab){
    $scope.active_tab = tab;
  }
    $scope.getTickets = function(){
      console.log("inside the method");
      TicketService.getTickets().get(function(response){
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
        $scope.data = response.data;
        $scope.vehicleData= response.data.orderDtls[0].product.usrVehicle;
        console.log($scope.vehicleData);

      },function(error){

      });

    };
    
   
});


