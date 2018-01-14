app.factory("MasterModel",function(ApiCall) {
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
