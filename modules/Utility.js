angular.module("Utility",[])
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
    //return true;
  }



  return formService;


})
