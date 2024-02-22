//author: S.SEKKOUMI
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const encoder = bodyParser.urlencoded();
app.use(bodyParser.json());
app.use("/assets",express.static("assets"));
app.use(bodyParser.urlencoded({ extended: true }));

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
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'html', 'profile.html'));
})

app.post('/updateUserDetails', (req, res) => {
    console.log('Received POST request at /updateUserDetails');

    const { username, email, first_name, last_name } = req.body;

    // Start a transaction
    connection.beginTransaction(function (err) {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Update user table
        connection.query('UPDATE user SET nom=?, prenom=? , username=? WHERE iduser=?', [first_name, last_name, username,req.session.username], function (error, results, fields) {
            if (error) {
                return connection.rollback(function () {
                    console.error('Error updating user table:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                });
            }

            // Update login table
            connection.query('UPDATE login SET email=? WHERE id_user = ?', [email, req.session.username], function (error, results, fields) {
                if (error) {
                    return connection.rollback(function () {
                        console.error('Error updating login table:', error);
                        res.status(500).json({ error: 'Internal Server Error' });
                    });
                }

                // Commit the transaction
                connection.commit(function (err) {
                    if (err) {
                        return connection.rollback(function () {
                            console.error('Error committing transaction:', err);
                            res.status(500).json({ error: 'Internal Server Error' });
                        });
                    }

                    console.log('User details updated successfully!');
                    res.sendFile(path.join(__dirname, '..', 'html', 'profile.html'));
                });
            });
        });
    });
});


app.get('/data', (req, res) => {
    const query = 'SELECT user.*, login.email FROM ai_website_db.user INNER JOIN ai_website_db.login ON ai_website_db.user.iduser = ai_website_db.login.id_user WHERE user.iduser = ? ;';
    
    connection.query(query,[req.session.username], (err, results) => {
        
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
      } else {
        
        // Process the results and send them to the client
        
        var userObject = {
            username: results[0].username,
            email: results[0].email,
            firstName: results[0].nom,
            lastName: results[0].prenom
        }
        var arr=[results[0].username,results[0].email,results[0].nom,results[0].prenom]
        //res.send(buttons.join('\n'));
        console.log(arr);
        res.send(arr);
      }
    });
  });


  app.get('/stocks', (req, res) => {
    const query = 'SELECT stock FROM  ai_website_db.stocks WHERE user = ?;';
    
    connection.query(query,[req.session.username], (err, results) => {
        
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
      } else {
        
        // Process the results and send them to the client
        
        //res.send(buttons.join('\n'));
        res.send(results);
      }
    });
  });



  app.post('/updateUserStocks', (req, res) => {
    const  selectedStocks  = req.body;
console.log(selectedStocks)
    // Assume you have a 'userStocks' table with columns 'iduser' and 'stock'
    // Delete existing stocks for the user
    const deleteQuery = 'DELETE IGNORE FROM stocks WHERE user = ? ';
    
    // Iterate through selected stocks and execute the delete query for each
    
        connection.query(deleteQuery,[req.session.username], (deleteError, deleteResults) => {
            if (deleteError) {
                return res.status(500).json({ error: 'Error deleting user stocks' });
            }
        
    });

    // Insert new stocks for the user
    if (selectedStocks && Object.keys(selectedStocks).length !== 0 ) {
        console.log("selectedStocks.stock")
    const insertQuery = 'INSERT INTO Stocks (user, stock) VALUES (?, ?)';
    const stocksToInsert = Array.isArray(selectedStocks.stock) ? selectedStocks.stock : [selectedStocks.stock];
    console.log(stocksToInsert);
    stocksToInsert.forEach(stock => {
        //console.log(stock);
        connection.query(insertQuery, [ [req.session.username],stock], (insertError, insertResults) => {
            if (insertError) {
                return res.status(500).json({ error: 'Error inserting user stocks' });
            }
        });
    });
    
    
}
res.writeHead(301, {
    Location: "http://localhost:4503/"
  }).end();
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

app.listen(4503, () => {
    console.log('Server is running on port 4502');
});
