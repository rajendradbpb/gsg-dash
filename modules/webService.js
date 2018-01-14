angular.module('WebService', [])
.factory('API', function($http, $resource) {
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

  }
})
.factory('ApiCall', function($http, $resource, API,ApiGenerator) {
  return $resource('/',null, {
    createTicket: ApiGenerator.getApi('createTicket'),
    createTicket: ApiGenerator.getApi('gertTicket'),
    getSchemes: ApiGenerator.getApi('getSchemes'),
    createUser: ApiGenerator.getApi('createUser'),

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
