//ytb video :https://www.youtube.com/watch?v=Mn0rdbJPWEo
//author: S.SEKKOUMI

const path = require('path');
var http = require("http");
const mysql =require("mysql2");
const express =require("express");
const bodyParser= require("body-parser");
const crypto = require('crypto');
const app=express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const encoder = bodyParser.urlencoded();


app.use("/assets",express.static("assets"));
const connection= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"azerty",
    database:"ai_website_db"
});
const sessionStore = new MySQLStore({
    host:"localhost",
    user:"root",
    password:"azerty",
    database:"ai_website_db",
    clearExpired: true,
});
app.use(session({
  secret: 'dfr324567u6uhbfgfgh8iijmn',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
}));
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully")
})

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'html', 'login.html'));
})

app.post("/",encoder,function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    var hash = crypto.createHash('md5').update(password).digest('hex');

    connection.query("select * from login where email=? and password = ? ",[email,hash],function(error,results,fields){
        if (error) throw error;
        if(results.length> 0){
            console.log("check1")
            req.session.username = results[0].id_user;
            res.redirect("/welcome");
        }else {
            console.log("aaaaaaaaaa")
            res.render(path.join(__dirname, '..', 'html', 'login.html'), { errorMessage: "Incorrect email/password" });

        }
        res.end();
    })
})

app.get("/welcome",function(req,res){
    res.writeHead(301, {
        Location: "http://localhost:4503/"
      }).end();
})

app.listen(4500)
