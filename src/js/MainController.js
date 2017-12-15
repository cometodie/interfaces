var calcApp = angular.module("calculatorApp", [
    'ngAnimate',
    'ngRoute',
    'ngMaterial',
    'ngAria',
    'toaster',
]);

calcApp.controller("MainController", function($scope, $http, $route, toaster){
    $scope.products = [];
    $scope.productsInSumm = [];
    $scope.totalSumm = 0;
    $scope.load = false;
    $scope.countCalories = 100;
    $scope.getProducts = function(name){
      if(name == undefined){
        $scope.load = false;
        $http({
            method: 'POST',
            url: '/getProducts',
            }).then(function successCallback(data) {
              $scope.products = parseData(data.data.products);
              $scope.load = true;
            }, function errorCallback(response) {
        });
      }else{
        obj = { name: name };
        $scope.load = false;
        $http({
          method: 'POST',
          url: '/getProducts',
          data: obj
          }).then(function successCallback(data) {
            if(data != undefined){
              var temp = [];
              $scope.products = parseData(data.data.products);
                for(var i = 0; i < $scope.products.length;i++){
                  if($scope.products[i].name.toLowerCase().indexOf(name.toLowerCase(), 0) === 0){
                    temp.push($scope.products[i]);
                  }
                }
                $scope.products = temp;
                $scope.load = true;
            }
          }, function errorCallback(response) { 
          });
      }
      $route.reload();
    };

    $scope.save = function(data, formName){
      $http({
        method: 'POST',
        url: '/saveProduct',
        data: data,
        }).then(function successCallback(data) {
          $scope.products = data.data;
        });
    }

    $scope.deleteProduct = function(product){
      $http({
        method: 'POST',
        url: '/deleteProduct',
        data: product,
        }).then(function successCallback(data) {
            $scope.products = data.data;
        });
    }
    $scope.addToSumm = function(product){
      if(!$scope.productsInSumm.includes(product)){
        product.calories = $scope.countCalories;
        $scope.productsInSumm.push(product);
        toaster.pop('success', "Add to Summ", "product was successfuly added");
      }
      $scope.totalSumm = 0;
      for (var i = 0; i < $scope.productsInSumm.length; i++) {
        $scope.totalSumm += parseFloat($scope.productsInSumm[i].properties.calories);
      }
    }
    function isPrime(element, index, array) {
      var start = 2;
      while (start <= Math.sqrt(element)) {
        if (element % start++ < 1) {
          return false;
        }
      }
      return element > 1;
    }
    
    function parseData(array){
      
      const extraByteMap = [ 1, 1, 1, 1, 2, 2, 3, 0 ];
      
      var count = array.data.length;
      var str = "";
      for (var index = 0;index < count;)
      {
        var ch = array.data[index++];
        if (ch & 0x80)
        {
          var extra = extraByteMap[(ch >> 3) & 0x07];
          if (!(ch & 0x40) || !extra || ((index + extra) > count))
            return null;

          ch = ch & (0x3F >> extra);
          for (;extra > 0;extra -= 1)
          {
            var chx = array.data[index++];

            if ((chx & 0xC0) != 0x80)
              return null;
            ch = (ch << 6) | (chx & 0x3F);
          }
        }
        str += String.fromCharCode(ch);
      }
      return JSON.parse(str);
    }
})
calcApp.controller('TitleController', function($scope) {
  $scope.title = 'Amount of calories';
})
