//Används där inte authentisering krävs. Som att hämta menyn och beställa mat

const express = require("express");
const router = express.Router();

//Hämtar metoder och mongooseschema för meny och beställningar
const Menu = require("../models/menu");
const Order = require("../models/order");

//routes för att hämta hela menyn till restauranen.
router.get("/menu", async (req, res) => {
    try {
        let result = await Menu.find();
        return res.json(result);

    } catch (error) {
        return res.status(500).json({ error: "Could not reach database. " + error });
    }
});


// Följande routes är för ordrar till restaurangen. routes för att lägga en order.
router.post("/checkout", /*authtenticateToken,*/ async (req, res) => {

    //lägger till data till mongoDb servern med objekt for ordern. Foods är en array av objekt.  
    let newOrder = {
        userName: req.body.userName,
        email: req.body.email,
        foods: req.body.foods
    };

    let error = {};

    //Felhantering om uppgifter saknas
    if (!newOrder.email || !newOrder.foods || !newOrder.userName ) {
        error = {
            message: "Parameters missing in the request.",
            detail: "Post request most include email and userName",
            https_response: {
                message: "Bad Request",
                code: 400
            }
        }
        res.status(400).json(error);
    }
    //Om allt är korrekt körs frågan till mongoDg-databasen för att lagra ordern
    else {
        try {
            await Order.create(newOrder);
            return res.json({ Success: "Post data stored in database." });
        } catch (error) {
            return res.status(500).json({ error: "Database error. " + error });
        }
    }
});


module.exports = router;