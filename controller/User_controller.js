app.controller("User_controller",function($scope,$state,$rootScope,NgTableParams,Util,$localStorage,UserService,$uibModal){
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
    $scope.updateUserModal = function(userData){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modals/updateUser.html',
            controller: 'User_controller',
            size: 'md',
            resolve: {
                userUpdate: function () {
                    return userData;
                }
               
            }
        });
    };
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
   
});
app.controller('addTicketModalController', function ($scope, $uibModalInstance,ApiCall,$timeout,Util,ServicesService,userId) {
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
      $scope.serviceArray = [];
      angular.forEach($scope.repeatArr, function(items){
        if(items.isSelect){
          $scope.serviceArray.push(items);
        }
      });
      console.log( $scope.serviceArray);
      console.log("$scope.ticket   ",$scope.ticket);
      // service call to save ticket
      ApiCall.createTicket($scope.ticket,function(response) {
        Util.alertMessage("success","Ticket created");
        $timeout(function(){
          $uibModalInstance.close($scope.selected.item);
        },2000)
      },function(err) {
        Util.alertMessage("warning","ticket creation failed")
      })
      
    };
  
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
