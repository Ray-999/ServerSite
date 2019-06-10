const express = require('express');
const app = express();
var mysql = require('mysql');
var http = require('http');
var bodyParser = require("body-parser");
var fs = require("fs"),
    rimraf = require("rimraf"),
    mkdirp = require("mkdirp"),
    multiparty = require('multiparty'),

    // paths/constants
    fileInputName = process.env.FILE_INPUT_NAME || "qqfile",
    publicDir = process.env.PUBLIC_DIR,
    nodeModulesDir = process.env.NODE_MODULES_DIR,
    uploadedFilesPath = process.env.UPLOADED_FILES_DIR,
    chunkDirName = "chunks",
    port = process.env.SERVER_PORT || 3000,
    maxFileSize = process.env.MAX_FILE_SIZE || 0; // in bytes, 0 for unlimited

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
    // console.log("Js submit");
    // ids = req.query.opt1;
    pls = req.query.opt2;
    den = req.query.opt3;
    pas = req.query.opt4;
    // console.log(ids);
    // console.log(pls);
    // console.log(den);
    // console.log(pas);
    // console.log(uploadedFilesPath);
    con.query("INSERT INTO Study.challenge7Ray (place, density, file_path) VALUES (?, ?, ?);",[pls, den, pas],function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send("Your submit is complete!");
        res.end();
    });
});


app.get ('/approve', function (req, res) {
        // if (err) throw err;
    console.log("hvhjhkjb");

        //moves the $file to $dir2
        var moveFile = (file, dir2)=>{
            //include the fs, path modules
            var fs = require('fs');
            var path = require('path');

            //gets file name and adds it to dir2
            var f = path.basename(file);
            var dest = path.resolve(dir2, f);

            fs.rename(file, dest, (err)=>{
                if(err) throw err;
                else console.log('Successfully moved');
            });
        };


        function getFiles(dir){
            fileList = [];

            var files = fs.readdirSync(dir);
            for(var i in files){
                if (!files.hasOwnProperty(i)) continue;
                var name = dir+'/'+files[i];
                if (!fs.statSync(name).isDirectory()){
                    fileList.push(name);
                }
            }
            return fileList;
        }

        var flist = getFiles('uploadFiles');
//move file1.htm from 'test/' to 'test/dir_1/'
        console.log(flist);
        console.log(fileList);
        console.log("mee");
        for(var i=0; i< fileList.length; i++) {
            moveFile(fileList[i], 'DataDir');
        }
        // console.log(result);
        res.send("!");
        res.end();
    });
// });




/**
 * NodeJs Server-Side Example for Fine Uploader (traditional endpoints).
 * Maintained by Widen Enterprises.
 *
 * This example:
 *  - handles non-CORS environments
 *  - handles delete file requests assuming the method is DELETE
 *  - Ensures the file size does not exceed the max
 *  - Handles chunked upload requests
 *
 * Requirements:
 *  - express (for handling requests)
 *  - rimraf (for "rm -rf" support)
 *  - multiparty (for parsing request payloads)
 *  - mkdirp (for "mkdir -p" support)
 */

// Dependencies





// routes
app.post("/uploads", onUpload);
app.delete("/uploads/:uuid", onDeleteFile);


function onUpload(req, res) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        var partIndex = fields.qqpartindex;

        // text/plain is required to ensure support for IE9 and older
        res.set("Content-Type", "text/plain");

        if (partIndex == null) {
            onSimpleUpload(fields, files[fileInputName][0], res);
        }
        else {
            onChunkedUpload(fields, files[fileInputName][0], res);
        }
    });
}

function onSimpleUpload(fields, file, res) {
    var uuid = fields.qquuid,
        responseData = {
            success: false
        };

    file.name = fields.qqfilename;

    if (isValid(file.size)) {
        moveUploadedFile(file, uuid, function() {
                responseData.success = true;
                res.send(responseData);
            },
            function() {
                responseData.error = "Problem copying the file!";
                res.send(responseData);
            });
    }
    else {
        failWithTooBigFile(responseData, res);
    }
}

