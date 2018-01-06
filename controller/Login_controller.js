app.controller("Login_controller",function($scope,$state,$rootScope,NgTableParams,Util,$localStorage,$httpParamSerializer,$http){
    // $scope.data = {
    //     mobile : "admin",
    //     password : "admin"



    // };
    // $scope.login = function(){
    //     console.log($scope.user);
    //     if($scope.user.mobile == $scope.data.mobile && $scope.user.password == $scope.data.password){
    //         console.log("success");
    //         $rootScope.isLoggedin = true;
    //         $localStorage.token = true;
    //         $state.go('dashboard');
    //     }
    //     else {
    //         console.log("error");
    //     }
    // };

    
    $scope.user={mobile:'',password:''};
    $scope.login = function() {

        $scope.data = {
            grant_type:"password",
            username: $scope.user.mobile,
            password: $scope.user.password
        };
         $scope.encoded = btoa("android-client:anrdroid-XY7kmzoNzl100");
        // if($scope.isOnline()){
        var req = {
            method: 'POST',
            url: "http://101.53.136.166:8090/gsg/oauth/token",
            headers: {
                "Authorization": "Basic " + $scope.encoded,
                "Content-type": "application/x-www-form-urlencoded"
                } ,
            data: $httpParamSerializer($scope.data)
            }
        $http(req).then(function(data){
            console.log(data);
            $localStorage.token = data.data.access_token;
            $rootScope.isLoggedin = true;
            $state.go('dashboard');
            console.log($localStorage.token);

        },function(error){

            console.log(error);
        });
  }

});
