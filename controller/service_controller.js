app.controller('service_controller',function($scope){
    $scope.active_tab = "major";
    $scope.tabChange = function(tab){
      $scope.active_tab = tab;
    }
});