const express = require('express');
const app = express();
var mysql = require('mysql');
var http = require('http');
var bodyParser = require("body-parser");
const port = 3000;
app.listen(port);
var pets;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post('/submit', function (req, res){
    pets = req.body.pt;
    console.log(pets);
    if(pets === "spider"){
        res.send("I ");
    }
    else{

    }

});
