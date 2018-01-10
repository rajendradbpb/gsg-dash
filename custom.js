var app = angular.module("gsg", ['ui.router','serviceModule', 'ui.bootstrap', 'ngStorage','ngTable','ngResource','ui.utils','WebService']);
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
app.run(["$http", "$rootScope", "$localStorage", "$timeout", "EnvService", "Constants", function($http,$rootScope,$localStorage,$timeout,EnvService,Constants){
  EnvService.setSettings(Constants);
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
;angular.module('WebService', [])
.factory('API', ["$http", "$resource", "EnvService", function($http, $resource, EnvService) {
  return {
    createTicket: {
      "url": "/ticket",
      "method": "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    gertTicket: {
      "url": "/ticket",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    
  }
}])
.factory('ApiCall', ["$http", "$resource", "API", "EnvService", "ApiGenerator", function($http, $resource, API, EnvService,ApiGenerator) {
  return $resource('/',null, {
    createTicket: ApiGenerator.getApi('createTicket'),
    createTicket: ApiGenerator.getApi('gertTicket'),
    
  })
}])

.factory('ApiGenerator', ["$http", "$resource", "API", "EnvService", function($http, $resource, API, EnvService) {
    return {
      getApi: function(api) {
        var obj = {};
        obj = angular.copy(API[api]);
        obj.url = EnvService.getBasePath() + obj.url;
        return obj;
      }
    }
}])

.factory('EnvService',["$http", "$localStorage", function($http,$localStorage){
  var envData = env = {};
  var settings =  {};

  return{
    setSettings : function(setting) {
      settings = setting;
      this.setEnvData(setting.envData);
    },
    getSettings : function(param) {
      if(param){
        return settings[param];
      }
      return null; // default
    },
    setEnvData: function (data) {
      envData = data[data.env];
    },
    getEnvData: function () {
      return envData;
    },
    getBasePath: function (env) {
      return this.getEnvData()['basePath']
    }
  }
}]);
;app.controller("Login_controller",["$scope", "$state", "$rootScope", "NgTableParams", "Util", "$localStorage", "$httpParamSerializer", "$http", function($scope,$state,$rootScope,NgTableParams,Util,$localStorage,$httpParamSerializer,$http){

    
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
;app.controller("TicketController",["$scope", "$state", "$rootScope", "NgTableParams", "Util", "$uibModal", "TicketService", function($scope,$state,$rootScope,NgTableParams,Util,$uibModal,TicketService){
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
    }
   
}]);


;app.controller("User_controller",["$scope", "$state", "$rootScope", "NgTableParams", "$stateParams", "Util", "$localStorage", "UserService", "$uibModal", "MasterService", function($scope,$state,$rootScope,NgTableParams,$stateParams,Util,$localStorage,UserService,$uibModal,MasterService){
    $scope.userList = {};
    $scope.active_tab = "BD";
    $scope.tabChange = function(tab){
        $scope.active_tab = tab;
    }
    $scope.getAllUsers = function(){
        UserService.getAllUsers().get(function(response){
            console.log(response);
            $scope.userList = response.data;
            $scope.userData = new NgTableParams;
            $scope.userData.settings({
                dataset : $scope.userList
            })
        },function(error){

        });
    };
    $scope.createTicket = function(userData) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'view/modals/new_ticket.html',
          controller: 'addTicketModalController',
          size: 'md',
          resolve: {
            userId : function(){
                return userData;
            }
          }
        });
    };

    $scope.getAllStates = function(){
        $scope.stateList = [];
        MasterService.getAllStates().get(function(response){
            console.log(response);
            $scope.stateList = response.data;
        },function(error){
            console.log(error);
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
    $scope.isCollapsed= false;
    $scope.getUserDetails = function(user_id){
        $scope.user_id = $stateParams.user_id;
        console.log($scope.user_id);
        UserService.getUsersById($scope.user_id).get(function(response){
            $scope.user = response.data;
            $scope.getDistrict($scope.user);
            console.log($scope.user);
            console.log($scope.user.address[0].zip);
            console.log($scope.user.address[0].district);
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
    $scope.vehicleDetails = function(userData){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modals/vehicleDetails.html',
            controller: 'vehicleModalController',
            size: 'md',
            resolve: {
              userId : function(){
                  return userData;
              }
            }
        });

    };
    


}]);
app.controller('addTicketModalController', ["$scope", "$uibModalInstance", "$timeout", "Util", "ServicesService", "userId", "$http", "TicketService", function ($scope, $uibModalInstance,$timeout,Util,ServicesService,userId,$http,TicketService) {
    $scope.userdata = userId;
    $scope.createTicket = {};

    $scope.selectScheme = function(subType){
        console.log("coming");
        console.log(subType);
        $scope.schemeList = [];
        angular.forEach($scope.userdata.schemes, function(item){
            if(item.schemeType == subType){
                $scope.schemeList.push(item);
            }
        });
        console.log($scope.schemeList);
    }
    $scope.getSelectedServices = function(serviceType){
        ServicesService.getAllServices().get(function(response){
            console.log(response);
            $scope.ServiceArr = [];
            angular.forEach(response.data,function(item){
                if(item.category == serviceType){
                    $scope.ServiceArr.push(item);
                }
            });
            console.log($scope.ServiceArr);
        },function(error){
            console.log(error);
        });
    };

    $scope.ticket = {};
    $scope.ok = function () {
        console.log('coming')
      console.log($scope.userdata.userId);
        $scope.ticket.userId = $scope.userdata.userId;
        $scope.ticket.location = [20.2897321,85.8469173];
        $scope.ticket.services=[];
        angular.forEach($scope.ServiceArr,function(service){
            if(service.isSelect){
                $scope.ticket.services.push(service.serviceId);
            }
        });
        console.log( $scope.ticket);
        if( $scope.ticket.services.length > 0 && $scope.ticket.vehicle)
        {
            TicketService.createTicket().save($scope.ticket,function(response){
                console.log(response);
                Util.alertMessage('danger','Ticket Created successfully...');


            },function(error){
                console.log(error);
            });
        }
        else{
            Util.alertMessage('danger','Please choose one service and vechile');
        }
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
}]);

app.controller('vehicleModalController',["$scope", "$uibModalInstance", "VehicleService", "$stateParams", "Util", function($scope,$uibModalInstance,VehicleService,$stateParams,Util){
    
    $scope.insuranceArr = [true,false];    
    $scope.insuranceTypeArr =["edfes","Comprehensive","Zero Depreciation","Third party only"];
    $scope.getVehicledata = function(){
        VehicleService.getVehicleMakeModel().get(function(response){
            console.log(response);
            $scope.vehicleDatas = response.data;
            $scope.makes = [];
            angular.forEach(response.data,function(item){
                $scope.makes.push(item.make);
            })
            console.log($scope.makes);
        },function(error){
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
    }


    $scope.ok = function () {
        $uibModalInstance.close();
      };

      $scope.addVehicle = function(){
        $scope.user_id = $stateParams.user_id;
        console.log($scope.user_id);
        $scope.vehicle.vehicle = {
            make : $scope.vehicle.make,
            models : $scope.vehicle.model,
            subType : $scope.subType,
            type :  $scope.type,
            wheels : $scope.wheels
        }
        console.log($scope.vehicle);
         VehicleService.addVehicle( $scope.user_id).save($scope.vehicle,function(response){
            console.log(response);
            Util.alertMessage('danger','Vehicle added successfully...');
             
         },function(error){
              
             console.log(error);
             Util.alertMessage('danger','Vehicle is not added try again');
         });
         $uibModalInstance.close();
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