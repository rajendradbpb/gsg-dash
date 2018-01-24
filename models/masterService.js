app.factory("MasterModel",function(ApiCall) {
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
