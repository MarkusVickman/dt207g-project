//express server med api hostad hos azure som lagrar och hämtar data från en mongoDB databas.
//Variable .env
require('dotenv').config({ path: './.env' });
//lägger till express och cors för att kunna ansluta från vilken adress som helst
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
//Inställningar för express
const app = express();
const port = process.env.PORT;
const authRoutes = require("./routes/authroutes");
const protected = require("./routes/protected");
const notprotected = require("./routes/notprotected");

//stöd för ta json-format och 
app.use(express.json());
app.use(cors());



//Ansluter till mongoDB.
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Error connecting to database: " + error);
})




//Välkomst meddelande om webbadress/api anropas
app.use('/account', authRoutes);

app.use("/", notprotected);

app.use("/protected", authtenticateToken, protected);

//Startar servern
app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});

//Endast för att kontrollera om servern är igång
app.get("/check", (req, res) => {
    res.status(200).json({ message: "Api-server is up and running."});
});


//funktionen som säkerställer att anropen har en giltig JWT-token med som authorization: bearer token. Returnerar även payload(användarnamn) som req. 
function authtenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null || token.lenght === 0) {
        return res.status(401).json({ message: "Not authorized: Token is missing." });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if (err) {
            return res.status(403).json({ message: "Not authorized: Wrong token." })
        }

        req.username = username;
        next();
    })
}

