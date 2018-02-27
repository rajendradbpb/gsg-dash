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
  .state('changePassword',{
    templateUrl:'view/changePassword.html',
    url:'/changePwd',
    controller:'Main_Controller',
    resolve:{
      logout: checkLoggedout
    }
  })
  .state('office',{
    templateUrl:'view/office.html',
    url:'/office',
    controller:'Office_Controller',
    resolve:{
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
   'HTTP_HOST_APP':'http://101.53.136.166:8090'
  //  'HTTP_HOST_APP':'http://101.53.136.166:8091' // unit
  //  'HTTP_HOST_APP':'http://192.168.0.9:8090' // chetan
   // 'HTTP_HOST_APP':'http://192.168.0.12:8090' // sarbe
});
