var app = angular.module("gsg", ['ui.router','serviceModule', 'ui.bootstrap', 'ngStorage','ngTable','ngResource','ui.utils','WebService']);
app.config(function($stateProvider, $urlRouterProvider,$httpProvider) {
  // $httpProvider.interceptors.push(function ($q, $location, $window,$localStorage,Constants) {
  //   return {
  //     request: function (config) {
  //       config.headers['Authorization'] = 'token '+Constants.rtToken;
  //       return config;
  //     },
  //     response: function (response) {
  //       if (response.status === 401) {
  //         $location.path('/');
  //       }
  //       return response || $q.when(response);
  //     }
  //   };
  //});
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
app.run(function($http,$rootScope,$localStorage,$timeout,EnvService,Constants){
  EnvService.setSettings(Constants);
});
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
});;app.constant("Constants", {
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
;angular.module('WebService', [])
.factory('API', function($http, $resource, EnvService) {
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
})
.factory('ApiCall', function($http, $resource, API, EnvService,ApiGenerator) {
  return $resource('/',null, {
    createTicket: ApiGenerator.getApi('createTicket'),
    createTicket: ApiGenerator.getApi('gertTicket'),
    
  })
})

.factory('ApiGenerator', function($http, $resource, API, EnvService) {
    return {
      getApi: function(api) {
        var obj = {};
        obj = angular.copy(API[api]);
        obj.url = EnvService.getBasePath() + obj.url;
        return obj;
      }
    }
})

.factory('EnvService',function($http,$localStorage){
  var envData = env = {};
  var settings =  {};

  return{
    setSettings : function(setting) {
      settings = setting;
      // setting env
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
});
;app.controller("Login_controller",function($scope,$state,$rootScope,NgTableParams,Util,$localStorage,$httpParamSerializer,$http){
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
;/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller("Main_Controller",function($scope,$state,$rootScope,NgTableParams,$localStorage,Util){

    $scope.active_tab = 'lists';
    $scope.tabChange = function(tab) {
      $scope.active_tab = tab;
    }
    $scope.signOut = function(){
        $localStorage.token =null;
        $rootScope.isLoggedin=false;
        $state.go('login');
    }
});
app.controller('DatePickerCtrl' , ['$scope', function ($scope) {
  // $scope.task = {};
  // $scope.ClosingDateLimit  = function(){
  //   $scope.startDates = $scope.task.startDate;
  //   console.log($scope.startDates);
  // }
      $scope.today = function() {
          $scope.dt = new Date();
      };
      $scope.today();

      $scope.clear = function () {
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
      $scope.formats = ['MM-dd-yyyy', 'dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd/MM/yyyy', 'yyyy-MMM','shortDate'];
      $scope.format = $scope.formats[4];
      $scope.format1 = $scope.formats[5];

  }
]);
;app.controller("TicketController",function($scope,$state,$rootScope,NgTableParams,Util,$uibModal,TicketService){
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
    $scope.createTicket = function() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'view/modals/new_ticket.html',
        controller: 'addTicketModalController',
        size: 'md',
        // resolve: {
          
        // }
      });
    }
});


;app.controller("User_controller",function($scope,$state,$rootScope,NgTableParams,Util,$localStorage,UserService,$uibModal){
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
    $scope.updateUserModal = function(userData){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modals/updateUser.html',
            controller: 'User_controller',
            size: 'md',
            resolve: {
                userUpdate: function () {
                    return userData;
                }
               
            }
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
   
});
app.controller('addTicketModalController', function ($scope, $uibModalInstance,ApiCall,$timeout,Util,ServicesService,userId) {
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
      $scope.serviceArray = [];
      angular.forEach($scope.repeatArr, function(items){
        if(items.isSelect){
          $scope.serviceArray.push(items);
        }
      });
      console.log( $scope.serviceArray);
      console.log("$scope.ticket   ",$scope.ticket);
      // service call to save ticket
      ApiCall.createTicket($scope.ticket,function(response) {
        Util.alertMessage("success","Ticket created");
        $timeout(function(){
          $uibModalInstance.close($scope.selected.item);
        },2000)
      },function(err) {
        Util.alertMessage("warning","ticket creation failed")
      })
      
    };
  
    $scope.cancel = function () {
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
});

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