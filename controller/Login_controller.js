app.controller("Login_controller",function($scope,$state,$rootScope,NgTableParams,Util,$localStorage){
    $scope.data = {
        mobile : "9776993796",
        password : "0000"
    };
    $scope.login = function(){
        console.log($scope.user);
        if($scope.user.mobile == $scope.data.mobile && $scope.user.password == $scope.data.password){
            console.log("success");
            $rootScope.isLoggedin = true;
            $localStorage.token = true;
            $state.go('dashboard');
        }
        else {
            console.log("error");
        }
        // LoginService.userLogin($scope.user, function(response){
        //     console.log(1);
        //     console.log(response);
        // },function(error){
        //     console.log(2);
        //     console.log(error);
        // });
    }
});
