var app = angular.module("gsg", ['ui.router','serviceModule', 'ui.bootstrap','ngMap' ,'ngStorage','ngTable','ngResource','ui.utils','WebService','Utility']);
app.config(function($stateProvider, $urlRouterProvider,$httpProvider) {
  $httpProvider.interceptors.push(function ($q, $location, $window,$localStorage,Constants) {
    return {
      request: function (config) {
        if(Constants.debug) {
          console.log("calling web service ->>>>>>>>>>>" , config.url);
          console.log("Data web service ->>>>>>>>>>>" , JSON.stringify(config.data));
        }
        // if($localStorage.token ){
        //   config.headers = config.headers || {};
        //   config.headers['Authorization'] = 'Bearer '+$localStorage.token;
        // }
        return config;
      },
      response: function (response) {
        // if (response.status === 401) {
        //   $location.path('/');
        // }
        return response || $q.when(response);
      }
    };
  });
  $urlRouterProvider.otherwise('/login');
  $stateProvider
  .state('dashboard', {
    templateUrl: 'view/dashboard.html',
    url: '/dashboard',
    controller:'Main_Controller',
    resolve: {
      logout: checkLoggedout
    }

  })
  .state('login',{
    templateUrl:'view/common/login.html',
    controller:'Login_controller',
    url:'/login',
    resolve: {
      logout: checkLoggedin
    }
  })
  .state('forgotPassword',{
    templateUrl:'view/common/forgotPassword.html',
    controller:'Login_controller',
    url:'/forgotPassword',
    resolve: {
      logout: checkLoggedin
    }
  })
  .state('reset-pwd',{
    templateUrl:'view/common/reset-pwd.html',
    controller:'Login_controller',
    url:'/reset-pwd',
    params : {
      contactNbr : null
    },
    resolve: {
      logout: checkLoggedin
    }
  })
  .state('orders',{
    templateUrl:'view/orders.html',
    url:'/orders/:status',
    controller:'TicketController',
    params : {
      status : null
    },
    resolve: {
      logout: checkLoggedout
    }
  })
  .state('tickets',{
    templateUrl:'view/tickets.html',
    url:'/tickets',
    controller:'TicketController',
    resolve: {
      logout: checkLoggedout
    }
  })
  .state('ticketList',{
    templateUrl:'view/ticketList.html',
    url:'/ticketList/:status',
    controller:'TicketController',
      params : {
        status : null
      },
    resolve: {
        logout: checkLoggedout
      }
    })
  .state('ticketDetails',{
    templateUrl:'view/ticketDetails.html',
    url:'/ticketDetails/:orderId',
    controller:'TicketController',
    params : {
      orderId : null
    },
    resolve: {
      logout: checkLoggedout
    }
  })
  .state('users',{
    templateUrl:'view/users.html',
    url:'/users',
    controller : 'User_controller',
    resolve: {
      logout: checkLoggedout
    }
  })
  .state('user-details',{
    templateUrl:'view/userDetails.html',
    url:'/user-details/:user_id',
    controller : 'User_controller',
    params : {
      user_id : null
    },
    resolve: {
      logout: checkLoggedout
    }
  })
  .state('userListByRole',{
    templateUrl:'view/userListByRole.html',
    url:'/userListByRole/:role',
    controller : 'User_controller',
    params : {
      role : null
    },
    resolve: {
      logout: checkLoggedout
    }
  })

  .state('serviceEngineers',{
    templateUrl:'view/serviceEngineers.html',
    url:'/serviceEngineers',
    resolve: {
      logout: checkLoggedout
    }
  })
  .state('services',{
    templateUrl:'view/services.html',
    url:'/services',
    controller : 'service_controller',
    resolve: {
      logout: checkLoggedout
    }
  })
  .state('schemes',{
    templateUrl:'view/schemes.html',
    url:'/schemes',
    controller : 'scheme_controller',
    resolve: {
      logout: checkLoggedout
    }
  })
  .state('schemeDetails',{
    templateUrl:'view/schemeDetails.html',
    url:'/schemeDetails',
    controller : 'scheme_controller',
    params : {
      schemeDetails : null
    },
    resolve: {
      logout: checkLoggedout
    }
  })
function checkLoggedin($q, $timeout, $rootScope,$http, $state, $localStorage) {
  var deferred = $q.defer();
  if($localStorage.token != null){
    $timeout(function(){
      deferred.resolve();
      $rootScope.isLoggedin = true;
      $state.go('dashboard');

    },100)
  }
  else{
    $timeout(function(){
      $localStorage.token = null;
      $rootScope.isLoggedin = false;
      deferred.resolve();
      // $state.go('app.mapView');
    },100)
  }
}
function checkLoggedout($q, $timeout, $rootScope,$http, $state, $localStorage) {
  var deferred = $q.defer();
 if($localStorage.token) {
    $timeout(function(){
      $rootScope.isLoggedin = true;
        console.log("$state >>>>> ",$state.current.name)
        deferred.resolve();
    },200)
  }
  else{

    $timeout(function(){
      $localStorage.token = null;
      $rootScope.isLoggedin = false;
      deferred.resolve();
      $state.go('login');
    },200)

}
}
});
// app.run(function($http,$rootScope,$localStorage,$timeout,EnvService,Constants){
//   EnvService.setSettings(Constants);
// });
app.factory('Util', ['$rootScope',  '$timeout' , function( $rootScope, $timeout){
  var Util = {};
  $rootScope.alerts =[];
  Util.alertMessage = function(msgType, message){
    if(!message){
      message = msgType;
    }
    var alert = { type:msgType , msg: message };
    $rootScope.alerts.push( alert );
    $timeout(function(){
      $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
    }, 5000);
  };
  return Util;
}]);
app.constant('CONFIG', {

  //  'HTTP_HOST_APP':'http://localhost:8090',
   'HTTP_HOST_APP':'http://101.53.136.166:8090' // unit
  //  'HTTP_HOST_APP':'http://192.168.0.9:8090' // chetan
   // 'HTTP_HOST_APP':'http://192.168.0.12:8090' // sarbe
});
;app.filter('dateformat', function(){
  return function(date){
    if(date){
      return moment(date).format("DD MMM, YYYY");
    }
  }
});
app.filter('getShortName', function () {
    return function (value) {
      if(value){
        var temp = angular.copy(value);
        temp = temp.split(" ");
        temp = temp[0].charAt(0)+temp[temp.length-1].charAt(0);
        return temp.toUpperCase();
      }
    };
});
app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0,3).toUpperCase() : '';
    }
});

