app.controller("User_controller", function($scope, $state, $rootScope, MasterModel, NgTableParams, FormService, $stateParams, Util, $localStorage, UserService, $uibModal, MasterService, ApiCall) {
  $scope.userList = {};
  $scope.active_tab = "BD";

  $scope.tabChange = function(tab) {
    $scope.active_tab = tab;
  }
  $scope.createUserModal = function() {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'view/modals/newUserModal.html',
      controller: "createUserModalCtrl",
      size: 'md',
      resolve: {
        getAllUsers: function(){
          return $scope.getAllUsers;
        }
      }
    });
  }
  $scope.getAllUsers = function() {
    ApiCall.getAllUsers(function(response) {
      console.log(response);
      $scope.userList = response.data;
      $scope.userData = new NgTableParams;
      $scope.userData.settings({
        dataset: $scope.userList
      })
    }, function(error) {

    });

  };
  //function to get user list by role
  $scope.getUserByRole = function() {
    var obj = {
      role: $stateParams.role
    };
    //service to get user by role
    console.log("obj", obj);
    ApiCall.getUserByRole(obj, function(response) {
      console.log(response.data);

      $scope.userLists = response.data;
      $scope.userDatas = new NgTableParams;
      $scope.userDatas.settings({
        dataset: $scope.userLists
      })
    }, function(error) {

      console.log(error);

    });

  };
  $scope.profileUpdate = function(form) {
    console.log('form', form);

    console.log('user', $scope.user);
    var status = FormService.validateForm(form, function(status, message) {
      if (!status) {
        console.log('form 2', status, message);
        Util.alertMessage("warning", "Invalid data for " + message + " fields");
      } else {
        $scope.user.dob = moment($scope.user.dob).format('YYYY-MM-DD');
        $scope.user.anniversaryDate = moment($scope.user.anniversaryDate).format('YYYY-MM-DD');
        ApiCall.updateUserById($scope.user, function(response) {
          console.log(response);
          Util.alertMessage('success', 'User Details Updated successfully...');
        }, function(error) {
          console.log(error);
          if(error.status == 417){
            Util.alertMessage('danger', error.data.message);
          }
          else{
          Util.alertMessage('danger', 'User Details Cannot be updated...');
          }
        });
      }
    })
  }
  // $scope.createTicket = function(userData) {
  //     console.log(userData);
  //     $scope.ticket ={};
  //     $scope.ticket.userId = userData.userId;
  //     $scope.ticket.location = [0,0];
  //     $scope.ticket.serviceType = "EMERGENCY";
  //     ApiCall.createTicket($scope.ticket ,function(response){
  //         console.log(response);
  //         Util.alertMessage('success','Ticket Created successfully...');

  //     },function(error){
  //         console.log(error);
  //     });
  // };
  $scope.addOrderModal = function(userData) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'view/modals/new_ticket.html',
      controller: 'orderModalController',
      size: 'md',
      resolve: {
        userData: function() {
          return userData;
        }
      }
    });

  };

  $scope.getAllStates = function(address) {
    $scope.stateList = [];
    MasterModel.getStates(function(err, states) {
      if (err) {
        Util.alertMessage('danger', 'Error in getting states');
        $scope.stateList = [];
        return;
      }
      $scope.stateList = states;
      $scope.stateList = states;
      for (var i in $scope.stateList) {
        if (address.state && $scope.stateList[i].stateCd.toLocaleLowerCase() == address.state.toLocaleLowerCase()) {
          address.stateObj = $scope.stateList[i];
        }
      }
    })
  };
  $scope.getDistrict = function(user) {
    $scope.districtList = [];
    angular.forEach($scope.stateList, function(item) {
      if (item.stateName == user.address[0].state) {
        $scope.districtList = item.districts;
        // vm.type = item.type;
      }
    });
  };
  $scope.user = {};
  $rootScope.$on("vehicleData",function(events,data){
    $scope.getUserDetails();
  });
  $scope.getUserDetails = function() {
    $scope.obj = {
      user_id: $stateParams.user_id
    };
    var domyData = {
      houseNbr: '',
      locality: '',
      city: '',
      state: '',
      district: '',
      country: '',
      zip: ''
    };

    console.log($scope.obj);
    ApiCall.getUserById($scope.obj, function(response) {
      console.log(response);
      $scope.user = response.data;
      // $scope.user.dob = new Date(dob);
      // get districtList based on state
      $scope.getDistrict($scope.user);
      console.log($scope.user);
      if ($scope.user.address.length == 0) {
        $scope.user.address.push(domyData);
      };
      $scope.vehicleData = new NgTableParams;
      $scope.vehicleData.settings({
        dataset: $scope.user.userVehicles
      })

      console.log($scope.user.address);
      angular.forEach($scope.user.schemes, function(item) {
        item.validityLeft = item.durationInDays - (moment().diff(moment(item.subscriptionDt), 'days'));
      });
    }, function(error) {

    });


  };
  $scope.getOrderByUser = function() {
    $scope.orderHistoryList = [{
        type: 'LIVE',
        data: []
      },
      {
        type: 'FUTURE',
        data: []
      },
      {
        type: 'COMPLETED',
        data: []
      },
      {
        type: 'CANCELLED',
        data: []
      }
    ];
    var obj = {
      user_id: $stateParams.user_id
    };
    ApiCall.getOrderByUser(obj, function(response) {

      angular.forEach(response.data, function(item) {
        if (item.requestStatus == "CLOSED") {
          $scope.orderHistoryList[2].data.push(item);
        } else if (item.requestStatus == "CANCELED") {
          $scope.orderHistoryList[3].data.push(item);
        } else {
          if (moment(item.serviceDate) > moment()) {
            $scope.orderHistoryList[1].data.push(item);
          } else {
            $scope.orderHistoryList[0].data.push(item);
          }
        }
      });
      console.log("list", $scope.orderHistoryList);
    }, function(error) {
      console.log(error);
    });

  };

  $scope.addVehicle = function(userData) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'view/modals/new_vehicle.html',
      controller: 'vehicleModalController',
      size: 'md',
      resolve: {
        userId: function() {
          return userData;
        },
        getUserDetails : function(){
          return $scope.getUserDetails;
        }
      }
    });

  };
  $scope.showVehicleDetails = function(vehicleData) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'view/modals/vehicleDetailsModal.html',
      controller: 'vehicleDetailsModalController',
      size: 'md',
      resolve: {
        vehicleData: function() {
          return vehicleData;
        }
      }
    });

  };



});


