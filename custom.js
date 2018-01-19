var app = angular.module("gsg", ['ui.router','serviceModule', 'ui.bootstrap','ngMap' ,'ngStorage','ngTable','ngResource','ui.utils','WebService','Utility']);
app.config(function($stateProvider, $urlRouterProvider,$httpProvider) {
  $httpProvider.interceptors.push(function ($q, $location, $window,$localStorage,Constants) {
    return {
      request: function (config) {
        if(Constants.debug) {
          console.log("calling web service ->>>>>>>>>>>" , config.url);
          console.log("Data web service ->>>>>>>>>>>" , JSON.stringify(config.data));
        }
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
   'HTTP_HOST_APP':'http://101.53.136.166:8091' // unit
   // 'HTTP_HOST_APP':'http://192.168.0.9:8090' // chetan
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
        "debug":true,
        "storagePrefix": "goAppAccount$",
        "rtToken"      :"1-14-e17a4afd91c6d3c47594e0d0d7ae3258",
        "getTokenKey" : function() {return this.storagePrefix + "token";},
        "getLoggedIn" : function() {return this.storagePrefix + "loggedin";},
        "alertTime"   : 3000,
        "getUsername" : function() {return this.storagePrefix + "username";},
        "getPassword" : function() {return this.storagePrefix + "password";},
        "getIsRemember" : function() {return this.storagePrefix + "isRemember";},
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
    getUserById: {
      "url": "/gsg/api/users/id/:user_id",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getUserByContact: {
      "url": "/gsg/api/users/contact/:contactNbr",
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
    changePassword: {
      "url": "/gsg/api/users/id/:userId/changePassword",
      "method": "PUT",
      "params":{userId:"@userId"},
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
;app.controller("Login_controller",function($scope,$state,$rootScope,NgTableParams,CONFIG,Util,$localStorage,$httpParamSerializer,$http,ApiCall,$uibModal){
    
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
            $rootScope.isLoggedin = true;
            
            
            ApiCall.getUserByContact($scope.user , function(response){
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
    

});


;/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller("Main_Controller", function($scope, $state, $rootScope, $uibModal,NgTableParams, $localStorage, Util, ApiCall) {

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

      Util.alertMessage('danger','Error in password change');
      $uibModalInstance.close();
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
;app.controller('scheme_controller' , function($scope, ApiCall,$stateParams,NgTableParams){
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
});;app.controller("TicketController",function($scope,$state,$rootScope,NgTableParams,Util,$uibModal,TicketService,$stateParams,ApiCall){
  $scope.active_tab = "new";
  $scope.ticket = {};
  $scope.ticket.statuses = ['CREATED','EMERGENCY','RESOLVED','CLOSED'];
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
    $scope.updateTicket = function() {
      alert("Service yet to be created !!! ");
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
});
app.controller('locationModalController', function($scope, $uibModalInstance, location) {
  $scope.location = location;
  $scope.ok = function(user) {

  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});
;app.controller("User_controller",function($scope,$state,$rootScope,MasterModel,NgTableParams,FormService,$stateParams,Util,$localStorage,UserService,$uibModal,MasterService,ApiCall){
    $scope.userList = {};
    $scope.active_tab = "BD";
    $scope.tabChange = function(tab){
        $scope.active_tab = tab;
    }
    $scope.createUserModal = function() {
      var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'view/modals/newUserModal.html',
          controller: "createUserModalCtrl",
          size: 'md',
          resolve: {
            getUsers : function(){
              return $scope.getAllUsers;
            }
          }
      });
    }
    $scope.getAllUsers = function(){
        ApiCall.getAllUsers(function(response){
            console.log(response);
                $scope.userList = response.data;
                $scope.userData = new NgTableParams;
                $scope.userData.settings({
                    dataset : $scope.userList
                })
        }, function(error){

        });

    };
    $scope.profileUpdate = function(form) {
      console.log('form' , form);

      console.log('user' , $scope.user);
      var status = FormService.validateForm(form,function(status,message){
        if(!status){
            console.log('form 2' , status,message);
            Util.alertMessage("warning","Invalid data for "+message+" fields");
        }
        else{
            $scope.user.dob = moment($scope.user.dob).format('YYYY-MM-DD');
            $scope.user.anniversaryDate = moment($scope.user.anniversaryDate).format('YYYY-MM-DD');
            ApiCall.updateUserById($scope.user, function(response){
                console.log(response);
                Util.alertMessage('success','User Details Updated successfully...');
            }, function(error){
                console.log(error);
                Util.alertMessage('danger','User Details Cannot be updated...');
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
    $scope.addOrderModal = function(userData){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modals/new_ticket.html',
            controller: 'orderModalController',
            size: 'md',
            resolve: {
              userId : function(){
                  return userData;
              }
            }
        });

    };

    $scope.getAllStates = function(address){
        $scope.stateList = [];
        ApiCall.getAllStates(function(response){

            $scope.stateList = response.data;
            for(var i in $scope.stateList){
              console.log(address);
              if($scope.stateList[i].stateCd.toLocaleLowerCase() == address.state.toLocaleLowerCase()){
                address.stateObj = $scope.stateList[i];
                console.log('userState ',address.stateObj );
                //$scope.getDistrict(user);
              }
            }
        }, function(error){

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
    $scope.getUserDetails = function(user_id){
        $scope.obj = {
            user_id :$stateParams.user_id
        };
        var domyData = {
            houseNbr:'',
            locality:'',
            city :'',
            state :'',
            district :'',
            country :'',
            zip :''
        };

        console.log($scope.obj);
        ApiCall.getUserById($scope.obj ,function(response){
            console.log(response);
            $scope.user = response.data;
            // $scope.user.dob = new Date(dob);
            // get districtList based on state
            $scope.getDistrict($scope.user);
            console.log($scope.user);
            if($scope.user.address.length == 0){
                $scope.user.address.push(domyData);
            };
            $scope.vehicleData = new NgTableParams;
            $scope.vehicleData.settings({
                dataset : $scope.user.userVehicles
            })

            console.log($scope.user.address);
        },function(error){

        });


    };

    $scope.addVehicle = function(userData){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modals/new_vehicle.html',
            controller: 'vehicleModalController',
            size: 'md',
            resolve: {
              userId : function(){
                  return userData;
              }
            }
        });

    };
    $scope.showVehicleDetails = function(vehicleData){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modals/vehicleDetailsModal.html',
            controller: 'vehicleDetailsModalController',
            size: 'md',
            resolve: {
              vehicleData : function(){
                  return vehicleData;
              }
            }
        });

    };



});


app.controller('vehicleModalController',function($scope,$uibModalInstance,VehicleService,$stateParams,Util,ApiCall){

    $scope.insuranceArr = [true,false];
    $scope.insuranceTypeArr =["Comprehensive","Zero Depreciation","Third party only"];
    $scope.getVehicledata = function(){
        ApiCall.getVehicleMakeModal(function(response){
            console.log(response);
                $scope.vehicleDatas = response.data;
                $scope.makes = [];
                angular.forEach(response.data,function(item){
                    $scope.makes.push(item.make);
                })
                console.log($scope.makes);
        }, function(error){
            console.log(error);
        });


    };
    $scope.getModel = function(selectedModel){
        console.log("coming");
        console.log(selectedModel);

        console.log($scope.vehicleDatas);
        angular.forEach($scope.vehicleDatas,function(item){
            if(item.make == selectedModel){
                $scope.vehiclesLists = item.vehicles;
                $scope.vehicleModelList = [];
                angular.forEach(item.vehicles,function(vehicle){
                    $scope.vehicleModelList.push(vehicle.models);
                })
            }
        });
        console.log($scope.vehicleModelList);


    };
    $scope.getVehicleType = function(model){
        console.log(model);
        console.log($scope.vehiclesLists);
        angular.forEach($scope.vehiclesLists,function(item){
            if(item.models == model){
                $scope.type = item.type;
                $scope.subType = item.subType;
                $scope.wheels = item.wheels;
            }
        });
    };
    $scope.getMfgYear = function(){
        $scope.currentYear = 2018;
        $scope.mfgYearArr = [];
        for(i = 0;i< 30; i++ ){
            $scope.mfgYearArr.push($scope.currentYear--);
        }
        console.log($scope.mfgYearArr);
    };
     $scope.addVehicle = function(){
        $scope.vehicle.user_id = $stateParams.user_id;
        console.log($scope.vehicle.user_id);
        $scope.vehicle.vehicle = {
            make :$scope.vehicle.make,
            models : $scope.vehicle.model,
            subType : $scope.subType,
            type :  $scope.type,
            wheels : $scope.wheels
        };
        $scope.vehicle.expiryDate = moment($scope.vehicle.expiryDate).format('YYYY-MM-DD');
        console.log($scope.vehicle);
        ApiCall.addVehicle($scope.vehicle , function(response){
            console.log(response);
              Util.alertMessage('success','Vehicle added successfully...');
        }, function(error){
            console.log(error);
              Util.alertMessage('danger','Vehicle is not added try again');
        });
         $uibModalInstance.close();
     };



      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
});

app.controller('vehicleDetailsModalController',function($scope,$uibModalInstance,vehicleData){
      $scope.vehicleData = vehicleData;
      $scope.ok = function () {
        // service call to update vihicle details
         $uibModalInstance.close();
       };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
});
// create user modal , used to create new user by ccare
app.controller('createUserModalCtrl',function($scope,$uibModalInstance,Util,ApiCall,getUsers){
      $scope.ok = function (user) {
        // service call to update vihicle details
        ApiCall.createUser(user,function(response) {
          Util.alertMessage("success","User created");
          getUsers();// calls parent function to update user listing
          $uibModalInstance.close();
        },function(error){
          Util.alertMessage("warning","Error in user creation");
          $uibModalInstance.close();
        })

       };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
});
//new order modal
app.controller('orderModalController', function($scope,$uibModalInstance,Util,ApiCall,userId,$state){
    $scope.userdata = userId;

    $scope.getVehicledata = function(){

        ApiCall.getVehicleMakeModal(function(response){
            console.log(response);
                $scope.vehicleDatas = response.data;
                $scope.makes = [];
                angular.forEach(response.data,function(item){
                    $scope.makes.push(item.make);
                })
                console.log($scope.makes);
        }, function(error){
            console.log(error);
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

    $scope.ticket ={};
    $scope.ok = function(){

        console.log($scope.userdata.userId);

        // $scope.ticket.vehicle ={};
            $scope.ticket.userId = $scope.userdata.userId;
            $scope.ticket.location = [0,0];
            $scope.ticket.serviceType = "EMERGENCY";
            // $scope.ticket.vehicle = {
            //     make :$scope.ticket.make,
            //     models : $scope.ticket.model,
            //     subType : $scope.subType,
            //     type :  $scope.type,
            //     wheels : $scope.wheels
            // };
            console.log($scope.ticket);
            delete $scope.ticket['extVehicle']; // removing extra parameter
            ApiCall.createOrder($scope.ticket , function(response){
                console.log(response.data.orderId);
                Util.alertMessage("success","Order Created successfully..");
                $state.go('ticketDetails',{orderId : response.data.orderId});
                $uibModalInstance.close();
            }, function(error){
                console.log(error);
                Util.alertMessage("warning","Error in order creation.");
                $uibModalInstance.close();
            });

    };
    $scope.cancel = function(){
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
    schemes : null
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