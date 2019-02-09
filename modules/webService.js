angular.module('WebService', [])
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
    updateWorkshopStatus: {
      "url": "/gsg/api/users/ws/status",
      "method": "PUT",
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
    removeServiceFromOrder: {
      "url": "/gsg/api/dashboard/:orderDtlId/:position/remove",
      "method": "DELETE",
      "params":{orderDtlId:"@orderDtlId",
            position:'@position'},
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    updateServiceArea: {
      "url": "/gsg/api/dashboard/updateSA/:userId",
      "method": "PUT",
      "params":{userId:"@userId",
        },
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getOfficeDetails: {
      "url": "/gsg/api/dashboard/office",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    saveNewOfficeAddress: {
      "url": "/gsg/api/dashboard/office",
      "method": "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    updateOfcAddress: {
      "url": "/gsg/api/dashboard/office/:position",
      "method": "PUT",
      "params":{position:"@position",
        },
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    updateWSDocs: {
      "url": "/gsg/api/users/ws/updateDocs/:id",
      "method": "PUT",
      "params":{id:"@id",
        },
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getReferral: {
      "url": "/gsg/api/dashboard/salesUser",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    postReferral: {
      "url": "/gsg/api/dashboard/salesUser",
      "method": "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    updateReferral: {
      "url": "/gsg/api/dashboard/salesUser/:empid",
      "method": "PUT",
      "params":{empid:"@empid"},
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    deleteReferral: {
      "url": "/gsg/api/dashboard/salesUser/:empid",
      "method": "DELETE",
      "params":{empid:"@empid"},
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
    updateWSDocs: ApiGenerator.getApi('updateWSDocs'),
    getOrdersCount: ApiGenerator.getApi('getOrdersCount'),
    getOrderByStatus  : ApiGenerator.getApi('getOrderByStatus'),
    getUserByContact : ApiGenerator.getApi('getUserByContact'),
    changePassword : ApiGenerator.getApi('changePassword'),
    getOrderByUser : ApiGenerator.getApi('getOrderByUser'),
    getEngineerList : ApiGenerator.getApi('getEngineerList'),
    updateOrder : ApiGenerator.getApi('updateOrder'),
    updateWorkshopStatus : ApiGenerator.getApi('updateWorkshopStatus'),
    getUserCount :  ApiGenerator.getApi('getUserCount'),
    getUserByRole :  ApiGenerator.getApi('getUserByRole'),
    preresetpwd :  ApiGenerator.getApi('preresetpwd'),
    resetpwd :  ApiGenerator.getApi('resetpwd'),
    getAllVehicles :  ApiGenerator.getApi('getAllVehicles'),
    updateOrderDetails :  ApiGenerator.getApi('updateOrderDetails'),
    takeFeedback :  ApiGenerator.getApi('takeFeedback'),
    removeServiceFromOrder :  ApiGenerator.getApi('removeServiceFromOrder'),
    updateServiceArea :  ApiGenerator.getApi('updateServiceArea'),
    getOfficeDetails :  ApiGenerator.getApi('getOfficeDetails'),
    saveNewOfficeAddress :  ApiGenerator.getApi('saveNewOfficeAddress'),
    updateOfcAddress : ApiGenerator.getApi('updateOfcAddress'),
    getReferral : ApiGenerator.getApi('getReferral'),
    postReferral : ApiGenerator.getApi('postReferral'),
    updateReferral : ApiGenerator.getApi('updateReferral'),
    deleteReferral : ApiGenerator.getApi('deleteReferral'),
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
