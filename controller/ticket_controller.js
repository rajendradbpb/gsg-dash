app.controller("TicketController",function($scope,$state,$rootScope,NgTableParams,Util,$uibModal,TicketService,$stateParams,ApiCall){
  $scope.active_tab = "new";
  $scope.ticket = {};
  $scope.ticket.statuses = ['CREATED','EMERGENCY','RESOLVED','CLOSED'];
  $scope.ticket.serviceEngineer = ['Ricky','Subhra','Rajendra','Srikanta'];
  // function to get orders
    $scope.getOrders = function(){
      console.log("inside the method");
      $rootScope.showPreloader = true;
      //service to get all order list
      ApiCall.getOrders(function(response){
        $rootScope.showPreloader= false;
        console.log(response);
        $scope.orderList = response.data;
         $scope.orderData = new NgTableParams;
         $scope.orderData.settings({
           dataset : $scope.orderList
         })
      }, function(error){
        console.log(error);
      });
      
    };
    
  //function to get order details by orderid

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

    // function to get ticket lists
    $scope.getTickets = function(){
      
      $scope.obj={
        status : $stateParams.status
      };
      console.log("inside the method");
      $rootScope.showPreloader = true;
      //service to get all tickets
      ApiCall.getTickets($scope.obj,function(response){
        $rootScope.showPreloader= false;
        console.log(response);
        $scope.ticketList = response.data;
         $scope.ticketData = new NgTableParams;
         $scope.ticketData.settings({
           dataset : $scope.ticketList
         })

      }, function(error){
        console.log(error);

      });
    };
});
