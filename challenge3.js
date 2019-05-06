var mysql = require('mysql');
var http = require('http');

var con = mysql.createConnection({
    host: "10.11.90.15",
    user: "study",
    password: "Study1111%",
    port: "3306",
    Schema: "Study",
    Table: "Country"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT COUNT(*) AS Count FROM Study.Country WHERE Continent = 'AS'", function (err, result) {
        if (err) throw err;
        console.log(result);
        console.log(result[0].Count);
        console.log("Total countries in Asia is " + result[0].Count + " !");
        http.createServer(function (req, res) {
            res.write("Total countries in Asia is " + result[0].Count + " !");
            res.end();
        }).listen(3008);
    });
});

