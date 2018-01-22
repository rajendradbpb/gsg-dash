app.controller("Login_controller",function($scope,$state,$rootScope,$stateParams,NgTableParams,CONFIG,Util,$localStorage,$httpParamSerializer,$http,ApiCall,$uibModal){

    $scope.user={contactNbr:'',password:''};
    $scope.login = function() {

        $scope.data = {
            grant_type:"password",
            username: $scope.user.contactNbr,
            password: $scope.user.password
        };
         $scope.encoded = btoa("android-client:anrdroid-XY7kmzoNzl100");
        // if($scope.isOnline()){
        var req = {
            method: 'POST',
            url: CONFIG.HTTP_HOST_APP+"/gsg/oauth/token",
            headers: {
                "Authorization": "Basic " + $scope.encoded,
                "Content-type": "application/x-www-form-urlencoded"
                } ,
            data: $httpParamSerializer($scope.data)
            }
        $http(req).then(function(data){
            console.log(data);
            $localStorage.token = data.data.access_token;
            


            ApiCall.getUserByContact($scope.user , function(response){
                $rootScope.isLoggedin = true;
                $localStorage.loggedin_user = response.data;
                console.log($localStorage.loggedin_user);
                $state.go('dashboard');
                console.log($localStorage.token);
            }, function(error){


            });


        },function(error){
            Util.alertMessage('danger','Invalid UserId or Password');
            console.log(error);
        });
     };
     $scope.resetInit = function() {
       $scope.reset = {
         contactNbr: $stateParams.contactNbr
       };
     }
     $scope.preresetpwd = function(contactNbr){
        var obj = {};
        obj.contactNbr = contactNbr;
        ApiCall.preresetpwd(obj,function(response){
            if(response.status == "OK"){
                $state.go('reset-pwd',{"contactNbr": obj.contactNbr});
            }
            console.log(response);
        },function(error){
            if(error.status == 404){
                $scope.alertPop('Error' , error.data.message);
            }
            console.log(error);
        });
    }
     $scope.resetpwd = function(resetObj){
        ApiCall.resetpwd(resetObj, function(response){
            if(response.status == "OK"){
                Util.alertMessage("success","Password Reset Successfully");
                $state.go("login");
            }
            console.log(response);
        },function(error){
            if(error.status == 404){
                $scope.alertPop('Error' , error.data.message);
            }
            console.log(error);
        });
    }


});
