//ytb video :https://www.youtube.com/watch?v=Mn0rdbJPWEo
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
    res.sendFile(__dirname + "/login.html");
})

app.post("/",encoder,function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    connection.query("select * from login where email=? and password = ? ",[email,password],function(error,results,fields){
        if (error) throw error;
        if(results.length> 0){
            console.log("check1")
            res.redirect("/welcome");
        }else {
            console.log("aaaaaaaaaa")
            res.render(__dirname + "/login.html", { errorMessage: "Incorrect email/password" });

        }
        res.end();
    })
})

app.get("/welcome",function(req,res){
    res.sendFile(__dirname + "/home.html")
})

app.listen(4500)