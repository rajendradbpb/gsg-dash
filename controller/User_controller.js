app.controller("User_controller",function($scope,$state,$rootScope,NgTableParams,$stateParams,Util,$localStorage,UserService,$uibModal,MasterService){
    $scope.userList = {};
    $scope.active_tab = "BD";
    $scope.tabChange = function(tab){
        $scope.active_tab = tab;
    }
    $scope.getAllUsers = function(){
        UserService.getAllUsers().get(function(response){
            console.log(response);
            $scope.userList = response.data;
            $scope.userData = new NgTableParams;
            $scope.userData.settings({
                dataset : $scope.userList
            })
        },function(error){

        });
    };
    // $scope.updateUserModal = function(userData){
    //     var modalInstance = $uibModal.open({
    //         animation: true,
    //         templateUrl: 'view/modals/updateUser.html',
    //         controller: 'User_controller',
    //         size: 'md',
    //         resolve: {
    //             userUpdate: function () {
    //                 return userData;
    //             }

    //         }
    //     });
    // };
    $scope.createTicket = function(userData) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'view/modals/new_ticket.html',
          controller: 'addTicketModalController',
          size: 'md',
          resolve: {
            userId : function(){
                return userData;
            }
          }
        });
    };

    $scope.getAllStates = function(){
        $scope.stateList = [];
        MasterService.getAllStates().get(function(response){
            console.log(response);
            $scope.stateList = response.data;
        },function(error){
            console.log(error);
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
    $scope.isCollapsed= false;
    $scope.getUserDetails = function(user_id){
        $scope.user_id = $stateParams.user_id;
        console.log($scope.user_id);
        UserService.getUsersById($scope.user_id).get(function(response){
            // console.log(response);
            $scope.user = response.data;
            // get districtList based on state
            $scope.getDistrict($scope.user);
            console.log($scope.user);
            console.log($scope.user.address[0].zip);
            console.log($scope.user.address[0].district);
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
    $scope.vehicleDetails = function(userData){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modals/vehicleDetails.html',
            controller: 'vehicleModalController',
            size: 'md',
            resolve: {
              userId : function(){
                  return userData;
              }
            }
        });

    };
    


});
app.controller('addTicketModalController', function ($scope, $uibModalInstance,$timeout,Util,ServicesService,userId,$http,TicketService) {
    $scope.userdata = userId;
    $scope.createTicket = {};

    $scope.selectScheme = function(subType){
        console.log("coming");
        console.log(subType);
        $scope.schemeList = [];
        angular.forEach($scope.userdata.schemes, function(item){
            if(item.schemeType == subType){
                $scope.schemeList.push(item);
            }
        });
        console.log($scope.schemeList);
    }
    $scope.getSelectedServices = function(serviceType){
        ServicesService.getAllServices().get(function(response){
            console.log(response);
            $scope.ServiceArr = [];
            angular.forEach(response.data,function(item){
                if(item.category == serviceType){
                    $scope.ServiceArr.push(item);
                }
            });
            console.log($scope.ServiceArr);
        },function(error){
            console.log(error);
        });
    };

    $scope.ticket = {};
    $scope.ok = function () {
        console.log('coming')
      //service call to create a ticket
      console.log($scope.userdata.userId);
        $scope.ticket.userId = $scope.userdata.userId;
        $scope.ticket.location = [20.2897321,85.8469173];
        $scope.ticket.services=[];
        angular.forEach($scope.ServiceArr,function(service){
            if(service.isSelect){
                $scope.ticket.services.push(service.serviceId);
            }
        });
        console.log( $scope.ticket);
        if( $scope.ticket.services.length > 0 && $scope.ticket.vehicle)
        {
            TicketService.createTicket().save($scope.ticket,function(response){
                console.log(response);
                Util.alertMessage('danger','Ticket Created successfully...');


            },function(error){
                console.log(error);
            });
        }
        else{
            Util.alertMessage('danger','Please choose one service and vechile');
        }
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
});

app.controller('vehicleModalController',function($scope,$uibModalInstance,VehicleService,$stateParams,Util){
    
    $scope.insuranceArr = [true,false];    
    $scope.insuranceTypeArr =["edfes","Comprehensive","Zero Depreciation","Third party only"];
    $scope.getVehicledata = function(){
        VehicleService.getVehicleMakeModel().get(function(response){
            console.log(response);
            $scope.vehicleDatas = response.data;
            $scope.makes = [];
            angular.forEach(response.data,function(item){
                $scope.makes.push(item.make);
            })
            console.log($scope.makes);
        },function(error){
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
    }


    $scope.ok = function () {
        $uibModalInstance.close();
      };

      $scope.addVehicle = function(){
        $scope.user_id = $stateParams.user_id;
        console.log($scope.user_id);
        $scope.vehicle.vehicle = {
            make : $scope.vehicle.make,
            models : $scope.vehicle.model,
            subType : $scope.subType,
            type :  $scope.type,
            wheels : $scope.wheels
        }
        console.log($scope.vehicle);
         VehicleService.addVehicle( $scope.user_id).save($scope.vehicle,function(response){
            console.log(response);
            Util.alertMessage('danger','Vehicle added successfully...');
             
         },function(error){
              
             console.log(error);
             Util.alertMessage('danger','Vehicle is not added try again');
         });
         $uibModalInstance.close();
     };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
});

