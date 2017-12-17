calcApp.factory('productService', function($http, $q){
    return{
        products: async function(name){
            var products;
            if(name == undefined){
                await $http({
                    method: 'POST',
                    url: '/getProducts',
                    }).then(function successCallback(data) {
                        products = parseData(data.data.products); //получаем данные 
                    }, function errorCallback(response) {
                    });
            }else{
                obj = { name: name };
                await $http({
                    method: 'POST',
                    url: '/getProducts',
                    data: obj
                }).then(function successCallback(data) {
                    if(data != undefined){
                        var temp = [];
                        products = parseData(data.data.products);
                        for(var i = 0; i < products.length;i++){
                            if(products[i].name.toLowerCase().indexOf(name.toLowerCase(), 0) === 0){
                            temp.push(products[i]);
                            }
                        }
                        products = temp;
                        return products;
                    }
                }, function errorCallback(response) { 
                });
            }
            return products;
        },
        save: async function(data, formName){
            var products;
            await $http({
                method: 'POST',
                url: '/saveProduct',
                data: data,
                }).then(function successCallback(data) {
                  products = data.data;
                });
            return products;
        },
        deleteProduct: async function(product){
            var products;
            await $http({
                method: 'POST',
                url: '/deleteProduct',
                data: product,
                }).then(function successCallback(data) {
                    products = data.data;
                });
            return products;
        }
    };
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