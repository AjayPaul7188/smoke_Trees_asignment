const express = require('express');
const mySql = require('mysql2');
const app = express();

app.use(express.json())

const db = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ajmysql@123',
    database: 'userDetails'
});


db.connect((err) => {
    if(err) {
        console.log('mySql coponnectin error:', err);
        process.exit(1);
    }
    console.log('Connected to MySql');
});


app.post('/register', (req, res) => {
    const { name, email, addresses } = req.body;

    if (!name || !email || !addresses || !Array.isArray(addresses)) {
        return res.status(400).send('Invalid input');
    }

    const insertUserQuery = `INSERT INTO user (name, email) VALUES (?, ?)`;
    db.query(insertUserQuery, [name, email], (userErr, userResult) => {
        if(userErr) {
            console.error('Error inserting user:', userErr);
            return res.status(500).send('Error creating user');
        }

        const userId = userResult.insertId;
        const insertAddressQuery = `INSERT INTO address (user_id, street, city, state, zip_code) VALUES ?`;

        const addressValues = addresses.map((address) => [
            userId,
            address.street,
            address.city,
            address.state,
            address.zip_code,
        ]);

        db.query(insertAddressQuery, [addressValues], (addressErr) => {
            if(addressErr) {
                console.error('Error inserting addresses:', addressErr);
                return res.status(500).send('Error adding addresses');
            }

            res.send('User and address successfully registered');
        });

    });

});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});