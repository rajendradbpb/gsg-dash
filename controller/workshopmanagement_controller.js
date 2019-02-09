app.controller("workshop_controller", function ($scope, $state, $rootScope, MasterModel, NgTableParams, FormService, $stateParams, Util, $localStorage, UserService, $uibModal, MasterService, CONFIG,$http,ApiCall) {
    $scope.workshopList = {};
    $scope.workshopByStatusList = [];
    $scope.user = {};
    $scope.status = $stateParams.status;
    $scope.demoDocument = {};
    $scope.demoDocumentArr = [];

    $scope.addDemoDocument = function(){
        $scope.demoDocument.udatedBy = $localStorage.loggedin_user.userId;
        $scope.demoDocumentArr.push($scope.demoDocument);
        $scope.demoDocument = {};
    }
    $scope.removeDemoDocument = function(index){
        $scope.demoDocumentArr.splice(index,1);
        console.log( $scope.demoDocumentArr);
    }
    $scope.updateWorkshopDocument = function(){
        var obj = {
            wsDocs : [],
            id:$scope.user.userId
        } 
        if($scope.user.wsDocs && $scope.user.wsDocs.length > 0){
            obj.wsDocs = $scope.user.wsDocs;
        }
        if($scope.demoDocumentArr.length > 0){
            angular.forEach($scope.demoDocumentArr , function(item){
                obj.wsDocs.push(item);
            })
        }
        // ApiCall.updateWSDocs(obj, function (response) {
        //     console.log(response.data);
        // }, function (error) {

        // });
        // return $resource(CONFIG.HTTP_HOST_APP+"/gsg/api/users/ws/updateDocs/"+$scope.user.userId, obj.wsDocs, {
        //     update: {method: 'PUT'}
        //   }).success(function(data) {
        //       alert(1)
        //   })
        //   .success(function(data) {
        //       alert(1)
        //   })
        $http.put(CONFIG.HTTP_HOST_APP+"/gsg/api/users/ws/updateDocs/"+$scope.user.userId, obj.wsDocs)
        .then(function(data) {
            Util.alertMessage('info','document updated');
        }, function(err) {
            Util.alertMessage('error','Error in document update');
            console.log('Error in document update'+err);
        });

    }
    $scope.loadWorkshopList = function () {
        var obj = {
            role: "ROLE_WORK_SHOP"
        };
         $scope.status = $stateParams.status;
        console.log(status);
        $rootScope.showPreloader = true;
        ApiCall.getUserByRole(obj, function (response) {
            $rootScope.showPreloader = false;
            $scope.workshopList = response.data;
            if($scope.status != "all"){
                angular.forEach($scope.workshopList, function (item) {
                    if (item.wsStatus && item.wsStatus.toLowerCase() == $scope.status.toLowerCase()) {
                        $scope.workshopByStatusList.push(item);
                    }
                })
            }
            if($scope.status == "all"){
                $scope.workshopByStatusList = $scope.workshopList;
            }
            
            angular.forEach($scope.workshopByStatusList, function (item) {
                var fname = item.firstName ? item.firstName : " ";
                var lname = item.lastName ? item.lastName : " ";
                var mname = item.middleName ? item.middleName : " ";
                item.name = fname + "  " + mname + " " + lname;
            })
            console.log($scope.workshopByStatusList);
            $scope.userDatas = new NgTableParams;
            $scope.userDatas.settings({
                dataset: $scope.workshopByStatusList
            })
        }, function (error) {
            $rootScope.showPreloader = false;
            console.log(error);
        });
    }
    $scope.getWorkshopDetails = function () {
        $scope.obj = {
            user_id: $stateParams.id
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
        ApiCall.getUserById($scope.obj, function (response) {
            $scope.user = response.data;
            $scope.getDistrict($scope.user);
            $scope.districtList.push($scope.user.serviceArea.district);
            if ($scope.user.address.length == 0) {
                $scope.user.address.push(domyData);
            };
            console.log($scope.user);
        }, function (error) {

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
    $scope.getDistrict = function (state) {
        $scope.districtList = [];
        angular.forEach($scope.stateList, function (item) {
            if (item.stateCd == state) {
                $scope.districtList = item.districts;
                // vm.type = item.type;
            }
        });
    };

})
