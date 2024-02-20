//author: S.SEKKOUMI


const mysql =require("mysql2");
const express =require("express");
const bodyParser= require("body-parser");
const app=express();

const encoder = bodyParser.urlencoded();
app.set("view engine", "ejs");
app.engine('html', require('ejs').renderFile);

app.use("/assets",express.static("assets"));
const connection= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"1234Azer@",
    database:"ai_website_db"
});

connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully")
})
app.get("/",function(req,res){
    res.sendFile("C:\\Users\\samir\\Desktop\\TRAIDE\\register.html");
})

app.post("/",encoder,function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    var name=req.body.first_name;
    var surname=req.body.last_name;
    var username=req.body.username;
    var stocks = req.body.checkbox
    console.log(stocks)
    connection.query("INSERT INTO user (nom, prenom,username) VALUES (?, ?)", [name, surname,username], function(error, results, fields) {
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
            res.redirect("/login");
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
    
})

app.get("/login",function(req,res){
    res.sendFile("C:\\Users\\samir\\Desktop\\TRAIDE\\login.html")
})

app.listen(4501)