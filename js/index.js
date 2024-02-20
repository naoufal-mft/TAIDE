//author: S.SEKKOUMI

const path = require('path');
const mysql =require("mysql2");
const express =require("express");
const app=express();

app.set("view engine", "ejs");
app.engine('html', require('ejs').renderFile);

app.use("/assets",express.static("assets"));
app.use("/css",express.static("css"));
app.use("/js", express.static("js")); // Pour les fichiers statiques dans le répertoire "js"
app.use("/csv_files", express.static("csv_files")); // Pour les fichiers statiques dans le répertoire "csv_files"

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

app.get("/",function(req,res){
   
    res.sendFile(path.join(__dirname, '..', 'html', 'index.html'));
})


// Modify the '/buttons' route handler
app.get('/buttons', (req, res) => {
    const query = 'SELECT * FROM stocks where user=25';
    
    connection.query(query, (err, results) => {
        
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
      } else {
        
        // Process the results and send them to the client
        const buttons = results.map(result => `<button class="btn btn-primary me-2" id="${result.stock}">${result.stock}</button>`);
        console.log(buttons[0]);
        res.send(buttons.join('\n'));
      }
    });
  });
  app.listen(4505)