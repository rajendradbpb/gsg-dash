app.controller("referral_controller", function($scope, $state, $rootScope, MasterModel, NgTableParams, FormService, $stateParams, Util, $localStorage, UserService, $uibModal, MasterService, ApiCall) {
  $scope.referralList = [];

  $scope.createReferral = function() {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'view/modals/addReferralModal.html',
      controller: "ReferralModalCtrl",
      size: 'md',
      resolve: {
        getReferral: function(){
          return $scope.getReferral;
        },
        referral: function(){
          return {};
        },
      }
    });
  }
  $scope.onUpdateReferral = function(referral) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'view/modals/updateReferralModal.html',
      controller: "ReferralModalCtrl",
      size: 'md',
      resolve: {
        getReferral: function(){
          return $scope.getReferral;
        },
        referral: function(){
          return referral;
        },
      }
    });
  }
  $scope.onDeleteReferral = function(referral) {
    // MasterModel.deleteReferral(referral);
    // $scope.getReferral();
    // referral.empid = referral.id;
    ApiCall.deleteReferral({empid:referral.id}, function(response) {
      Util.alertMessage("success", "Referral Deleted");
      $scope.getReferral();
    }, function(error) {
        Util.alertMessage("danger", "Error in Referral delete");
    })
  }
  $scope.getReferral = function() {
    // $rootScope.showPreloader = true;
    // $scope.referralList = new NgTableParams;
    //   $scope.referralList.settings({
    //     dataset: MasterModel.getReferral()
    //   })

    ApiCall.getReferral(function(response) {
      $rootScope.showPreloader =false;
      $scope.referralList = new NgTableParams;
      $scope.referralList.settings({
        dataset: response.data
      })
    }, function(error) {
      Util.alertMessage("danger", error);
    });

  };




});

// create user modal , used to create new user by ccare
app.controller('ReferralModalCtrl', function($scope, $uibModalInstance, Util, ApiCall,$localStorage, getReferral,referral) {
  $scope.referral = referral || {};
  $scope.addReferral = function(referral) {
    // MasterModel.addReferral(referral);
    // getReferral();
    $uibModalInstance.close();
    ApiCall.postReferral(referral, function(response) {
      Util.alertMessage("success", "Referral Code created");
      getReferral();
      $uibModalInstance.close();
    }, function(error) {
      $uibModalInstance.close();
      if(error.status != 201){
        Util.alertMessage("danger", error.data.message);
      }
      else{
      Util.alertMessage("danger", "Error in Referral creation");
      }
    })

  };
  $scope.updateReferral = function(referral) {
    referral.empid = $localStorage.loggedin_user.userId;
    ApiCall.updateReferral(referral, function(response) {
      Util.alertMessage("success", "User created");
      console.log(response.data);
      $uibModalInstance.close();
      getReferral();
    }, function(error) {
      $uibModalInstance.close();
      if(error.status != 201){
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
