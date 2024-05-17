const express = require("express");
const router = express.Router();






//Hämtar metoder och mongooseschema för inloggning, registrering och cv
const Menu = require("../models/menu");
const Order = require("../models/order");






//routes för att hämta hela menyntill restauranen.
router.get("/menu", async (req, res) => {
    try {
        let result = await Menu.find();
        return res.json(result);

    } catch (error) {
        return res.status(500).json({ error: "Could not reach database. " + error });
    }
});




// Följande routes är för ordrar till restaurangen

//routes för att lägga en order. Uppgifterna hämtas från databas servern för minskad risk för pris manupulation
router.post("/order/add", /*authtenticateToken,*/ async (req, res) => {
    
    let indexId = req.body.indexId;
    await Menu.findById(indexId);
    
    //lägger till data till mongoDb servern med krav att schema workSchema ska följas från post-anropet om webbadress/api/add anropas. Skickar felmeddelande om fel uppstår hos databasen.  
    let newOrder = {
        email: req.body.email,
        foodName: indexId.foodName,
        price: indexId.price
    };

    let error = {};

    //Felhantering om uppgifter saknas
    if (!newOrder.email || !newOrder.foodName || !newOrder.price ) {
        error = {
            message: "Parameters missing in the request.",
            detail: "Post request most include email and indexId",
            https_response: {
                message: "Bad Request",
                code: 400
            }
        }
        res.status(400).json(error);
    }
    //Om allt är korrekt körs frågan till mongoDg-databasen för att lagra det nya cv
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