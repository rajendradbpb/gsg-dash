app.controller("Office_Controller", function($scope,ApiCall,MasterModel,Util,$state,$stateParams,NgTableParams){
    $scope.officeDetails ={};
    $scope.newAddress = {};
    $scope.districtList = [];
    //function to get office details
    $scope.getOfficeDetails =function(){
        ApiCall.getOfficeDetails(function(response){
            console.log(response.data);
            $scope.officeDetails = response.data;
            angular.forEach($scope.officeDetails, function(item){
                $scope.districtList.push(item.address.district);
            });
        $scope.officeData = new NgTableParams;
        $scope.officeData.settings({
            dataset: $scope.officeDetails
        })
        }, function(error){
    
        });
    }
    //
    $scope.stateList = [];
    // MasterModel.getStates(function(err,states) {
    //   if (err) {
    //     Util.alertMessage('danger', 'Error in getting states');
    //     $scope.stateList = [];
    //     return;
    //   }
    //   $scope.stateList = states;
    //   $scope.stateList = states;
    // })
    $scope.getAllStates = function(){
        ApiCall.getAllStates(function(response){
            $scope.stateList = response.data;
        }, function(error){
    
        });
    };
    
    $scope.getDistrict = function(state) {
      $scope.districtList = [];
      angular.forEach($scope.stateList, function(item) {
        if (item.stateCd == state) {
          $scope.districtList = item.districts;
        
        }
      });
    };
    //function to post office details
    $scope.saveNewOfficeAddress = function(){
        console.log($scope.newAddress);
        ApiCall.saveNewOfficeAddress($scope.newAddress, function(response){
            console.log(response.data);
            Util.alertMessage('success','new Office Details saved..');
            $state.go('office');
        }, function(error){
            if(error.status == 417){
                Util.alertMessage('danger', error.data.message);
            }
            else{
                Util.alertMessage('danger','Error in adding new office details');
            }
        });
    }
    //function to update address
    $scope.updateOfficeAddress = function(){
        console.log( $scope.ofcDetails);
        ApiCall.saveNewOfficeAddress( $scope.ofcDetails, function(response){
            console.log(response.data);
            $state.go('office');
            Util.alertMessage('success',' Office Details updated..');
        }, function(error){
            if(error.status == 417){
                Util.alertMessage('danger', error.data.message);
            }
            else{
                Util.alertMessage('danger','Error in Updating office details');
            }
        });
    }
    //function to get office details by index
    $scope.showOfcDetails = function(){
        $scope.ofcDetails = $stateParams.ofcDetails;
       
        console.log($scope.ofcDetails);
        if(!$scope.ofcDetails){
            $state.go('office');
        }
        else{
        $scope.districtList.push($scope.ofcDetails.address.district);
        }
    }
    });