var app = angular.module("gsg", ['ui.router','serviceModule', 'ui.bootstrap', 'ngStorage','ngTable','ngResource','ui.utils','WebService','Utility']);
app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider,$httpProvider) {
checkLoggedout.$inject = ["$q", "$timeout", "$rootScope", "$http", "$state", "$localStorage"];
checkLoggedin.$inject = ["$q", "$timeout", "$rootScope", "$http", "$state", "$localStorage"];
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
  .state('tickets',{
    templateUrl:'view/tickets.html',
    url:'/tickets',
    controller:'TicketController',
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
}]);
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
   'HTTP_HOST_APP':'http://101.53.136.166:8090'
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
  .factory('LOG', ["$rootScope", "$timeout", function($rootScope,$timeout) {
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
  }])
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
  }



  return formService;


})
;angular.module('WebService', [])
.factory('API', ["$http", "$resource", function($http, $resource) {
  return {
    createTicket: {
      "url": "/gsg/api/order",
      "method": "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getTickets: {
      "url": "/gsg/api/order",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getTicketdetailsById:{
      "url": "/gsg/api/order/:orderId",
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
      "url": "/gsg/api/users/create",
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


  }
}])
.factory('ApiCall', ["$http", "$resource", "API", "ApiGenerator", function($http, $resource, API,ApiGenerator) {
  return $resource('/',null, {
    createTicket: ApiGenerator.getApi('createTicket'),
    getSchemes: ApiGenerator.getApi('getSchemes'),
    createUser: ApiGenerator.getApi('createUser'),
    addVehicle: ApiGenerator.getApi('addVehicle'),
    getVehicleMakeModal: ApiGenerator.getApi('getVehicleMakeModal'),
    getAllStates: ApiGenerator.getApi('getAllStates'),
    getAllServices: ApiGenerator.getApi('getAllServices'),
    getUserById: ApiGenerator.getApi('getUserById'),
    getAllUsers: ApiGenerator.getApi('getAllUsers'),
    getTicketdetailsById: ApiGenerator.getApi('getTicketdetailsById'),
    getTickets: ApiGenerator.getApi('getTickets'),
   

  })
}])

.factory('ApiGenerator', ["$http", "$resource", "API", "CONFIG", function($http, $resource, API, CONFIG) {
    return {
      getApi: function(api) {
        var obj = {};
        obj = angular.copy(API[api]);
        obj.url = CONFIG.HTTP_HOST_APP + obj.url;
        return obj;
      }
    }
}])
;app.controller("Login_controller",["$scope", "$state", "$rootScope", "NgTableParams", "CONFIG", "Util", "$localStorage", "$httpParamSerializer", "$http", function($scope,$state,$rootScope,NgTableParams,CONFIG,Util,$localStorage,$httpParamSerializer,$http){


    $scope.user={mobile:'',password:''};
    $scope.login = function() {

        $scope.data = {
            grant_type:"password",
            username: $scope.user.mobile,
            password: $scope.user.password
        };
         $scope.encoded = btoa("android-client:anrdroid-XY7kmzoNzl100");
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
            $state.go('dashboard');
            console.log($localStorage.token);

        },function(error){

            console.log(error);
        });
  }

}]);
;/*****************************************************************************************************************/
app.controller("Main_Controller",["$scope", "$state", "$rootScope", "NgTableParams", "$localStorage", "Util", function($scope,$state,$rootScope,NgTableParams,$localStorage,Util){

    $scope.active_tab = 'lists';
    $scope.tabChange = function(tab) {
      $scope.active_tab = tab;
    }
    $scope.signOut = function(){
        $localStorage.token =null;
        $rootScope.isLoggedin=false;
        $state.go('login');
    }
    
}]);
app.controller('DatePickerCtrl' , ['$scope', function ($scope) {
      $scope.today = function() {
          $scope.dt = new Date();
      };
      $scope.today();

      $scope.clear = function () {
          $scope.dt = null;
      };

      $scope.toggleMin = function() {
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
      $scope.formats = ['MM-dd-yyyy', 'dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd/MM/yyyy', 'yyyy-MMM','shortDate'];
      $scope.format = $scope.formats[4];
      $scope.format1 = $scope.formats[5];

  }
]);
;app.controller('service_controller',["$scope", "ApiCall", function($scope,ApiCall){
    $scope.active_tab = "major";
    $scope.tabChange = function(tab){
      $scope.active_tab = tab;
    };
    $scope.getAllServices = function(serviceType){

        $scope.serviceType = serviceType;
        console.log($scope.serviceType);
        ApiCall.getAllServices(function(response){
            console.log(response);
        }, function(error){
            console.log(error);
        });
    };
}]);;app.controller("TicketController",["$scope", "$state", "$rootScope", "NgTableParams", "Util", "$uibModal", "TicketService", "$stateParams", function($scope,$state,$rootScope,NgTableParams,Util,$uibModal,TicketService,$stateParams){
  $scope.active_tab = "new";
  $scope.tabChange = function(tab){
    $scope.active_tab = tab;
  }
    $scope.getTickets = function(){
      console.log("inside the method");
      TicketService.getTickets().get(function(response){
        console.log(response);
       $scope.ticketList = response.data;
       $scope.ticketData = new NgTableParams;
       $scope.ticketData.settings({
         dataset : $scope.ticketList 
       })
      },function(error){
        console.log(error);
      });
    };

    $scope.ticketDetails =  function(){
      console.log("inside ticket details.");
      $scope.orderId=$stateParams.orderId;
      console.log($scope.orderId);
      TicketService.getTicketdetailsById($scope.orderId).get(function(response){
        console.log(response.data);
        $scope.data = response.data;
        $scope.vehicleData= response.data.orderDtls[0].product.usrVehicle;
        console.log($scope.vehicleData);

      },function(error){

      });

    };
    
   
}]);


;app.controller("User_controller",["$scope", "$state", "$rootScope", "MasterModel", "NgTableParams", "FormService", "$stateParams", "Util", "$localStorage", "UserService", "$uibModal", "MasterService", "ApiCall", function($scope,$state,$rootScope,MasterModel,NgTableParams,FormService,$stateParams,Util,$localStorage,UserService,$uibModal,MasterService,ApiCall){
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
      $scope.user.dob = $scope.user.dob ? $scope.user.dob.getFullYear()+"-"+($scope.user.dob.getMonth()+1)+"-"+$scope.user.dob.getDate() : null ;
      console.log('user' , $scope.user);
      var status = FormService.validateForm(form,function(status,message){
        console.log('form 2' , status,message);
        Util.alertMessage("warning","Invalid data for "+message+" fields");
      })
    }
    $scope.createTicket = function(userData) {
        console.log(userData);
        $scope.ticket ={};
        $scope.ticket.userId = userData.userId;
        $scope.ticket.location = [0,0];
        $scope.ticket.serviceType = "EMERGENCY";
        ApiCall.createTicket($scope.ticket ,function(response){
            console.log(response);
            Util.alertMessage('success','Ticket Created successfully...');

        },function(error){
            console.log(error);
        });
    };

    $scope.getAllStates = function(){
        $scope.stateList = [];
        ApiCall.getAllStates(function(response){
            console.log(response);
            $scope.stateList = response.data;
        }, function(error){

        });
        
    };
    $scope.getDistrict = function(user){
        $scope.districtList = [];
        angular.forEach( $scope.stateList,function(item){
            if(item.stateName == user.address[0].state){
                $scope.districtList = item.districts;
            }
        });
    };
    $scope.user = {};
    $scope.getUserDetails = function(user_id){
        $scope.obj = {
            user_id :$stateParams.user_id
        }
        
        console.log($scope.obj);
        ApiCall.getUserById($scope.obj ,function(response){
            console.log(response);
            $scope.user = response.data;
            $scope.getDistrict($scope.user);
            console.log($scope.user);
            $scope.vehicleData = new NgTableParams;
            $scope.vehicleData.settings({
                dataset : $scope.user.userVehicles
            })
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



}]);


app.controller('vehicleModalController',["$scope", "$uibModalInstance", "VehicleService", "$stateParams", "Util", "ApiCall", function($scope,$uibModalInstance,VehicleService,$stateParams,Util,ApiCall){

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
        }
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
}]);

app.controller('vehicleDetailsModalController',["$scope", "vehicleData", "$uibModalInstance", function($scope,vehicleData,$uibModalInstance){

    $scope.getVehicleDetails = function(){
         $scope.vehicle =vehicleData;
      };

      $scope.ok = function () {
         $uibModalInstance.close();
       };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
}]);
app.controller('createUserModalCtrl',["$scope", "$uibModalInstance", "Util", "ApiCall", "getUsers", function($scope,$uibModalInstance,Util,ApiCall,getUsers){
      $scope.ok = function (user) {
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
}]);
;angular.module('serviceModule', ['ngResource'])
.factory('loginService', ["$resource", "CONFIG", "$http", function ($resource,CONFIG,$http) {
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
}])
.factory('TicketService', ["$resource", "CONFIG", "$http", function ($resource,CONFIG,$http) {
    return{
        getTickets: function () {
            return $resource( CONFIG.HTTP_HOST_APP +'/gsg/api/order',{
			  get:{method:'GET'},
			  isArray : true
            })
        },
        createTicket: function(){
            return $resource(CONFIG.HTTP_HOST_APP + '/gsg/api/order',{
                save:{method:'POST'},
                isArray : true
            })
        },
        getTicketdetailsById: function(orderId){
            return $resource(CONFIG.HTTP_HOST_APP + '/gsg/api/order/' + orderId,{
                get:{method:'GET'},
                isArray : true
            })
        },
    }
}])
.factory('UserService', ["$resource", "CONFIG", "$http", function ($resource,CONFIG,$http) {
    return{
        getAllUsers: function () {
            return $resource( CONFIG.HTTP_HOST_APP +'/gsg/api/users',{
			  get:{method:'GET'},
			  isArray : true
            })
        },
        getUsersById: function (user_id) {
            return $resource( CONFIG.HTTP_HOST_APP +'/gsg/api/users/id/' + user_id ,{
			  get:{method:'GET'},
			  isArray : true
            })
        }
    }
}])
.factory('ServicesService', ["$resource", "CONFIG", "$http", function ($resource,CONFIG,$http) {
    return{
        getAllServices: function(){
            return $resource(CONFIG.HTTP_HOST_APP + '/gsg/api/master/services',{
                get:{method:'GET'},
                isArray : true
            })
        }
    }
}])
.factory('MasterService',["CONFIG", "$resource", "$http", function(CONFIG,$resource,$http){
    return{
        getAllStates: function(){
            return $resource(CONFIG.HTTP_HOST_APP + '/gsg/api/master/states',{
                get:{method:'GET'},
                isArray : true
            })
        }
    }
}])
.factory('VehicleService',["CONFIG", "$resource", "$http", function(CONFIG,$resource,$http){
    return{
        getVehicleMakeModel: function() {
            return $resource( CONFIG.HTTP_HOST_APP +'/gsg/api/master/vehicles',{
                get:{method:'GET'},
                isArray : true
            })
        } ,
        addVehicle: function(user_id) {
            return $resource( CONFIG.HTTP_HOST_APP +'/gsg/api/users/' + user_id + '/vehicle',{
                save:{method:'POST'},
                isArray : true
            })
        }, 
    }
}])


;app.factory("MasterModel",["ApiCall", function(ApiCall) {
  var masterModel = {
    schemes : null
  };
  masterModel.getSchemes = function() {
    if(this.schemes) {
      return this.schemes;
    }
    else{
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
}])
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
                    var transformedInput = text.replace(/[^[0-9\.]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.directive('capitalize', ["uppercaseFilter", "$parse", function(uppercaseFilter, $parse) {
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
}]);