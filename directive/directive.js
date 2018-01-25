app.directive('fileModell', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
// app.directive('updateHeight',function () {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             $ta = element;
//             var window_height = $(window).height();
//             $ta.css({
//               'min-height':window_height - 100+'px'
//             })
//         }
//     };
// });
app.directive('starRating', function(){
    return {
        restrict: 'EA',
        template:
          '<ul class="star-rating" ng-class="{readonly: readonly}">' +
          '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
          '    <i class="fa fa-star"></i>' + // or &#9733
          '  </li>' +
          '</ul>',
        scope: {
          ratingValue: '=ngModel',
          max: '=?', // optional (default is 5)
          onRatingSelect: '&?',
          readonly: '=?'
        },
        link: function(scope, element, attributes) {
            if (scope.max == undefined) {
              scope.max = 5;
            }
            function updateStars() {
              scope.stars = [];
              for (var i = 0; i < scope.max; i++) {
                scope.stars.push({
                  filled: i < scope.ratingValue
                });
              }
            };
            scope.toggle = function(index) {
              if (scope.readonly == undefined || scope.readonly === false){
                scope.ratingValue = index + 1;
                scope.onRatingSelect({
                  rating: index + 1
                });
              }
            };
            scope.$watch('ratingValue', function(oldValue, newValue) {
              if (newValue || newValue === 0) {
                updateStars();
              }
            });
          }
    };
});
app.directive('fileModel', ['$parse', function ($parse) {
   return {
      restrict: 'A',
      scope: {
         fileread: "=",
         filename: "=",
      },
      link: function(scope, element, attrs) {
         element.bind('change', function(){
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
               scope.$apply(function(){
                  scope.fileread = e.target.result;
                  scope.filename = element[0].files[0].name;
               });
            };
            fileReader.readAsDataURL(element[0].files[0]);
         });
      }
   };
}]);
app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.directive('floatsOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                // if (text) {
                    var transformedInput = text.replace(/[^[0-9\.]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                // }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.directive('capitalize', function(uppercaseFilter, $parse) {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          if(inputValue){
            input = inputValue.toLowerCase();
           var capitalized = input.substring(0,3).toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }
            return capitalized;
          }
         }
         var model = $parse(attrs.ngModel);
         modelCtrl.$parsers.push(capitalize);
         capitalize(model(scope));
     }
   };
});