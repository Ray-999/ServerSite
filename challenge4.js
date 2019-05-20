const express = require('express');
const app = express();
var mysql = require('mysql');
var http = require('http');
var bodyParser = require("body-parser");
const port = 3001;
app.listen(port);
var Password;
var ID;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

var con = mysql.createConnection({
    host: "10.11.90.16",
    user: "study",
    password: "Study1111%", 
    port: "3306",
    Schema: "Study",
    Table: "challenge4Ray"
});

console.log("hjgvwfdhdsvjiejwdqbkocm");

app.post('/submit', function (req, res){

    Id = req.body.ID;
    Password = req.body.Password;
    con.query("SELECT password AS password FROM Study.challenge4Ray WHERE id = Id", function (err, result) {
        if (err) throw err;
        console.log(result);
        console.log(result[0]);
        console.log(result[0].password);
        console.log(Password);
        if(Password === result[0].password){
            console.log("PASS");
            res.write("PASS");
            res.end();
        }
    });
});







