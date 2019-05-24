const express = require('express');
const app = express();
var mysql = require('mysql');
var http = require('http');
var bodyParser = require("body-parser");
const port = 3000;
app.listen(port);

var con = mysql.createConnection({
    host: "10.11.90.16",
    user: "study",
    password: "Study1111%",
    port: "3306",
    Schema: "Study",
    Table: "challenge5Ray"
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get ('/submit', function (req, res){
    pets = req.query.pet;
    console.log(pets);
    con.query("SELECT response AS ans FROM Study.challenge5Ray WHERE name = ?",pets,function (err, result) {
        if (err) throw err;
        console.log(result);
        console.log(result[0]);
        console.log(result[0].ans);
            res.send(result[0].ans);
            res.end();
    });
    // if(pets === "spider"){
    //     res.send("I ");
    // }
    // else{
    //
    // }

});