app.controller('vehicleModalController', function($scope, $uibModalInstance, VehicleService, MasterModel, $stateParams, Util, ApiCall,getUserDetails) {

  $scope.insuranceArr = [true, false];
  $scope.insuranceTypeArr = ["Comprehensive", "Zero Depreciation", "Third party only"];
  $scope.getVehicledata = function() {
    // ApiCall.getVehicleMakeModal(function(response){
    //     console.log(response);
    //         $scope.vehicleDatas = response.data;
    //         $scope.makes = [];
    //         angular.forEach(response.data,function(item){
    //             $scope.makes.push(item.make);
    //         })
    //         console.log($scope.makes);
    // }, function(error){
    //     console.log(error);
    // });
    MasterModel.getAllVehicles(function(err, results) {
      if (err) {
        return Util.alertMessage('danger', err);
      }
      $scope.vehicleDatas = results;
      $scope.makes = [];
      angular.forEach(results, function(item) {
        $scope.makes.push(item.make);
      })
    });

  };
  $scope.getModel = function(selectedModel) {
    console.log("coming");
    console.log(selectedModel);

    console.log($scope.vehicleDatas);
    angular.forEach($scope.vehicleDatas, function(item) {
      if (item.make == selectedModel) {
        $scope.vehiclesLists = item.vehicles;
        $scope.vehicleModelList = [];
        angular.forEach(item.vehicles, function(vehicle) {
          $scope.vehicleModelList.push(vehicle.models);
        })
      }
    });
    console.log($scope.vehicleModelList);


  };
  $scope.getVehicleType = function(model) {
    console.log(model);
    console.log($scope.vehiclesLists);
    angular.forEach($scope.vehiclesLists, function(item) {
      if (item.models == model) {
        $scope.type = item.type;
        $scope.subType = item.subType;
        $scope.wheels = item.wheels;
      }
    });
  };
  $scope.getMfgYear = function() {
    $scope.currentYear = 2018;
    $scope.mfgYearArr = [];
    for (i = 0; i < 30; i++) {
      $scope.mfgYearArr.push($scope.currentYear--);
    }
    console.log($scope.mfgYearArr);
  };
  $scope.addVehicle = function() {
    $scope.vehicle.user_id = $stateParams.user_id;
    console.log($scope.vehicle.user_id);
    $scope.vehicle.vehicle = {
      make: $scope.vehicle.make,
      models: $scope.vehicle.model,
      subType: $scope.subType,
      type: $scope.type,
      wheels: $scope.wheels
    };
    $scope.vehicle.expiryDate = moment($scope.vehicle.expiryDate).format('YYYY-MM-DD');
    console.log($scope.vehicle);
    ApiCall.addVehicle($scope.vehicle, function(response) {
      console.log(response);
      $uibModalInstance.close();
      Util.alertMessage('success', 'Vehicle added successfully...');
      // $scope.$emit("vehicleData",response.data);
      getUserDetails();
    }, function(error) {
      console.log(error);
      $uibModalInstance.close();
      if(error.status == 417){
        Util.alertMessage('danger', error.data.message);
      }
      else{
      Util.alertMessage('danger', 'Vehicle is not added try again');
      }
    });
  };



  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});

