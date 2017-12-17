var calcApp = angular.module("calculatorApp", [
  'ngAnimate',
  'ngRoute',
  'ngMaterial',
  'ngAria',
  'toaster',
]);

calcApp.controller("MainController", function($scope, $route, toaster, productService){
  $scope.products;
  $scope.productsInSumm = [];
  $scope.totalSumm = 0;
  // $scope.load = false;
  $scope.product = productService.products;


  $scope.getProducts = function(name){
    $scope.load = true;
    productService.products(name).then( data =>{
      $scope.products = data;
    });
    $scope.load = false;
  };

  $scope.save = function(data, formName){
    debugger;
    $scope.load = true;
      $scope.products = productService.save(data, formName);
      $scope.getProducts();
      toaster.pop('success', "Product save", "product was successfuly added");
      $scope.load = false;
  }

  $scope.deleteProduct = function(product){
      $scope.products = productService.deleteProduct(product);
      $scope.getProducts();
      toaster.pop('success', "Product delete", "product was successfuly deleted");
  }

  $scope.addToSumm = function(product, weight){
    if(!$scope.productsInSumm.includes(product)){
      weight = !!weight ? weight : 100; 
      let productToSum = {};
      angular.copy(product, productToSum);
      
      productToSum.properties.calories *= (weight > 0) ? parseFloat(weight)/100 : 0;
      $scope.productsInSumm.push(productToSum);
      toaster.pop('success', "Add to Summ", "product was successfuly added");
    }
    $scope.totalSumm = 0;
    for (var i = 0; i < $scope.productsInSumm.length; i++) {
      $scope.totalSumm += parseFloat($scope.productsInSumm[i].properties.calories);
    }
  }
  $scope.deleteFromSumm = function(product){
    debugger;
    for (let i = 0; i < $scope.productsInSumm.length; i++) {
      if($scope.productsInSumm[i].name == product.name){
        $scope.totalSumm -= $scope.productsInSumm[i].properties.calories;
        $scope.productsInSumm.splice(i, 1);
        toaster.pop('success', "Product delete", "product was successfuly deleted from summ");
      }
    }
  }
})
calcApp.controller('TitleController', function($scope) {
  $scope.title = 'Amount of calories';
})