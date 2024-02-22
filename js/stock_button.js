//author: S.SEKKOUMI


const path = require('path');
const mysql =require("mysql2");
const express =require("express");
const app=express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);


app.use("/assets",express.static("assets"));
app.use("/data_bb", express.static("data_bb")); 
app.use("/data_macd", express.static("data_macd"));
app.use("/data_sentiment", express.static("data_sentiment"));  

const connection= mysql.createConnection({
    host:"localhost",
    user:"yourusername",
    password:"yourpassword",
    database:"databasename"
});
const sessionStore = new MySQLStore({
  host:"localhost",
    user:"yourusername",
    password:"yourpassword",
    database:"databasename",
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

app.get("/",function(req,res){
   
    res.sendFile(path.join(__dirname, '..', 'html', 'strat.html'));
})


// Modify the '/buttons' route handler
app.get('/buttons', (req, res) => {
    const query = 'SELECT * FROM stocks where user= ?';
    
    connection.query(query, req.session.username,(err, results) => {
        
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
      } else {
        
        // Process the results and send them to the client
        const buttons = results.map(result => `<button class="btn btn-primary me-2">${result.stock}</button>`);
        
        res.send(buttons.join('\n'));
      }
    });
  });
  app.get('/username', (req, res) => {
    const query = 'SELECT * FROM user where iduser= ?';
    
    connection.query(query, req.session.username,(err, results) => {
        
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
      } else {
        
        // Process the results and send them to the client
        
        res.send(results[0].username);
      }
    });
  });
  app.listen(4502)
