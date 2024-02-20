const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const encoder = bodyParser.urlencoded();
app.use(bodyParser.json());
app.use("/assets",express.static("assets"));
app.use(bodyParser.urlencoded({ extended: true }));

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
        connection.query('UPDATE user SET nom=?, prenom=? WHERE username=?', [first_name, last_name, username], function (error, results, fields) {
            if (error) {
                return connection.rollback(function () {
                    console.error('Error updating user table:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                });
            }

            // Update login table
            connection.query('UPDATE login SET email=? WHERE id_user = (SELECT iduser FROM user WHERE username=?)', [email, username], function (error, results, fields) {
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
    const query = 'SELECT user.*, login.email FROM ai_website_db.user INNER JOIN ai_website_db.login ON ai_website_db.user.iduser = ai_website_db.login.id_user WHERE user.iduser = 25;';
    
    connection.query(query, (err, results) => {
        
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
    const query = 'SELECT stock FROM  ai_website_db.stocks WHERE user = 25;';
    
    connection.query(query, (err, results) => {
        
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
    const deleteQuery = 'DELETE IGNORE FROM stocks WHERE user = 25 ';
    
    // Iterate through selected stocks and execute the delete query for each
    
        connection.query(deleteQuery, (deleteError, deleteResults) => {
            if (deleteError) {
                return res.status(500).json({ error: 'Error deleting user stocks' });
            }
        
    });

    // Insert new stocks for the user
    if (selectedStocks && Object.keys(selectedStocks).length !== 0 ) {
        console.log("selectedStocks.stock")
    const insertQuery = 'INSERT INTO Stocks (user, stock) VALUES (25, ?)';
    const stocksToInsert = Array.isArray(selectedStocks.stock) ? selectedStocks.stock : [selectedStocks.stock];
    console.log(stocksToInsert);
    stocksToInsert.forEach(stock => {
        //console.log(stock);
        connection.query(insertQuery, [ stock], (insertError, insertResults) => {
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






app.listen(4503, () => {
    console.log('Server is running on port 4502');
});