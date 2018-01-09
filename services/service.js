angular.module('serviceModule', ['ngResource'])
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
});

