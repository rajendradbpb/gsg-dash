app.controller("TicketController",function($scope,$http,Constants,$state,$rootScope,MasterModel,NgTableParams,Util,$uibModal,TicketService,$stateParams,ApiCall,$localStorage){
  $scope.active_tab = "new";
  $scope.ticket = {};
  $scope.orderDetails = {};
  $scope.insuranceValidOption = [

  ];
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
      var latlng =[$scope.orderDetails.orderDtls[0].product.location.lat,$scope.orderDetails.orderDtls[0].product.location.lng];
      var url = Constants.googleApi.replace(/{{latLng}}/g,latlng);
      $http.get(url).then(function(response) {
        $scope.orderDetails.locationDetails = response.data.results[0] ? response.data.results[0].formatted_address : "No Address available";
      },function(err){
        console.error(err);
      })
    }
    $scope.checkVehicleData = function(vehicleMake){
      $scope.orderDetails.hasVehicleData = vehicleMake ? true : false;
    }
    $scope.getAllVehicles = function(){
      MasterModel.getAllVehicles(function(err,result){
        if(err){
          $scope.orderDetails.vehicles = [];
          Util.alertMessage('danger','Error in Getting vehicle list');
          console.error(err);
          return;
        }
        $scope.orderDetails.vehicles = result;
      })
    };

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
        MasterModel.getStates(function(err,states) {
          if(err){
            Util.alertMessage('danger','Error in getting states');
            $scope.stateList = [];
            return;
          }
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
        if(state && $scope.engineersListMaster[i].serviceArea.state && $scope.engineersListMaster[i].serviceArea.state.toLocaleLowerCase() == state.stateCd.toLocaleLowerCase()){
          enggState.push($scope.engineersListMaster[i]);
        }
        if(district && $scope.engineersListMaster[i].serviceArea.district && $scope.engineersListMaster[i].serviceArea.district.toLocaleLowerCase() == district.toLocaleLowerCase()){
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
    $scope.updateStatus = function(updateStatus) {
      console.log($scope.orderDetails.status,$scope.orderDetails.state,$scope.orderDetails.district,$scope.orderDetails.assignedToUserId);
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
        if(error.status == 417){
          Util.alertMessage('danger', error.data.message);
        }
        else{
          Util.alertMessage('danger', 'Error in order assign...');
        }

      });

    };
    //function to get mfgArr
    $scope.getMfgYear = function() {
      $scope.currentYear = 2018;
      $scope.mfgYearArr = [];
      for (i = 0; i < 30; i++) {
        $scope.mfgYearArr.push($scope.currentYear--);
      }
      console.log($scope.mfgYearArr);
    };
    //used to update total order
    $scope.updateOrderDetails = function(orderDetails){
      if(!orderDetails.orderDtls[0].product.usrVehicle.expiryDate || orderDetails.orderDtls[0].product.usrVehicle.expiryDate == "Invalid Date"){
        delete orderDetails.orderDtls[0].product.usrVehicle['expiryDate'];
      }
      else{
        orderDetails.orderDtls[0].product.usrVehicle.expiryDate = moment(orderDetails.orderDtls[0].product.usrVehicle.expiryDate).format('YYYY-MM-DD');

      }
      orderDetails.orderDtls[0].product.orderDtlId = orderDetails.orderDtls[0].id;
      ApiCall.updateOrderDetails(  orderDetails.orderDtls[0].product , function(response){
        console.log(response.data);
        Util.alertMessage('success', ' Order  update successfully..');
        //$state.go("dashboard");
        $state.reload();
      }, function(error){
        console.log(error);
        if(error.status == 417){
          Util.alertMessage('danger', error.data.message);
        }
        else{
          Util.alertMessage('danger', 'Error in Order  update');
        }

      });
    }
  //function to get order details by orderid

    $scope.getOrderdetailsById =  function(){
      console.log("inside order details.");
      $scope.obj = {
        orderId : $stateParams.orderId
      }
      ApiCall.getOrderdetailsById($scope.obj , function(response){
        console.log(response);
        $scope.orderDetails = response.data;
        $scope.getLocationDetails();
        $scope.checkVehicleData($scope.orderDetails.orderDtls[0].product.usrVehicle.vehicle.make);
        $scope.getAllVehicles();
        $scope.orderDetails.insuranceTypeArr = ["Comprehensive", "Zero Depreciation", "Third party only"];
        $scope.orderDetails.insuranceValidArr = [
          {key:true,value:"Yes"},
          {key:false,value:"No"}
        ];
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
        // checking for insurance valid
        // if(!$scope.orderDetails.hasVehicleData){
        //   $scope.orderDetails.orderDtls[0].product.usrVehicle.insuranceValid = '0';
        // }
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
    // function to disable assign part
    $scope.checKUser = function(){
      if( ($scope.orderDetails.assignedToUserId !="") && ($scope.orderDetails.ccUserId)){
        console.log('here in if');
       if($scope.orderDetails.ccUserId != $localStorage.loggedin_user.userId){
         return true;
       }
      }
      else
      {
        console.log("here in else");
        return false;
      }

    }
    //function for auto complete location box
    $scope.placeChanged = function() {
      $scope.place = this.getPlace();
      console.log('location', $scope.place.geometry.location.lat(),$scope.place.geometry.location.lng());
      $scope.orderDetails.orderDtls[0].product.location = {
        lat : $scope.place.geometry.location.lat(),
        lng : $scope.place.geometry.location.lng()
      };
      
      
      // $scope.map.setCenter($scope.place.geometry.location);
    }
    //function to remove service from order
    $scope.removeOrder={};
    $scope.removeServiceFromOrder = function(orderId,index,service){
      $scope.removeOrder={
        orderDtlId:orderId,
        position:index
      };
      console.log($scope.removeOrder);
      ApiCall.removeServiceFromOrder($scope.removeOrder,function(response){
        Util.alertMessage('success',`Service ${service} removed successfully`);
        $state.reload();
      }, function(error){
        console.log(error);
        Util.alertMessage('danger','Service is not removed,try again');
      })
    }


    //function to open feedback modal
    $scope.feedbackModal = function() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'view/modals/feedbackModal.html',
        controller: "feedbackModalCtrl",
        size: 'md',
        resolve: {
          orderDetails : function(){
            return  $scope.orderDetails;
          }
        }
      });
    }
});
app.controller('locationModalController', function($scope, $uibModalInstance, location) {
  $scope.location = location;
  $scope.ok = function(user) {

  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});

app.controller('feedbackModalCtrl', function($scope, $uibModalInstance,orderDetails,$localStorage,ApiCall, Util) {
  $scope.feedback ={};
  $scope.feedback.rating=0;
  $scope.rateFunction = function(rating) {
    console.log('Rating selected: ' + rating);
  };

  $scope.ok = function() {
    $scope.feedback.orderId=orderDetails.orderId;
    $scope.feedback.submitterUserId =  $localStorage.loggedin_user.userId;
    console.log($scope.feedback);
    // service to take feedback
    ApiCall.takeFeedback($scope.feedback, function(response){
      console.log(response);
      $uibModalInstance.close();
      Util.alertMessage("success","Feedback taken successfully..");
    }, function(error){
      console.log(error);
      $uibModalInstance.close();
      if(error.status == 417){
        Util.alertMessage("danger",error.data.message);
      } else{
        Util.alertMessage("danger","Error occured in feedback taking process");
      }

    });

  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});
