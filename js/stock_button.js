//author: S.SEKKOUMI


const path = require('path');
const mysql =require("mysql2");
const express =require("express");
const app=express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
app.set("view engine", "ejs");
app.engine('html', require('ejs').renderFile);

app.use("/assets",express.static("assets"));
const connection= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"azerty",
    database:"ai_website_db"
});
const sessionStore = new MySQLStore({
  host: "localhost",
  user: "root",
  password: "1234Azer@",
  database: "ai_website_db"
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
  app.listen(4502)
