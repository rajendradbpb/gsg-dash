app.controller("User_controller",function($scope,$state,$rootScope,MasterModel,NgTableParams,FormService,$stateParams,Util,$localStorage,UserService,$uibModal,MasterService,ApiCall){
    $scope.userList = {};
    $scope.active_tab = "BD";
    $scope.tabChange = function(tab){
        $scope.active_tab = tab;
    }
    $scope.createUserModal = function() {
      var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'view/modals/newUserModal.html',
          controller: "createUserModalCtrl",
          size: 'md',
          resolve: {
            getUsers : function(){
              return $scope.getAllUsers;
            }
          }
      });
    }
    $scope.getAllUsers = function(){
        ApiCall.getAllUsers(function(response){
            console.log(response);
                $scope.userList = response.data;
                $scope.userData = new NgTableParams;
                $scope.userData.settings({
                    dataset : $scope.userList
                })
        }, function(error){

        });
        
    };
    $scope.profileUpdate = function(form) {
      console.log('form' , form);
      $scope.user.dob = $scope.user.dob ? $scope.user.dob.getFullYear()+"-"+($scope.user.dob.getMonth()+1)+"-"+$scope.user.dob.getDate() : null ;
      console.log('user' , $scope.user);
      var status = FormService.validateForm(form,function(status,message){
        console.log('form 2' , status,message);
        Util.alertMessage("warning","Invalid data for "+message+" fields");
      })
    }
    $scope.createTicket = function(userData) {
        console.log(userData);
        $scope.ticket ={};
        $scope.ticket.userId = userData.userId;
        $scope.ticket.location = [0,0];
        $scope.ticket.serviceType = "EMERGENCY";
        ApiCall.createTicket($scope.ticket ,function(response){
            console.log(response);
            Util.alertMessage('success','Ticket Created successfully...');

        },function(error){
            console.log(error);
        });
    };

    $scope.getAllStates = function(){
        $scope.stateList = [];
        ApiCall.getAllStates(function(response){
            console.log(response);
            $scope.stateList = response.data;
        }, function(error){

        });
        
    };
    $scope.getDistrict = function(user){
        $scope.districtList = [];
        angular.forEach( $scope.stateList,function(item){
            if(item.stateName == user.address[0].state){
                $scope.districtList = item.districts;
                // vm.type = item.type;
            }
        });
    };
    $scope.user = {};
    $scope.getUserDetails = function(user_id){
        $scope.obj = {
            user_id :$stateParams.user_id
        }
        
        console.log($scope.obj);
        ApiCall.getUserById($scope.obj ,function(response){
            console.log(response);
            $scope.user = response.data;
            // get districtList based on state
            $scope.getDistrict($scope.user);
            console.log($scope.user);
            $scope.vehicleData = new NgTableParams;
            $scope.vehicleData.settings({
                dataset : $scope.user.userVehicles
            })
        },function(error){

        });
        

    };

    $scope.addVehicle = function(userData){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modals/new_vehicle.html',
            controller: 'vehicleModalController',
            size: 'md',
            resolve: {
              userId : function(){
                  return userData;
              }
            }
        });

    };
    $scope.showVehicleDetails = function(vehicleData){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modals/vehicleDetailsModal.html',
            controller: 'vehicleDetailsModalController',
            size: 'md',
            resolve: {
              vehicleData : function(){
                  return vehicleData;
              }
            }
        });

    };



});


app.controller('vehicleModalController',function($scope,$uibModalInstance,VehicleService,$stateParams,Util,ApiCall){

    $scope.insuranceArr = [true,false];
    $scope.insuranceTypeArr =["Comprehensive","Zero Depreciation","Third party only"];
    $scope.getVehicledata = function(){
        ApiCall.getVehicleMakeModal(function(response){
            console.log(response);
                $scope.vehicleDatas = response.data;
                $scope.makes = [];
                angular.forEach(response.data,function(item){
                    $scope.makes.push(item.make);
                })
                console.log($scope.makes);
        }, function(error){
            console.log(error);
        });
        

    };
    $scope.getModel = function(selectedModel){
        console.log("coming");
        console.log(selectedModel);

        console.log($scope.vehicleDatas);
        angular.forEach($scope.vehicleDatas,function(item){
            if(item.make == selectedModel){
                $scope.vehiclesLists = item.vehicles;
                $scope.vehicleModelList = [];
                angular.forEach(item.vehicles,function(vehicle){
                    $scope.vehicleModelList.push(vehicle.models);
                })
            }
        });
        console.log($scope.vehicleModelList);


    };
    $scope.getVehicleType = function(model){
        console.log(model);
        console.log($scope.vehiclesLists);
        angular.forEach($scope.vehiclesLists,function(item){
            if(item.models == model){
                $scope.type = item.type;
                $scope.subType = item.subType;
                $scope.wheels = item.wheels;
            }
        });
    };
    $scope.getMfgYear = function(){
        $scope.currentYear = 2018;
        $scope.mfgYearArr = [];
        for(i = 0;i< 30; i++ ){
            $scope.mfgYearArr.push($scope.currentYear--);
        }
        console.log($scope.mfgYearArr);
    };
     $scope.addVehicle = function(){
        $scope.vehicle.user_id = $stateParams.user_id;
        console.log($scope.vehicle.user_id);
        $scope.vehicle.vehicle = {
            make :$scope.vehicle.make,
            models : $scope.vehicle.model,
            subType : $scope.subType,
            type :  $scope.type,
            wheels : $scope.wheels
        }
        console.log($scope.vehicle);
        ApiCall.addVehicle($scope.vehicle , function(response){
            console.log(response);
              Util.alertMessage('success','Vehicle added successfully...');
        }, function(error){
            console.log(error);
              Util.alertMessage('danger','Vehicle is not added try again');
        });
        //  VehicleService.addVehicle( $scope.user_id).save($scope.vehicle,function(response){
        //     console.log(response);
        //     Util.alertMessage('danger','Vehicle added successfully...');

        //  },function(error){

        //      console.log(error);
        //      Util.alertMessage('danger','Vehicle is not added try again');
        //  });
         $uibModalInstance.close();
     };



      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
});

app.controller('vehicleDetailsModalController',function($scope,vehicleData,$uibModalInstance){

    $scope.getVehicleDetails = function(){
         $scope.vehicle =vehicleData;
      };

      $scope.ok = function () {
        // service call to update vihicle details
         $uibModalInstance.close();
       };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
});
// create user modal , used to create new user by ccare
app.controller('createUserModalCtrl',function($scope,$uibModalInstance,Util,ApiCall,getUsers){
      $scope.ok = function (user) {
        // service call to update vihicle details
        ApiCall.createUser(user,function(response) {
          Util.alertMessage("success","User created");
          getUsers();// calls parent function to update user listing
          $uibModalInstance.close();
        },function(error){
          Util.alertMessage("warning","Error in user creation");
          $uibModalInstance.close();
        })

       };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
});
