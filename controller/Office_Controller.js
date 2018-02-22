app.controller("Office_Controller", function($scope,ApiCall,MasterModel,Util,$state){
$scope.officeDetails ={};
$scope.newAddress = {};

//function to get office details
$scope.getOfficeDetails =function(){
    ApiCall.getOfficeDetails(function(response){
        console.log(response.data);
        $scope.officeDetails = response.data;
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
        $state.reload();
        Util.alertMessage('success','new Office Details saved..');
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
$scope.updateOfficeAddress = function(index){
    console.log($scope.officeDetails[index]);
    ApiCall.saveNewOfficeAddress($scope.officeDetails[index], function(response){
        console.log(response.data);
        $state.reload();
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
});