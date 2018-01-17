app.controller('scheme_controller' , function($scope, ApiCall,$stateParams,NgTableParams){
    //function to get all schemes
    $scope.getSchemes = function(){
        //service to get all schemes..
        ApiCall.getSchemes(function(response){
            console.log(response.data);
            $scope.schemeList = response.data;
        }, function(error){
            console.log(error);

        });
    };
    // function to get scheme Details..
    $scope.getSchemeDetails =  function(){
        $scope.schemeDetails = $stateParams.schemeDetails;
        console.log( $scope.schemeDetails);
        $scope.schemeData = new NgTableParams;
        $scope.schemeData.settings({
            dataset : $scope.schemeDetails.schemeServiceDtls
        })
    };

});
