app.controller("TicketController",function($scope,$state,$rootScope,NgTableParams,Util,$uibModal,TicketService){
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
    }
    $scope.createTicket = function() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'view/modals/new_ticket.html',
        controller: 'addTicketModalController',
        size: 'md',
        // resolve: {
          
        // }
      });
    }
});