// this is dummy text




;app.constant("Constants", {
        "debug":false,
        "refreshTime":(1000*60*2), // 2 min
        "storagePrefix": "goAppAccount$",
        "rtToken"      :"1-14-e17a4afd91c6d3c47594e0d0d7ae3258",
        "getTokenKey" : function() {return this.storagePrefix + "token";},
        "getLoggedIn" : function() {return this.storagePrefix + "loggedin";},
        "alertTime"   : 3000,
        "getUsername" : function() {return this.storagePrefix + "username";},
        "getPassword" : function() {return this.storagePrefix + "password";},
        "getIsRemember" : function() {return this.storagePrefix + "isRemember";},
        "googleApi":"https://maps.googleapis.com/maps/api/geocode/json?latlng={{latLng}}&key=AIzaSyBKH-ESKu39LGz3Q9Uc4GIZTUdhAlhl0gE",
        "hashKey" : "goAppAccount",
        "envData" : {
          "env":"dev",
          "dev" : {
            "basePath" :"http://101.53.136.166:8081/REST/2.0",
          },
          "prod" : {
            "basePath" :"http://101.53.136.166:8081/REST/2.0",
          }
        },
});
;angular.module('Logger', [])
  .factory('LOG', function($rootScope,$timeout) {
    return {
      debug: function(message) {
        console.log(message);
      },
      info: function(message) {
        var alert = { type:"success" , msg: message };
        $rootScope.alerts.push( alert );
        $timeout(function(){
          $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
        }, 5000);
      },
      error: function(message) {
        var alert = { type:"error" , msg: message };
        $rootScope.alerts.push( alert );
        $timeout(function(){
          $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
        }, 5000);
      },
    }
  })