app.controller('vehicleDetailsModalController', function($scope, $uibModalInstance, vehicleData) {
  $scope.vehicleData = vehicleData;
  $scope.ok = function() {
    // service call to update vihicle details
    $uibModalInstance.close();
  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});
// create user modal , used to create new user by ccare
app.controller('createUserModalCtrl', function($scope, $uibModalInstance, Util, ApiCall, MasterModel,getAllUsers) {
  $scope.userRole = ['ROLE_USER', 'ROLE_ENGINEER', 'ROLE_OPERATION'];
  $scope.stateList = [];
  MasterModel.getStates(function(err,states) {
    if (err) {
      Util.alertMessage('danger', 'Error in getting states');
      $scope.stateList = [];
      return;
    }
    $scope.stateList = states;
    $scope.stateList = states;
  })
  $scope.getDistrict = function(state) {
    $scope.districtList = [];
    angular.forEach($scope.stateList, function(item) {
      if (item.stateCd == state) {
        $scope.districtList = item.districts;
        // vm.type = item.type;
      }
    });
  };

  $scope.newUser = {};

  $scope.ok = function() {


    console.log($scope.newUser);
    //   $scope.newUser.roles = $scope.newUser.roles
    var req = angular.copy($scope.newUser);
    req.roles = [req.roles];
    // service call to update vihicle details
    ApiCall.createUser(req, function(response) {
      Util.alertMessage("success", "User created");
      console.log(response.data);
      $uibModalInstance.close();
      getAllUsers();
    }, function(error) {
      $uibModalInstance.close();
      if(error.status == 417){
        Util.alertMessage("danger", error.data.message);
      }
      else{
      Util.alertMessage("danger", "Error in user creation");
      }
    })

  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});
//new order modal
app.controller('orderModalController', function($scope, $uibModalInstance, Util, MasterModel, ApiCall, userData, $state) {
  $scope.userdata = userData;
  $scope.extVehicle = {};
  $scope.getVehicledata = function() {

    // ApiCall.getVehicleMakeModal(function(response){
    //     console.log(response);
    //         $scope.vehicleDatas = response.data;
    //         $scope.makes = [];
    //         angular.forEach(response.data,function(item){
    //             $scope.makes.push(item.make);
    //         })
    //         console.log($scope.makes);
    // }, function(error){
    //     console.log(error);
    // });
    MasterModel.getAllVehicles(function(err, results) {
      if (err) {
        return Util.alertMessage('danger', err);
      }
      $scope.vehicleDatas = results;
      $scope.makes = [];
      angular.forEach(results, function(item) {
        $scope.makes.push(item.make);
      })
      console.log($scope.makes);
    });

  };
  // $scope.getModel = function(selectedModel){
  //     console.log("coming");
  //     console.log(selectedModel);
  //
  //     console.log($scope.vehicleDatas);
  //     angular.forEach($scope.vehicleDatas,function(item){
  //         if(item.make == selectedModel){
  //             $scope.vehiclesLists = item.vehicles;
  //             $scope.vehicleModelList = [];
  //             angular.forEach(item.vehicles,function(vehicle){
  //                 $scope.vehicleModelList.push(vehicle.models);
  //             })
  //         }
  //     });
  //     console.log($scope.vehicleModelList);
  //
  //
  // };
  // $scope.getVehicleType = function(model){
  //     console.log(model);
  //     console.log($scope.vehiclesLists);
  //     angular.forEach($scope.vehiclesLists,function(item){
  //         if(item.models == model){
  //             $scope.type = item.type;
  //             $scope.subType = item.subType;
  //             $scope.wheels = item.wheels;
  //         }
  //     });
  // };
  $scope.placeChanged = function() {
    $scope.place = this.getPlace();
    console.log('location', $scope.place.geometry.location);
    $scope.map.setCenter($scope.place.geometry.location);
  }

  
  $scope.ticket = {};
  $scope.ok = function() {

    console.log($scope.userdata.userId);
    // $scope.ticket.vehicle ={};
    $scope.ticket.userId = $scope.userdata.userId;
    $scope.ticket.location = [0, 0];
    $scope.ticket.serviceType = "EMERGENCY";
    var req = {};
    if ($scope.newVehicle) {
      req.usrVehicle = {
        vehicle: $scope.ticket.extVehicle.selectedModel
      };
      req.userId = $scope.ticket.userId;
      req.location = $scope.ticket.location;
      req.serviceType = $scope.ticket.serviceType;
      req.useUserScheme = $scope.ticket.useUserScheme;
    } else {
      req = $scope.ticket;
    }
    console.log(JSON.stringify(req));
    delete req['extVehicle']; // removing extra parameter
    ApiCall.createOrder(req, function(response) {
      console.log(response.data.orderId);
      Util.alertMessage("success", "Order Created successfully..");
      $state.go('ticketDetails', {
        orderId: response.data.orderId
      });
      $uibModalInstance.close();
    }, function(error) {
      console.log(error);
      $uibModalInstance.close();
      if(error.status == 417){
        Util.alertMessage("danger", error.data.message);
      }
      else{
      Util.alertMessage("danger", "Error in order creation.");
      }
    });

  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});
