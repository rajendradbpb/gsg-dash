app.controller("TicketController",function($scope,$http,Constants,$state,$rootScope,MasterModel,NgTableParams,Util,$uibModal,TicketService,$stateParams,ApiCall,$localStorage){
  $scope.active_tab = "new";
  $scope.ticket = {};
  // $scope.ticket.statuses = [
  //   {label:"CREATED",disable:false },
  //   {label:"EMERGENCY",disable:false },
  //   {label:"RESOLVED",disable:false },
  //   {label:"CLOSED",disable:false },
  //   {label:"WIP",disable:false },
  //   {label:"CANCELLED",disable:false },
  //   ];
  $scope.ticket.serviceEngineer = ['Ricky','Subhra','Rajendra','Srikanta','CustomerSupport'];
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
    $scope.getLocationDetails = function(){
      var url = Constants.googleApi.replace(/{{latLng}}/g,$scope.orderDetails.orderDtls[0].product.location);
      $http.get(url).then(function(response) {
        $scope.orderDetails.locationDetails = response.data.results[0] ? response.data.results[0].formatted_address : "No Address available";
      },function(err){
        console.error(err);
      })
    }
    $scope.openMap = function() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'view/modals/locationModal.html',
        controller: "locationModalController",
        size: 'lg',
        resolve: {
          location: function() {
            return $scope.orderDetails.orderDtls[0].product.location;
          }
        }
      });
    }
    //function to get engineer list
    $scope.getEngineerList = function(){
      ApiCall.getEngineerList(function(response){
        console.log(response.data);
        $scope.engineersList = response.data;
        $scope.engineersListMaster = angular.copy($scope.engineersList);
        console.log( $scope.engineersList);
        // calling states
        MasterModel.getStates(function(states) {
          $scope.stateList = states;
        })
      } , function(error){
        console.log(error);
      });
    };
    // used to filter service engineer based on selected state and district
    $scope.filterEngineer = function(state,district){
      if(!state)
        return;
      console.log(state,district);

      var enggState = [];
      var enggDistrict = [];
      for(var i in $scope.engineersListMaster){
        if(state && $scope.engineersListMaster[i].seerviceArea.state && $scope.engineersListMaster[i].seerviceArea.state.toLocaleLowerCase() == state.stateCd.toLocaleLowerCase()){
          enggState.push($scope.engineersListMaster[i]);
        }
        if(district && $scope.engineersListMaster[i].seerviceArea.district && $scope.engineersListMaster[i].seerviceArea.district.toLocaleLowerCase() == district.toLocaleLowerCase()){
          enggDistrict.push($scope.engineersListMaster[i]);
        }
      }
      enggState = enggState.filter((v, i, a) => a.indexOf(v) === i);
      enggDistrict = enggDistrict.filter((v, i, a) => a.indexOf(v) === i);
      $scope.engineersList = intersection_destructive(enggState,enggDistrict,district);
    }
    function intersection_destructive(a, b,district)
    {
      var result = [];
      if(!district)
        return a;
      for(var i in b){
        if(a.indexOf(b[i])!= -1){
          result.push(b[i]);
        }
      }
      return result;
    }
    //funtion to update order status
    $scope.updateOrder = function() {
      $scope.orderUpdate ={};
      $scope.orderUpdate ={
        loginUserId :$localStorage.loggedin_user.userId,
        userId : $scope.orderDetails.userId,
        assignedQueue : $scope.orderDetails.assignedQueue,
        assignedToUserId : $scope.orderDetails.assignedToUserId,
        requestStatus : $scope.orderDetails.status==null ? $scope.orderDetails.requestStatus:$scope.orderDetails.status,
        orderId : $scope.orderDetails.orderId
      };
      console.log($scope.orderUpdate);
      ApiCall.updateOrder( $scope.orderUpdate , function(response){
        console.log(response.data);
        Util.alertMessage('success', ' Order status changed successfully..');
        $state.go("dashboard");
      }, function(error){
        console.log(error);
        Util.alertMessage('danger', 'Error in order assign...');
      });

    }
  //function to get order details by orderid

    $scope.getOrderdetailsById =  function(){
      console.log("inside order details.");
      $scope.obj = {
        orderId : $stateParams.orderId
      }
      console.log($scope.orderId);
      ApiCall.getOrderdetailsById($scope.obj , function(response){
        console.log(response);
        $scope.orderDetails = response.data;
        $scope.getLocationDetails();
        // update status dropdown
        // angular.forEach($scope.ticket.statuses,function(v,k) {
        //   if($scope.orderDetails.requestStatus == "RESOLVED" && v.label == "CLOSED") {
        //     v.disable = false;
        //   }
        //   else{
        //     v.disable = true;
        //   }
        // })
        $scope.vehicleData= response.data.orderDtls[0].product.usrVehicle;
          console.log($scope.vehicleData);
      }, function(error){
        console.log(error);
      });
      // TicketService.getTicketdetailsById($scope.orderId).get(function(response){
      //   console.log(response.data);
      //   $scope.orderDetails = response.data;
      //   $scope.vehicleData= response.data.orderDtls[0].product.usrVehicle;
      //   console.log($scope.vehicleData);

      // },function(error){

      // });

    };

    // returns true to disabe option , based on current request status
    // $scope.checkDisablity = function(statusValue,requestStatus){
    //   if(requestStatus == 'RESOLVED' && statusValue == "CLOSED"){
    //     return false;
    //   }
    //   else{
    //     return true;
    //   }


    // }
    // function to get ticket lists
    $scope.getOrderByStatus = function(){

      $scope.obj={
        status : $stateParams.status
      };
      console.log("inside the method");
      $rootScope.showPreloader = true;
      //service to get all tickets
      ApiCall.getOrderByStatus($scope.obj,function(response){
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
});
app.controller('locationModalController', function($scope, $uibModalInstance, location) {
  $scope.location = location;
  $scope.ok = function(user) {

  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});
