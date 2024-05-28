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
//deklarerar routes
const authRoutes = require("./routes/authroutes");
const protected = require("./routes/protected");
const notprotected = require("./routes/notprotected");

//stöd för ta json-format och tillåter tillgång från andra sidor
app.use(express.json());
app.use(cors());

//Ansluter till mongoDB.
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Error connecting to database: " + error);
})

//Startar servern
app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});

//authRoutes används för att logga in och registrera användare
app.use('/account', authRoutes);

//Används där inte authentisering krävs
app.use("/", notprotected);

//Används för skyddade routes funktionen authenticateToken() används för att verifiera token innan tillgång ges.
app.use("/protected", authtenticateToken, protected);

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
    //verifierar token returnerar error eller skickar med req.username
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if (err) {
            return res.status(403).json({ message: "Not authorized: Wrong token." })
        }
        req.username = username;
        next();
    })
}
