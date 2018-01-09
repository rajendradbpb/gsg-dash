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
            controller: 'addVehicleModalController',
            size: 'md',
            resolve: {
              userId : function(){
                  return userData;
              }
            }
        });

    };



});
app.controller('addTicketModalController', function ($scope, $uibModalInstance,$timeout,Util,ServicesService,userI,$http,TicketService) {
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
                Util.alertMessage('alert','Ticket Created successfully...');


            },function(error){
                console.log(error);
            });
        }
        else{
            Util.alertMessage('alert','Please choose one service and vechile');
        }
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
});

app.controller('addVehicleModalController',function($scope,$uibModalInstance){
    $scope.ok = function () {
        $uibModalInstance.close();
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
});
