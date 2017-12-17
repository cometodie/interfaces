var express = require('express');
var fs = require('fs');
var bodyParser = require("body-parser");

var app = express();
var path = 'D:/Desktop/WEB/interfaces/';

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path + '/build/index.html');
});

app.use("/styles", express.static(path + '/build/css'));
app.use("/scripts", express.static(path + '/build/js'));
app.use("/img", express.static(path + '/build/img'));

app.post("/getProducts", function (request, response) {
  if(!request.body) return response.sendStatus(400);
    var obj = {};
    obj.products = fs.readFileSync("data/products.json");
    response.send(obj);
});

app.post("/saveProduct", function (request, response) {
  if(!request.body) return response.sendStatus(400);
    var obj = {
        name : request.body.name,
        properties : {
          calories : request.body.calories,
          protein : request.body.protein,
          fats : request.body.fats,
          carbohydrates : request.body.carbohydrates,
        }
    }
    
    products = (JSON.parse(fs.readFileSync("data/products.json")));
    products.push(obj);
    fs.writeFileSync("data/products.json", JSON.stringify(products,"", 4));
    response.send(products);
});

app.post("/deleteProduct", function (request, response) {
  if(!request.body) return response.sendStatus(400);
    products = (JSON.parse(fs.readFileSync("data/products.json")));
    for(var i = 0; i < products.length;i++){
      if(products[i].name == request.body.name){
        products.splice(i,1);
      }
    }
    fs.writeFileSync("data/products.json", JSON.stringify(products,"", 4));
    response.send(products);
});

app.listen(3000, function () {
  console.log("server started at 127.0.0.1:3000")
});