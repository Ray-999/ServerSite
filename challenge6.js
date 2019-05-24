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
    Table: "challenge6Ray"
});

app.get ('/table', function (req, res){
    con.query("SELECT * FROM Study.challenge6Ray",function (err, result1) {
        if (err) throw err;
        res.send(result1);
        res.end();
    });

});

app.get ('/submit', function (req, res){
    op1 = req.query.opt1;
    op2 = req.query.opt2;
    op3 = req.query.opt3;
    console.log(op1);
    console.log(op2);
    console.log(op3);

    // if we have more than one input value, then we can use for loop, too.
    // since we have only one input, we don't do it here.
    var conditions = [op2, op3];
    var colume = ['type', 'property'];
    var str = 'SELECT id, name, property, type FROM Study.challenge6Ray';
    var str0 = str;
    if(op1 !== ''){
        str = str + ' WHERE name LIKE ' + "'" + op1 + "'"
    }
    console.log(str);
    console.log(conditions);
    if(str !== str0){
        for(var i = 0; i < conditions.length; i++) {
            if (conditions[i] !== '') {
                str = str + ' AND ' + colume[i] + ' = ' + "'"  + conditions[i] + "'"
            }
        }
    }
    else{
        for(var a = 0; a < conditions.length; a++) {
            if (conditions[a] !== '') {
                str = str + " WHERE "+colume[a] + ' = ' + "'"  + conditions[a] + "'";
                var b = a;
                break;
            }
            console.log(a)
        }
        for(b; b < conditions.length; b++) {
            if (conditions[b] !== '') {
                str = str + ' AND ' + colume[b] + ' = ' + "'"  + conditions[b] + "'"
            }
            console.log(b)
        }
    }
    console.log(str);
        con.query(str,function (err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
            res.end();
        });

    // if(op1 !== null && op2 !== '' && op3 !== '') {
    //     con.query("SELECT id, name, property, type FROM Study.challenge6Ray WHERE type = ? AND property = ? AND name LIKE ?", [op2, op3, op1], function (err, result) {
    //         if (err) throw err;
    //         console.log(result);
    //         res.send(result);
    //         res.end();
    //     });
    // }
    // else if(op1 !== null && op2 !== 'you choose one'){
    //     con.query("SELECT id, name, property, type FROM Study.challenge6Ray WHERE type = ? AND name LIKE ?", [op2, op1], function (err, result) {
    //         if (err) throw err;
    //         console.log(result);
    //         res.send(result);
    //         res.end();
    //     });
    // }
    // else if(op2 !== 'you choose one' && op3 !== 'you choose one') {
    //     con.query("SELECT id, name, property, type FROM Study.challenge6Ray WHERE type = ? AND property = ?", [op2, op3], function (err, result) {
    //         if (err) throw err;
    //         console.log(result);
    //         res.send(result);
    //         res.end();
    //     });
    // }
    // else if(op1 !== null && op3 !== 'you choose one') {
    //     con.query("SELECT id, name, property, type FROM Study.challenge6Ray WHERE property = ? AND name LIKE ?", [op3, op1], function (err, result) {
    //         if (err) throw err;
    //         console.log(result);
    //         res.send(result);
    //         res.end();
    //     });
    // }
});
