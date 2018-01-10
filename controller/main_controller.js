/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller("Main_Controller",function($scope,$state,$rootScope,NgTableParams,$localStorage,Util){

    $scope.active_tab = 'lists';
    $scope.tabChange = function(tab) {
      $scope.active_tab = tab;
    }
    $scope.signOut = function(){
        $localStorage.token =null;
        $rootScope.isLoggedin=false;
        $state.go('login');
    }
    
});
app.controller('DatePickerCtrl' , ['$scope', function ($scope) {
  // $scope.task = {};
  // $scope.ClosingDateLimit  = function(){
  //   $scope.startDates = $scope.task.startDate;
  //   console.log($scope.startDates);
  // }
      $scope.today = function() {
          $scope.dt = new Date();
      };
      $scope.today();

      $scope.clear = function () {
          $scope.dt = null;
      };

      // Disable weekend selection
      /*
       $scope.disabled = function(date, mode) {
       return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
       };*/

      $scope.toggleMin = function() {
          // $scope.minDate = $scope.task.startDate;
          $scope.minDate = new Date();
          $scope.maxDate = new Date();
          $scope.dateMin = null || new Date();
      };
      $scope.toggleMin();

      $scope.open1 = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          $scope.opened = true;
      };

      $scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
      };

      $scope.mode = 'month';

      $scope.initDate = new Date();
      $scope.formats = ['MM-dd-yyyy', 'dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd/MM/yyyy', 'yyyy-MMM','shortDate'];
      $scope.format = $scope.formats[4];
      $scope.format1 = $scope.formats[5];

  }
]);
