//authRoutes används för att logga in och registrera användare

//const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

//Hämtar metoder och mongooseschema för inloggning och registrering
const Worker = require("../models/user");

//routes för registrering av användare som lagrar användaren i databasen med hjälp av metoden för new User, returnerar felmeddelande vid fel
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Invalid input, send username and password" });
        }
        else if (password.length < 6) {
            return res.status(400).json({ error: "Invalid input, password must be atleast 6 characters long." });
        }
        const worker = new Worker({ username, password });
        await worker.save();
        res.status(201).json({ messege: "User created" });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

//routes för login av användare som lagrar användarnamn som payload i JWT-token och returnerar JWT-token
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Missing username, password or both." });
        }

        const worker = await Worker.findOne({ username });

        if (!worker) {
            return res.status(401).json({ error: "Incorrect username, password or both." })
        }

        const isPasswordAMatch = await worker.comparePassword(password);
        if (!isPasswordAMatch) {
            return res.status(401).json({ error: "Incorrect username, password or both." })
        }
        if (worker.verified === false) {
            return res.status(401).json({ error: "Vänligen prata med admin eller din närmaste chef för att få inloggningsrättigheterna bekräftade." })
        }
        else {

            //skapar JWT-token och payload som används i andra funktioner
            const payload = { username: username };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: `1h` });
            res.status(201).json({ messege: "Login successful", token: token });
        }

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;