function onChunkedUpload(fields, file, res) {
    var size = parseInt(fields.qqtotalfilesize),
        uuid = fields.qquuid,
        index = fields.qqpartindex,
        totalParts = parseInt(fields.qqtotalparts),
        responseData = {
            success: false
        };

    file.name = fields.qqfilename;

    if (isValid(size)) {
        storeChunk(file, uuid, index, totalParts, function() {
                if (index < totalParts - 1) {
                    responseData.success = true;
                    res.send(responseData);
                }
                else {
                    combineChunks(file, uuid, function() {
                            responseData.success = true;
                            res.send(responseData);
                        },
                        function() {
                            responseData.error = "Problem conbining the chunks!";
                            res.send(responseData);
                        });
                }
            },
            function(reset) {
                responseData.error = "Problem storing the chunk!";
                res.send(responseData);
            });
    }
    else {
        failWithTooBigFile(responseData, res);
    }
}

function failWithTooBigFile(responseData, res) {
    responseData.error = "Too big!";
    responseData.preventRetry = true;
    res.send(responseData);
}

function onDeleteFile(req, res) {
    var uuid = req.params.uuid,
        dirToDelete = uploadedFilesPath + uuid;

    rimraf(dirToDelete, function(error) {
        if (error) {
            console.error("Problem deleting file! " + error);
            res.status(500);
        }

        res.send();
    });
}

function isValid(size) {
    return maxFileSize === 0 || size < maxFileSize;
}

function moveFile(destinationDir, sourceFile, destinationFile, success, failure) {
    mkdirp(destinationDir, function(error) {
        var sourceStream, destStream;

        if (error) {
            console.error("Problem creating directory " + destinationDir + ": " + error);
            failure();
        }
        else {
            sourceStream = fs.createReadStream(sourceFile);
            destStream = fs.createWriteStream(destinationFile);

            sourceStream
                .on("error", function(error) {
                    console.error("Problem copying file: " + error.stack);
                    destStream.end();
                    failure();
                })
                .on("end", function(){
                    destStream.end();
                    success();
                })
                .pipe(destStream);
        }
    });
}

function moveUploadedFile(file, uuid, success, failure) {
    var destinationDir = "uploadFiles/",
        date = new Date,
        fileDestination = destinationDir + file.name + date;
    console.log("hahahha: ");
    console.log(destinationDir);
    moveFile(destinationDir, file.path, fileDestination, success, failure);
}

function storeChunk(file, uuid, index, numChunks, success, failure) {
    var destinationDir = "uploadFiles/" + chunkDirName + "/",
        date = new Date,
        chunkFilename = getChunkFilename(index, numChunks),
        fileDestination = destinationDir + chunkFilename + date;
    console.log(destinationDir);

    moveFile(destinationDir, file.path, fileDestination, success, failure);
}

function combineChunks(file, uuid, success, failure) {
    var chunksDir = uploadedFilesPath + uuid + "/" + chunkDirName + "/",
        date = new Date,
        destinationDir = "uploadFiles/",
        fileDestination = destinationDir + file.name + date;
    console.log(destinationDir);


    fs.readdir(chunksDir, function(err, fileNames) {
        var destFileStream;

        if (err) {
            console.error("Problem listing chunks! " + err);
            failure();
        }
        else {
            fileNames.sort();
            destFileStream = fs.createWriteStream(fileDestination, {flags: "a"});

            appendToStream(destFileStream, chunksDir, fileNames, 0, function() {
                    rimraf(chunksDir, function(rimrafError) {
                        if (rimrafError) {
                            console.log("Problem deleting chunks dir! " + rimrafError);
                        }
                    });
                    success();
                },
                failure);
        }
    });
}

function appendToStream(destStream, srcDir, srcFilesnames, index, success, failure) {
    if (index < srcFilesnames.length) {
        fs.createReadStream(srcDir + srcFilesnames[index])
            .on("end", function() {
                appendToStream(destStream, srcDir, srcFilesnames, index + 1, success, failure);
            })
            .on("error", function(error) {
                console.error("Problem appending chunk! " + error);
                destStream.end();
                failure();
            })
            .pipe(destStream, {end: false});
    }
    else {
        destStream.end();
        success();
    }
}

function getChunkFilename(index, count) {
    var digits = new String(count).length,
        zeros = new Array(digits + 1).join("0");

    return (zeros + index).slice(-digits);
}

app.listen(port);