app.factory("MasterModel",function(ApiCall) {
  var masterModel = {
    schemes : [],
    states:[]
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
      callback(masterModel.states);
    }
    else{
      // api call to get server data and keep in schemes
      ApiCall.getAllStates(function(data){
        masterModel.states = data.data;
        callback(masterModel.states) ;
      },function(err){
        console.log("Error in getting states");
        callback(masterModel.states) ;
      })
    }
  }
  return masterModel;
})
