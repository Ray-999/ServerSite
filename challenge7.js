const express = require('express');
const app = express();
var mysql = require('mysql');
var http = require('http');
var bodyParser = require("body-parser");
const port = 3000;
app.listen(port);

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
    Table: "challenge7Ray"
});

app.get ('/submit', function (req, res){
    console.log("Js submit");
    // ids = req.query.opt1;
    pls = req.query.opt2;
    den = req.query.opt3;
    pas = req.query.opt4;
    // console.log(ids);
    console.log(pls);
    console.log(den);
    console.log(pas);

    con.query("INSERT INTO Study.challenge7Ray (place, density, file_path) VALUES (?, ?, ?);",[pls, den, pas],function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send("Your submit is complete!");
        res.end();
    });
});