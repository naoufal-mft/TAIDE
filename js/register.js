//author: S.SEKKOUMI

const path = require('path');
const mysql =require("mysql2");
const express =require("express");
const bodyParser= require("body-parser");
const app=express();

const encoder = bodyParser.urlencoded();


app.use("/assets",express.static("assets"));
const connection= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"azerty",
    database:"ai_website_db"
});

connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully")
})
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'html', 'register.html'));
})


app.post("/",encoder,function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    var name=req.body.first_name;
    var surname=req.body.last_name;
    var username=req.body.username;
    var stocks = req.body.checkbox
    console.log(stocks)
    connection.query("INSERT INTO user (nom, prenom,username) VALUES (?, ?,?)", [name, surname,username], function(error, results, fields) {
        if (error) {
            // Handle the error
            console.error(error);
        } else {
            // Do something if the insertion is successful
            console.log("Stocks inserted successfully");
        }
    });
    connection.query("INSERT INTO login (id_user, email, password) VALUES((SELECT iduser FROM user WHERE username = ?) , ?, ?) ", [username,email, password], function(error, results, fields) {
        if (error) {
            // Handle the error
            console.error(error);
        } else {
            // Do something if the insertion is successful
            console.log("Stocks inserted successfully");
            
        }
    });
    
    stocks.forEach(function(symbol) {
        connection.query("INSERT INTO stocks (user,stock) VALUES((SELECT iduser FROM user WHERE username = ?) , ?)" , [username,symbol], function(error, results, fields) {
            if (error) {
                // Handle the error
                console.error(error);
            } else {
                // Do something if the insertion is successful
                console.log("Record inserted successfully for symbol:", symbol);
                

            }
        });
    });
    res.redirect("/login");
    
})

app.get("/login",function(req,res){
    res.writeHead(301, {
        Location: "http://localhost:4500/"
      }).end();
})

app.listen(4501)