;angular.module("Utility",[])
.factory("FormService",function() {
  var formService = {};
  formService.validateForm = function(form,callback) {
    var limit = Object.keys(form.$error).length;
    if(!limit){
      callback(true);
    }
    else{
       var status = '';
        var count = 0;
        angular.forEach(form.$error,function(v,k){
          count++;
          v[0].$touched = true; // we can add more parameters here
          status += v[0].$name+(count < limit ? ",":"");
          if(count >=  limit){
            callback(false,status);
          }
        })
    }
    //return true;
  }



  return formService;


})
;angular.module('WebService', [])
.factory('API', function($http, $resource) {
  return {
    createOrder: {
      "url": "/gsg/api/dashboard/order/create",
      "method": "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getOrders: {
      "url": "/gsg/api/order",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getOrderdetailsById:{
      "url": "/gsg/api/orders/:orderId",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getSchemes: {
      "url": "/gsg/api/master/schemes",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    createUser: {
      "url": "/gsg/api/dashboard/user/create",
      "method": "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
  getAllUsers: {
      "url": "/gsg/api/users",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getUserCount: {
      "url": "/gsg/api/users/count",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getUserById: {
      "url": "/gsg/api/users/id/:user_id",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getOrderByUser: {
      "url": "/gsg/api/orders/user/:user_id",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getUserByContact: {
      "url": "/gsg/api/dashboard/user/contact/:contactNbr",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getAllServices: {
      "url": "/gsg/api/master/services",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getAllStates: {
      "url": "/gsg/api/master/states",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getVehicleMakeModal: {
      "url": "/gsg/api/master/vehicles",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getAllVehicles: {
      "url": "/gsg/api/master/vehicles",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    addVehicle: {
      "url": "/gsg/api/users/:user_id/vehicle",
      "method": "POST",
      "params":{user_id:"@user_id"},
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    updateUserById: {
      "url": "/gsg/api/users/id/:userId",
      "method": "PUT",
      "params":{userId:"@userId"},
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getOrdersCount: {
      "url": "/gsg/api/orders/count",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getOrderByStatus: {
      "url": "/gsg/api/orders/status/:status",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getEngineerList: {
      "url": "/gsg/api/users/role/ROLE_ENGINEER",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getUserByRole: {
      "url": "/gsg/api/users/role/:role",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    changePassword: {
      "url": "/gsg/api/users/id/:userId/changePassword",
      "method": "PUT",
      "params":{userId:"@userId"},
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    updateOrder: {
      "url": "/gsg/api/orders/:loginUserId/:orderId",
      "method": "PUT",
      "params":{orderId:"@orderId",
        loginUserId:"@loginUserId"
      },
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    updateOrderDetails: {
      "url": "/gsg/api/orders/orderDtl/:orderDtlId",
      "method": "PUT",
      "params":{orderDtlId:"@orderDtlId",
      },
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    preresetpwd: {
      "url": "/gsg/preresetpwd/:contactNbr",
      "params":{contactNbr:"@contactNbr"},
      "method": "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    resetpwd: {
      "url": "/gsg/resetpwd/",
      "method": "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    takeFeedback: {
      "url": "/gsg/api/dashboard/:orderId/feedback",
      "method": "POST",
      "params":{orderId:"@orderId"},
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },


  }
})
.factory('ApiCall', function($http, $resource, API,ApiGenerator) {
  return $resource('/',null, {
    createOrder: ApiGenerator.getApi('createOrder'),
    getSchemes: ApiGenerator.getApi('getSchemes'),
    createUser: ApiGenerator.getApi('createUser'),
    addVehicle: ApiGenerator.getApi('addVehicle'),
    getVehicleMakeModal: ApiGenerator.getApi('getVehicleMakeModal'),
    getAllStates: ApiGenerator.getApi('getAllStates'),
    getAllServices: ApiGenerator.getApi('getAllServices'),
    getUserById: ApiGenerator.getApi('getUserById'),
    getAllUsers: ApiGenerator.getApi('getAllUsers'),
    getOrderdetailsById: ApiGenerator.getApi('getOrderdetailsById'),
    getOrders: ApiGenerator.getApi('getOrders'),
    updateUserById: ApiGenerator.getApi('updateUserById'),
    getOrdersCount: ApiGenerator.getApi('getOrdersCount'),
    getOrderByStatus  : ApiGenerator.getApi('getOrderByStatus'),
    getUserByContact : ApiGenerator.getApi('getUserByContact'),
    changePassword : ApiGenerator.getApi('changePassword'),
    getOrderByUser : ApiGenerator.getApi('getOrderByUser'),
    getEngineerList : ApiGenerator.getApi('getEngineerList'),
    updateOrder : ApiGenerator.getApi('updateOrder'),
    getUserCount :  ApiGenerator.getApi('getUserCount'),
    getUserByRole :  ApiGenerator.getApi('getUserByRole'),
    preresetpwd :  ApiGenerator.getApi('preresetpwd'),
    resetpwd :  ApiGenerator.getApi('resetpwd'),
    getAllVehicles :  ApiGenerator.getApi('getAllVehicles'),
    updateOrderDetails :  ApiGenerator.getApi('updateOrderDetails'),
    takeFeedback :  ApiGenerator.getApi('takeFeedback'),
  })
})

.factory('ApiGenerator', function($http, $resource, API, CONFIG) {
    return {
      getApi: function(api) {
        var obj = {};
        obj = angular.copy(API[api]);
        obj.url = CONFIG.HTTP_HOST_APP + obj.url;
        return obj;
      }
    }
})
;app.controller("Login_controller",function($scope,$state,$rootScope,$stateParams,NgTableParams,CONFIG,Util,$localStorage,$httpParamSerializer,$http,ApiCall,$uibModal){

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
;/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller("Main_Controller", function($scope, $state, $rootScope,Constants,$interval, $window, $uibModal,NgTableParams, $localStorage, Util, ApiCall) {

  $rootScope.setInterval = null;
  $rootScope.$on('$stateChangeSuccess',function(){
    if(!$rootScope.setInterval) {
      // alert("refresh");
      $rootScope.setInterval = $interval(function(){
        if($state.current.name == "dashboard"){
          // $state.reload();
          // console.log("reload >>>>>");
          window.location.reload()
        }
      },Constants.refreshTime);

    }
    else{
      $interval.cancel($rootScope.setInterval);
      $rootScope.setInterval = null;
    }
  })
  $scope.active_tab = 'lists';
  var colors = ['#34dcd6', '#7c12ca', '#efe239', '#34bb25', '#34bb25', '#34dcd6', '#7c12ca', '#efe239', '#bb25a7', '#34bb25'];
  $scope.tabChange = function(tab) {
    $scope.active_tab = tab;
  }
  $scope.signOut = function() {
    $localStorage.token = null;
    $rootScope.isLoggedin = false;
    $state.go('login');
  }
  $scope.getBgColor = function(index) {
    return (colors[index] ? colors[index] : colors[0]);
  }
  // function to get ticket counts
  $scope.getOrdersCount = function() {
    // service to get ticket count.

    ApiCall.getOrdersCount(function(response) {
      console.log(response.data);
      $scope.counts = response.data;
    }, function(error) {
      console.log(error);
    });
  };
  // function to get user count
  $scope.getUserCount = function(){
    // service to get user count
    ApiCall.getUserCount(function(response){
      console.log(response.data);
      $scope.userCount = response.data;
    }, function(error){
      console.log(error);
    });

  };

  // function to open chnage password modal
  $scope.changePasswordModal = function(){
    var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'view/modals/changePassword.html',
        controller: 'changePasswordController',
        size: 'md',
        resolve: {

        }
    });

  };

});
  // controllerfor change password modal
app.controller('changePasswordController', function($scope,$localStorage,$uibModalInstance,ApiCall, Util){
  $scope.password ={};
  $scope.checkPassword = function(before,after){
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>" + before,after);
    $scope.showPasswordMisMatch = false;
    if(before !== after){
    $scope.showPasswordMisMatch = true;
    }
    return $scope.showPasswordMisMatch;
};

  $scope.change = function(){
    $scope.password.userId = $localStorage.loggedin_user.userId;
    ApiCall.changePassword($scope.password , function(response){
      $localStorage.loggedin_user = response.data;
      $uibModalInstance.close();
      Util.alertMessage('success','Password Changed successfully..');
    }, function(error){
      $uibModalInstance.close();
      if(error.status == 417){
        Util.alertMessage('danger',error.data.message);
      }
      else{
        Util.alertMessage('danger','Error in password change');
      }
    });

  };
  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };

});
app.controller('DatePickerCtrl', ['$scope', function($scope) {
  // $scope.task = {};
  // $scope.ClosingDateLimit  = function(){
  //   $scope.startDates = $scope.task.startDate;
  //   console.log($scope.startDates);
  // }
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  // Disable weekend selection
  /*
   $scope.disabled = function(date, mode) {
   return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
   };*/

  $scope.toggleMin = function() {
    // $scope.minDate = $scope.task.startDate;
    $scope.minDate = new Date();
    $scope.maxDate = new Date();
    $scope.maxDate2 = new Date("2050-01-01");
    $scope.dateMin = null || new Date();
  };
  $scope.toggleMin();

  $scope.open1 = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.mode = 'month';

  $scope.initDate = new Date();
  $scope.formats = ['MM-dd-yyyy', 'dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd/MM/yyyy', 'yyyy-MMM', 'shortDate'];
  $scope.format = $scope.formats[4];
  $scope.format1 = $scope.formats[5];

}]);
;app.controller('scheme_controller' , function($scope, ApiCall,$stateParams,NgTableParams, $state){
    //function to get all schemes
    $scope.getSchemes = function(){
        //service to get all schemes..
        ApiCall.getSchemes(function(response){
            console.log(response.data);
            $scope.schemeList = response.data;
        }, function(error){
            console.log(error);

        });
    };
    // function to get scheme Details..
    $scope.getSchemeDetails =  function(){
        $scope.schemeDetails = $stateParams.schemeDetails;
        console.log( $scope.schemeDetails);
        if(!$scope.schemeDetails)
        {
            $state.go('schemes');
        }
        $scope.schemeData = new NgTableParams;
        $scope.schemeData.settings({
            dataset : $scope.schemeDetails.schemeServiceDtls
        })
    };

});
;app.controller('service_controller',function($scope,ApiCall,NgTableParams){
    $scope.active_tab = "MAJOR";
    $scope.getAllServices = function(){
        $scope.services = {};
        ApiCall.getAllServices(function(response){
            $scope.services.serviceList = response.data;
            console.log($scope.services);
            $scope.tabChange("MAJOR");
        }, function(error){
            console.log(error);
        });
    };
    $scope.tabChange = function(tab){
         $scope.active_tab = tab;
        //  $scope.serviceList = [];
         if(!$scope.services[tab] || $scope.services[tab].length == 0){
            $scope.services[tab] = [];
             angular.forEach($scope.services.serviceList , function(item){
                if(item.category == tab){
                    $scope.services[tab].push(item);
                }
             });
         }
         
        $scope.serviceData = new NgTableParams;
                $scope.serviceData.settings({
                  dataset :$scope.services[tab] 
                }) 
         console.log($scope.services);
     };
});;app.controller("TicketController",function($scope,$http,Constants,$state,$rootScope,MasterModel,NgTableParams,Util,$uibModal,TicketService,$stateParams,ApiCall,$localStorage){
  $scope.active_tab = "new";
  $scope.ticket = {};
  $scope.orderDetails = {};

  // $scope.ticket.statuses = [
  //   {label:"CREATED",disable:false },
  //   {label:"EMERGENCY",disable:false },
  //   {label:"RESOLVED",disable:false },
  //   {label:"CLOSED",disable:false },
  //   {label:"WIP",disable:false },
  //   {label:"CANCELLED",disable:false },
  //   ];
  $scope.ticket.serviceEngineer = ['Ricky','Subhra','Rajendra','Srikanta','CustomerSupport'];
  // function to get orders
    $scope.getOrders = function(){
      console.log("inside the method");
      $rootScope.showPreloader = true;
      //service to get all order list
      ApiCall.getOrders(function(response){
        $rootScope.showPreloader= false;
        console.log(response);
        $scope.orderList = response.data;
         $scope.orderData = new NgTableParams;
         $scope.orderData.settings({
           dataset : $scope.orderList
         })
      }, function(error){
        console.log(error);
      });

    };
    $scope.getLocationDetails = function(){
      var url = Constants.googleApi.replace(/{{latLng}}/g,$scope.orderDetails.orderDtls[0].product.location);
      $http.get(url).then(function(response) {
        $scope.orderDetails.locationDetails = response.data.results[0] ? response.data.results[0].formatted_address : "No Address available";
      },function(err){
        console.error(err);
      })
    }
    $scope.checkVehicleData = function(vehicleMake){
      $scope.orderDetails.hasVehicleData = vehicleMake ? true : false;
    }
    $scope.getAllVehicles = function(){
      MasterModel.getAllVehicles(function(err,result){
        if(err){
          $scope.orderDetails.vehicles = [];
          Util.alertMessage('danger','Error in Getting vehicle list');
          console.error(err);
          return;
        }
        $scope.orderDetails.vehicles = result;
      })
    };
  
    $scope.openMap = function() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'view/modals/locationModal.html',
        controller: "locationModalController",
        size: 'lg',
        resolve: {
          location: function() {
            return $scope.orderDetails.orderDtls[0].product.location;
          }
        }
      });
    }
    //function to get engineer list
    $scope.getEngineerList = function(){
      ApiCall.getEngineerList(function(response){
        console.log(response.data);
        $scope.engineersList = response.data;
        $scope.engineersListMaster = angular.copy($scope.engineersList);
        console.log( $scope.engineersList);
        // calling states
        MasterModel.getStates(function(err,states) {
          if(err){
            Util.alertMessage('danger','Error in getting states');
            $scope.stateList = [];
            return;
          }
          $scope.stateList = states;
        })
      } , function(error){
        console.log(error);
      });
    };
    // used to filter service engineer based on selected state and district
    $scope.filterEngineer = function(state,district){
      if(!state)
        return;
      console.log(state,district);

      var enggState = [];
      var enggDistrict = [];
      for(var i in $scope.engineersListMaster){
        if(state && $scope.engineersListMaster[i].seerviceArea.state && $scope.engineersListMaster[i].seerviceArea.state.toLocaleLowerCase() == state.stateCd.toLocaleLowerCase()){
          enggState.push($scope.engineersListMaster[i]);
        }
        if(district && $scope.engineersListMaster[i].seerviceArea.district && $scope.engineersListMaster[i].seerviceArea.district.toLocaleLowerCase() == district.toLocaleLowerCase()){
          enggDistrict.push($scope.engineersListMaster[i]);
        }
      }
      enggState = enggState.filter((v, i, a) => a.indexOf(v) === i);
      enggDistrict = enggDistrict.filter((v, i, a) => a.indexOf(v) === i);
      $scope.engineersList = intersection_destructive(enggState,enggDistrict,district);
    }
    function intersection_destructive(a, b,district)
    {
      var result = [];
      if(!district)
        return a;
      for(var i in b){
        if(a.indexOf(b[i])!= -1){
          result.push(b[i]);
        }
      }
      return result;
    }
    //funtion to update order status
    $scope.updateStatus = function(updateStatus) {
      console.log($scope.orderDetails.status,$scope.orderDetails.state,$scope.orderDetails.district,$scope.orderDetails.assignedToUserId);
      $scope.orderUpdate ={};
      $scope.orderUpdate ={
        loginUserId :$localStorage.loggedin_user.userId,
        userId : $scope.orderDetails.userId,
        assignedQueue : $scope.orderDetails.assignedQueue,
        assignedToUserId : $scope.orderDetails.assignedToUserId,
        requestStatus : $scope.orderDetails.status==null ? $scope.orderDetails.requestStatus:$scope.orderDetails.status,
        orderId : $scope.orderDetails.orderId
      };
      console.log($scope.orderUpdate);
      ApiCall.updateOrder( $scope.orderUpdate , function(response){
        console.log(response.data);
        Util.alertMessage('success', ' Order status changed successfully..');
        $state.go("dashboard");
      }, function(error){
        console.log(error);
        if(error.status == 417){
          Util.alertMessage('danger', error.data.message);
        }
        else{
          Util.alertMessage('danger', 'Error in order assign...');
        }
       
      });

    };
    //function to get mfgArr
    $scope.getMfgYear = function() {
      $scope.currentYear = 2018;
      $scope.mfgYearArr = [];
      for (i = 0; i < 30; i++) {
        $scope.mfgYearArr.push($scope.currentYear--);
      }
      console.log($scope.mfgYearArr);
    };
    //used to update total order
    $scope.updateOrderDetails = function(orderDetails){
      if(!orderDetails.orderDtls[0].product.usrVehicle.expiryDate || orderDetails.orderDtls[0].product.usrVehicle.expiryDate == "Invalid Date"){
        delete orderDetails.orderDtls[0].product.usrVehicle['expiryDate'];
      }
      orderDetails.orderDtls[0].product.usrVehicle.expiryDate = moment(orderDetails.orderDtls[0].product.usrVehicle.expiryDate).format('YYYY-MM-DD');
      orderDetails.orderDtls[0].product.orderDtlId = orderDetails.orderDtls[0].id;
      ApiCall.updateOrderDetails(  orderDetails.orderDtls[0].product , function(response){
        console.log(response.data);
        Util.alertMessage('success', ' Order  update successfully..');
        //$state.go("dashboard");
      }, function(error){
        console.log(error);
        if(error.status == 417){
          Util.alertMessage('danger', error.data.message);
        }
        else{
          Util.alertMessage('danger', 'Error in Order  update');
        }
        
      });
    }
  //function to get order details by orderid

    $scope.getOrderdetailsById =  function(){
      console.log("inside order details.");
      $scope.obj = {
        orderId : $stateParams.orderId
      }
      console.log($scope.orderId);
      ApiCall.getOrderdetailsById($scope.obj , function(response){
        console.log(response);
        $scope.orderDetails = response.data;
        $scope.getLocationDetails();
        $scope.checkVehicleData($scope.orderDetails.orderDtls[0].product.usrVehicle.vehicle.make);
        $scope.getAllVehicles();
        $scope.orderDetails.insuranceTypeArr = ["Comprehensive", "Zero Depreciation", "Third party only"];
        $scope.orderDetails.insuranceValidArr = [
          {key:true,value:"Yes"},
          {key:false,value:"No"}
        ];
        // update status dropdown
        // angular.forEach($scope.ticket.statuses,function(v,k) {
        //   if($scope.orderDetails.requestStatus == "RESOLVED" && v.label == "CLOSED") {
        //     v.disable = false;
        //   }
        //   else{
        //     v.disable = true;
        //   }
        // })
        $scope.vehicleData= response.data.orderDtls[0].product.usrVehicle;
          console.log($scope.vehicleData);
      }, function(error){
        console.log(error);
      });
      // TicketService.getTicketdetailsById($scope.orderId).get(function(response){
      //   console.log(response.data);
      //   $scope.orderDetails = response.data;
      //   $scope.vehicleData= response.data.orderDtls[0].product.usrVehicle;
      //   console.log($scope.vehicleData);

      // },function(error){

      // });

    };

    

  
    // function to get ticket lists
    $scope.getOrderByStatus = function(){

      $scope.obj={
        status : $stateParams.status
      };
      console.log("inside the method");
      $rootScope.showPreloader = true;
      //service to get all tickets
      ApiCall.getOrderByStatus($scope.obj,function(response){
        $rootScope.showPreloader= false;
        console.log(response);
        $scope.orderList = response.data;
         $scope.orderData = new NgTableParams;
         $scope.orderData.settings({
           dataset : $scope.orderList
         })

      }, function(error){
        console.log(error);

      });
    };
    //function to open feedback modal
    $scope.feedbackModal = function() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'view/modals/feedbackModal.html',
        controller: "feedbackModalCtrl",
        size: 'md',
        resolve: {
          orderDetails : function(){
            return  $scope.orderDetails;
          }
        }
      });
    }
});
app.controller('locationModalController', function($scope, $uibModalInstance, location) {
  $scope.location = location;
  $scope.ok = function(user) {

  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});

app.controller('feedbackModalCtrl', function($scope, $uibModalInstance,orderDetails,$localStorage,ApiCall, Util) {
  $scope.feedback ={};
  $scope.feedback.rating=0;
  $scope.rateFunction = function(rating) {
    console.log('Rating selected: ' + rating);
  };
 
  $scope.ok = function() {
    $scope.feedback.orderId=orderDetails.orderId;
    $scope.feedback.submitterUserId =  $localStorage.loggedin_user.userId;
    console.log($scope.feedback);
    // service to take feedback
    ApiCall.takeFeedback($scope.feedback, function(response){
      console.log(response);
      $uibModalInstance.close();
      Util.alertMessage("success","Feedback taken successfully..");
    }, function(error){
      console.log(error);
      $uibModalInstance.close();
      if(error.status == 417){
        Util.alertMessage("danger",error.data.message);
      } else{
        Util.alertMessage("danger","Error occured in feedback taking process");
      }

    });
    
  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});
;app.controller("User_controller", function($scope, $state, $rootScope, MasterModel, NgTableParams, FormService, $stateParams, Util, $localStorage, UserService, $uibModal, MasterService, ApiCall) {
  $scope.userList = {};
  $scope.active_tab = "BD";

  $scope.tabChange = function(tab) {
    $scope.active_tab = tab;
  }
  $scope.createUserModal = function() {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'view/modals/newUserModal.html',
      controller: "createUserModalCtrl",
      size: 'md',
      resolve: {
        getAllUsers: function(){
          return $scope.getAllUsers;
        }
      }
    });
  }
  $scope.getAllUsers = function() {
    ApiCall.getAllUsers(function(response) {
      console.log(response);
      $scope.userList = response.data;
      $scope.userData = new NgTableParams;
      $scope.userData.settings({
        dataset: $scope.userList
      })
    }, function(error) {

    });

  };
  //function to get user list by role
  $scope.getUserByRole = function() {
    var obj = {
      role: $stateParams.role
    };
    //service to get user by role
    console.log("obj", obj);
    ApiCall.getUserByRole(obj, function(response) {
      console.log(response.data);

      $scope.userLists = response.data;
      $scope.userDatas = new NgTableParams;
      $scope.userDatas.settings({
        dataset: $scope.userLists
      })
    }, function(error) {

      console.log(error);

    });

  };
  $scope.profileUpdate = function(form) {
    console.log('form', form);

    console.log('user', $scope.user);
    var status = FormService.validateForm(form, function(status, message) {
      if (!status) {
        console.log('form 2', status, message);
        Util.alertMessage("warning", "Invalid data for " + message + " fields");
      } else {
        $scope.user.dob = moment($scope.user.dob).format('YYYY-MM-DD');
        $scope.user.anniversaryDate = moment($scope.user.anniversaryDate).format('YYYY-MM-DD');
        ApiCall.updateUserById($scope.user, function(response) {
          console.log(response);
          Util.alertMessage('success', 'User Details Updated successfully...');
        }, function(error) {
          console.log(error);
          if(error.status == 417){
            Util.alertMessage('danger', error.data.message);
          }
          else{
          Util.alertMessage('danger', 'User Details Cannot be updated...');
          }
        });
      }
    })
  }
  // $scope.createTicket = function(userData) {
  //     console.log(userData);
  //     $scope.ticket ={};
  //     $scope.ticket.userId = userData.userId;
  //     $scope.ticket.location = [0,0];
  //     $scope.ticket.serviceType = "EMERGENCY";
  //     ApiCall.createTicket($scope.ticket ,function(response){
  //         console.log(response);
  //         Util.alertMessage('success','Ticket Created successfully...');

  //     },function(error){
  //         console.log(error);
  //     });
  // };
  $scope.addOrderModal = function(userData) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'view/modals/new_ticket.html',
      controller: 'orderModalController',
      size: 'md',
      resolve: {
        userData: function() {
          return userData;
        }
      }
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
  $scope.getDistrict = function(user) {
    $scope.districtList = [];
    angular.forEach($scope.stateList, function(item) {
      if (item.stateName == user.address[0].state) {
        $scope.districtList = item.districts;
        // vm.type = item.type;
      }
    });
  };
  $scope.user = {};
  $rootScope.$on("vehicleData",function(events,data){
    $scope.getUserDetails();
  });
  $scope.getUserDetails = function() {
    $scope.obj = {
      user_id: $stateParams.user_id
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

    console.log($scope.obj);
    ApiCall.getUserById($scope.obj, function(response) {
      console.log(response);
      $scope.user = response.data;
      // $scope.user.dob = new Date(dob);
      // get districtList based on state
      $scope.getDistrict($scope.user);
      console.log($scope.user);
      if ($scope.user.address.length == 0) {
        $scope.user.address.push(domyData);
      };
      $scope.vehicleData = new NgTableParams;
      $scope.vehicleData.settings({
        dataset: $scope.user.userVehicles
      })

      console.log($scope.user.address);
      angular.forEach($scope.user.schemes, function(item) {
        item.validityLeft = item.durationInDays - (moment().diff(moment(item.subscriptionDt), 'days'));
      });
    }, function(error) {

    });


  };
  $scope.getOrderByUser = function() {
    $scope.orderHistoryList = [{
        type: 'LIVE',
        data: []
      },
      {
        type: 'FUTURE',
        data: []
      },
      {
        type: 'COMPLETED',
        data: []
      },
      {
        type: 'CANCELLED',
        data: []
      }
    ];
    var obj = {
      user_id: $stateParams.user_id
    };
    ApiCall.getOrderByUser(obj, function(response) {

      angular.forEach(response.data, function(item) {
        if (item.requestStatus == "CLOSED") {
          $scope.orderHistoryList[2].data.push(item);
        } else if (item.requestStatus == "CANCELED") {
          $scope.orderHistoryList[3].data.push(item);
        } else {
          if (moment(item.serviceDate) > moment()) {
            $scope.orderHistoryList[1].data.push(item);
          } else {
            $scope.orderHistoryList[0].data.push(item);
          }
        }
      });
      console.log("list", $scope.orderHistoryList);
    }, function(error) {
      console.log(error);
    });

  };

  $scope.addVehicle = function(userData) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'view/modals/new_vehicle.html',
      controller: 'vehicleModalController',
      size: 'md',
      resolve: {
        userId: function() {
          return userData;
        },
        getUserDetails : function(){
          return $scope.getUserDetails;
        }
      }
    });

  };
  $scope.showVehicleDetails = function(vehicleData) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'view/modals/vehicleDetailsModal.html',
      controller: 'vehicleDetailsModalController',
      size: 'md',
      resolve: {
        vehicleData: function() {
          return vehicleData;
        }
      }
    });

  };



});


app.controller('vehicleModalController', function($scope, $uibModalInstance, VehicleService, MasterModel, $stateParams, Util, ApiCall,getUserDetails) {

  $scope.insuranceArr = [true, false];
  $scope.insuranceTypeArr = ["Comprehensive", "Zero Depreciation", "Third party only"];
  $scope.getVehicledata = function() {
    // ApiCall.getVehicleMakeModal(function(response){
    //     console.log(response);
    //         $scope.vehicleDatas = response.data;
    //         $scope.makes = [];
    //         angular.forEach(response.data,function(item){
    //             $scope.makes.push(item.make);
    //         })
    //         console.log($scope.makes);
    // }, function(error){
    //     console.log(error);
    // });
    MasterModel.getAllVehicles(function(err, results) {
      if (err) {
        return Util.alertMessage('danger', err);
      }
      $scope.vehicleDatas = results;
      $scope.makes = [];
      angular.forEach(results, function(item) {
        $scope.makes.push(item.make);
      })
    });

  };
  $scope.getModel = function(selectedModel) {
    console.log("coming");
    console.log(selectedModel);

    console.log($scope.vehicleDatas);
    angular.forEach($scope.vehicleDatas, function(item) {
      if (item.make == selectedModel) {
        $scope.vehiclesLists = item.vehicles;
        $scope.vehicleModelList = [];
        angular.forEach(item.vehicles, function(vehicle) {
          $scope.vehicleModelList.push(vehicle.models);
        })
      }
    });
    console.log($scope.vehicleModelList);


  };
  $scope.getVehicleType = function(model) {
    console.log(model);
    console.log($scope.vehiclesLists);
    angular.forEach($scope.vehiclesLists, function(item) {
      if (item.models == model) {
        $scope.type = item.type;
        $scope.subType = item.subType;
        $scope.wheels = item.wheels;
      }
    });
  };
  $scope.getMfgYear = function() {
    $scope.currentYear = 2018;
    $scope.mfgYearArr = [];
    for (i = 0; i < 30; i++) {
      $scope.mfgYearArr.push($scope.currentYear--);
    }
    console.log($scope.mfgYearArr);
  };
  $scope.addVehicle = function() {
    $scope.vehicle.user_id = $stateParams.user_id;
    console.log($scope.vehicle.user_id);
    $scope.vehicle.vehicle = {
      make: $scope.vehicle.make,
      models: $scope.vehicle.model,
      subType: $scope.subType,
      type: $scope.type,
      wheels: $scope.wheels
    };
    $scope.vehicle.expiryDate = moment($scope.vehicle.expiryDate).format('YYYY-MM-DD');
    console.log($scope.vehicle);
    ApiCall.addVehicle($scope.vehicle, function(response) {
      console.log(response);
      $uibModalInstance.close();
      Util.alertMessage('success', 'Vehicle added successfully...');
      // $scope.$emit("vehicleData",response.data);
      getUserDetails();
    }, function(error) {
      console.log(error);
      $uibModalInstance.close();
      if(error.status == 417){
        Util.alertMessage('danger', error.data.message);
      }
      else{
      Util.alertMessage('danger', 'Vehicle is not added try again');
      }
    });
  };



  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});

app.controller('vehicleDetailsModalController', function($scope, $uibModalInstance, vehicleData) {
  $scope.vehicleData = vehicleData;
  $scope.ok = function() {
    // service call to update vihicle details
    $uibModalInstance.close();
  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});
// create user modal , used to create new user by ccare
app.controller('createUserModalCtrl', function($scope, $uibModalInstance, Util, ApiCall, MasterModel,getAllUsers) {
  $scope.userRole = ['ROLE_USER', 'ROLE_ENGINEER', 'ROLE_OPERATION'];
  $scope.stateList = [];
  MasterModel.getStates(function(err,states) {
    if (err) {
      Util.alertMessage('danger', 'Error in getting states');
      $scope.stateList = [];
      return;
    }
    $scope.stateList = states;
    $scope.stateList = states;
  })
  $scope.getDistrict = function(state) {
    $scope.districtList = [];
    angular.forEach($scope.stateList, function(item) {
      if (item.stateCd == state) {
        $scope.districtList = item.districts;
        // vm.type = item.type;
      }
    });
  };

  $scope.newUser = {};

  $scope.ok = function() {


    console.log($scope.newUser);
    //   $scope.newUser.roles = $scope.newUser.roles
    var req = angular.copy($scope.newUser);
    req.roles = [req.roles];
    // service call to update vihicle details
    ApiCall.createUser(req, function(response) {
      Util.alertMessage("success", "User created");
      console.log(response.data);
      $uibModalInstance.close();
      getAllUsers();
    }, function(error) {
      $uibModalInstance.close();
      if(error.status == 417){
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
//new order modal
app.controller('orderModalController', function($scope, $uibModalInstance, Util, MasterModel, ApiCall, userData, $state) {
  $scope.userdata = userData;
  $scope.extVehicle = {};
  $scope.getVehicledata = function() {

    // ApiCall.getVehicleMakeModal(function(response){
    //     console.log(response);
    //         $scope.vehicleDatas = response.data;
    //         $scope.makes = [];
    //         angular.forEach(response.data,function(item){
    //             $scope.makes.push(item.make);
    //         })
    //         console.log($scope.makes);
    // }, function(error){
    //     console.log(error);
    // });
    MasterModel.getAllVehicles(function(err, results) {
      if (err) {
        return Util.alertMessage('danger', err);
      }
      $scope.vehicleDatas = results;
      $scope.makes = [];
      angular.forEach(results, function(item) {
        $scope.makes.push(item.make);
      })
      console.log($scope.makes);
    });

  };
  // $scope.getModel = function(selectedModel){
  //     console.log("coming");
  //     console.log(selectedModel);
  //
  //     console.log($scope.vehicleDatas);
  //     angular.forEach($scope.vehicleDatas,function(item){
  //         if(item.make == selectedModel){
  //             $scope.vehiclesLists = item.vehicles;
  //             $scope.vehicleModelList = [];
  //             angular.forEach(item.vehicles,function(vehicle){
  //                 $scope.vehicleModelList.push(vehicle.models);
  //             })
  //         }
  //     });
  //     console.log($scope.vehicleModelList);
  //
  //
  // };
  // $scope.getVehicleType = function(model){
  //     console.log(model);
  //     console.log($scope.vehiclesLists);
  //     angular.forEach($scope.vehiclesLists,function(item){
  //         if(item.models == model){
  //             $scope.type = item.type;
  //             $scope.subType = item.subType;
  //             $scope.wheels = item.wheels;
  //         }
  //     });
  // };
  $scope.placeChanged = function() {
    $scope.place = this.getPlace();
    console.log('location', $scope.place.geometry.location);
    $scope.map.setCenter($scope.place.geometry.location);
  }

  
  $scope.ticket = {};
  $scope.ok = function() {

    console.log($scope.userdata.userId);
    // $scope.ticket.vehicle ={};
    $scope.ticket.userId = $scope.userdata.userId;
    $scope.ticket.location = [0, 0];
    $scope.ticket.serviceType = "EMERGENCY";
    var req = {};
    if ($scope.newVehicle) {
      req.usrVehicle = {
        vehicle: $scope.ticket.extVehicle.selectedModel
      };
      req.userId = $scope.ticket.userId;
      req.location = $scope.ticket.location;
      req.serviceType = $scope.ticket.serviceType;
      req.useUserScheme = $scope.ticket.useUserScheme;
    } else {
      req = $scope.ticket;
    }
    console.log(JSON.stringify(req));
    delete req['extVehicle']; // removing extra parameter
    ApiCall.createOrder(req, function(response) {
      console.log(response.data.orderId);
      Util.alertMessage("success", "Order Created successfully..");
      $state.go('ticketDetails', {
        orderId: response.data.orderId
      });
      $uibModalInstance.close();
    }, function(error) {
      console.log(error);
      $uibModalInstance.close();
      if(error.status == 417){
        Util.alertMessage("danger", error.data.message);
      }
      else{
      Util.alertMessage("danger", "Error in order creation.");
      }
    });

  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});
;angular.module('serviceModule', ['ngResource'])
.factory('loginService', function ($resource,CONFIG,$http) {
    return{

        loginOAuth: function (contactNbr,password) {
            return $resource( CONFIG.HTTP_HOST_APP_OAUTH +'/gsg/oauth/token?grant_type=password&username=' + contactNbr + '&password=' + password,{
              save:{method:'POST'}
            })
        },
        saveEmployee: function () {
            return $resource( CONFIG.HTTP_HOST_APP +'/employee/addEmp',{
              save:{method:'POST'}
            })
        },
    }
})
.factory('TicketService', function ($resource,CONFIG,$http) {
    return{
        getTickets: function () {
            return $resource( CONFIG.HTTP_HOST_APP +'/gsg/api/order',{
			  get:{method:'GET'},
			//   header:{'Authorization':'bearer '+$localStorage.user_token},
			  isArray : true
            })
        },
        createTicket: function(){
            return $resource(CONFIG.HTTP_HOST_APP + '/gsg/api/order',{
                save:{method:'POST'},
                // header:{'Authorization':'bearer '+$localStorage.user_token},
                isArray : true
            })
        },
        //service to get ticket by orderid
        getTicketdetailsById: function(orderId){
            return $resource(CONFIG.HTTP_HOST_APP + '/gsg/api/order/' + orderId,{
                get:{method:'GET'},
                // header:{'Authorization':'bearer '+$localStorage.user_token},
                isArray : true
            })
        },
    }
})
.factory('UserService', function ($resource,CONFIG,$http) {
    return{
        getAllUsers: function () {
            return $resource( CONFIG.HTTP_HOST_APP +'/gsg/api/users',{
			  get:{method:'GET'},
			//   header:{'Authorization':'bearer '+$localStorage.user_token},
			  isArray : true
            })
        },
        getUsersById: function (user_id) {
            return $resource( CONFIG.HTTP_HOST_APP +'/gsg/api/users/id/' + user_id ,{
			  get:{method:'GET'},
			//   header:{'Authorization':'bearer '+$localStorage.user_token},
			  isArray : true
            })
        }
    }
})
.factory('ServicesService', function ($resource,CONFIG,$http) {
    return{
        getAllServices: function(){
            return $resource(CONFIG.HTTP_HOST_APP + '/gsg/api/master/services',{
                get:{method:'GET'},
                // header:{'Authorization':'bearer '+$localStorage.user_token},
                isArray : true
            })
        }
    }
})
.factory('MasterService',function(CONFIG,$resource,$http){
    return{
        getAllStates: function(){
            return $resource(CONFIG.HTTP_HOST_APP + '/gsg/api/master/states',{
                get:{method:'GET'},
                // header:{'Authorization':'bearer '+$localStorage.user_token},
                isArray : true
            })
        }
    }
})
.factory('VehicleService',function(CONFIG,$resource,$http){
    return{
        getVehicleMakeModel: function() {
            return $resource( CONFIG.HTTP_HOST_APP +'/gsg/api/master/vehicles',{
                get:{method:'GET'},
                // oheader:{'Authorization':'bearer '+$localStrage.user_token},
                isArray : true
            })
        } ,
        addVehicle: function(user_id) {
            return $resource( CONFIG.HTTP_HOST_APP +'/gsg/api/users/' + user_id + '/vehicle',{
                save:{method:'POST'},
                // header:{'Authorization':'bearer '+$localStorage.user_token},
                isArray : true
            })
        }, 
    }
})


;app.factory("MasterModel",function(ApiCall) {
  var masterModel = {
    schemes : [],
    states:[],
    vehicles:[]
  };
  masterModel.getSchemes = function() {
    if(this.schemes) {
      return this.schemes;
    }
    else{
      // api call to get server data and keep in schemes
      ApiCall.getSchemes(function(data){
        this.schemes = data.data;
        return this.schemes ;
      },function(err){
        console.error("error in getting schemes ",err);
        return null;
      })
    }
  }
  masterModel.getStates = function(callback) {
    if(masterModel.states.length) {
      callback(null,masterModel.states);
    }
    else{
      // api call to get server data and keep in states
      ApiCall.getAllStates(function(data){
        masterModel.states = data.data;
        callback(null,masterModel.states) ;
      },function(err){
        console.log("Error in getting states");
        callback(err,null) ;
      })
    }
  }
  masterModel.getAllVehicles = function(callback) {
    if(masterModel.vehicles.length) {
      callback(null,masterModel.vehicles);
    }
    else{
      // api call to get server data and keep in vehicles
      ApiCall.getAllVehicles(function(data){
        masterModel.vehicles = data.data;
        callback(null,masterModel.vehicles) ;
      },function(err){
        console.log("Error in getting vehicles");
        callback(err,null) ;
      })
    }
  }
  return masterModel;
})
;app.factory("UserModel",function() {
  var userModel = {};
  userModel.setUser = function(user){
    userModel.user = user;
  }
  userModel.getUser = function(user){
    return userModel.user;
  }
  userModel.unsetUser = function(user){
    userModel.user = null ;
  }
  return userModel;
})
;app.directive('fileModell', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
// app.directive('updateHeight',function () {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             $ta = element;
//             var window_height = $(window).height();
//             $ta.css({
//               'min-height':window_height - 100+'px'
//             })
//         }
//     };
// });
app.directive('starRating', function(){
    return {
        restrict: 'EA',
        template:
          '<ul class="star-rating" ng-class="{readonly: readonly}">' +
          '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
          '    <i class="fa fa-star"></i>' + // or &#9733
          '  </li>' +
          '</ul>',
        scope: {
          ratingValue: '=ngModel',
          max: '=?', // optional (default is 5)
          onRatingSelect: '&?',
          readonly: '=?'
        },
        link: function(scope, element, attributes) {
            if (scope.max == undefined) {
              scope.max = 5;
            }
            function updateStars() {
              scope.stars = [];
              for (var i = 0; i < scope.max; i++) {
                scope.stars.push({
                  filled: i < scope.ratingValue
                });
              }
            };
            scope.toggle = function(index) {
              if (scope.readonly == undefined || scope.readonly === false){
                scope.ratingValue = index + 1;
                scope.onRatingSelect({
                  rating: index + 1
                });
              }
            };
            scope.$watch('ratingValue', function(oldValue, newValue) {
              if (newValue || newValue === 0) {
                updateStars();
              }
            });
          }
    };
});
app.directive('fileModel', ['$parse', function ($parse) {
   return {
      restrict: 'A',
      scope: {
         fileread: "=",
         filename: "=",
      },
      link: function(scope, element, attrs) {
         element.bind('change', function(){
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
               scope.$apply(function(){
                  scope.fileread = e.target.result;
                  scope.filename = element[0].files[0].name;
               });
            };
            fileReader.readAsDataURL(element[0].files[0]);
         });
      }
   };
}]);
app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.directive('floatsOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                // if (text) {
                    var transformedInput = text.replace(/[^[0-9\.]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                // }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.directive('capitalize', function(uppercaseFilter, $parse) {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          if(inputValue){
            input = inputValue.toLowerCase();
           var capitalized = input.substring(0,3).toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }
            return capitalized;
          }
         }
         var model = $parse(attrs.ngModel);
         modelCtrl.$parsers.push(capitalize);
         capitalize(model(scope));
     }
   };
});