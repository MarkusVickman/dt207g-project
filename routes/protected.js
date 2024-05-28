//Används för skyddade routes funktionen authenticateToken() används för att verifiera token innan tillgång ges.

const express = require("express");
const router = express.Router();

//Hämtar metoder och mongooseschema för meny, arbetare och beställningar
const Menu = require("../models/menu");
const Worker = require("../models/user");
const Order = require("../models/order");

//Routes för menyhantering

//routes för att skapa ett meny-inlägg. Med hjälp av autenticateToken-funktionen authentiseras användaren
router.post("/menu/add", async (req, res) => {
    //läser in data från request
    let newMenu = {
        username: req.username.username,
        menyType: req.body.menyType,
        foodName: req.body.foodName,
        description: req.body.description,
        price: req.body.price
    };

    let error = {};

    //Felhantering om uppgifter saknas
    if (!newMenu.username || !newMenu.menyType || !newMenu.foodName || !newMenu.description || !newMenu.price) {
        error = {
            message: "Parameters missing in the request.",
            detail: "Post request most include Name, menutype, foodname, description and price",
            https_response: {
                message: "Bad Request",
                code: 400
            }
        }
        res.status(400).json(error);
    }
    //Om allt är korrekt körs frågan till mongoDg-databasen för att lagra den nya menyraden
    else {
        try {
            await Menu.create(newMenu);
            return res.json({ Success: "Post data stored in database." });
        } catch (error) {
            return res.status(500).json({ error: "Database error. " + error });
        }
    }
});

//Ändrar rader i menyn på mongoDb-databasen. Skickar felmeddelande om fel uppstår hos databasen.
router.put('/menu/edit', async (req, res) => {
    //läser in data från request
    let indexId = req.body.indexId;

    //läser in data från request
    let editMenu = {
        menyType: req.body.menyType,
        username: req.username.username,
        foodName: req.body.foodName,
        description: req.body.description,
        price: req.body.price,
        created: req.body.date
    };
    //Felmeddelande om uppgifter saknas
    let error = {
        message: "Parameters missing in the request.",
        detail: "Put request most include indexId and atleast one of the following parameters foodname, description or price",
        https_response: {
            message: "Bad Request",
            code: 400
        }
    }

    //Felhantering om _id saknas.
    if (!indexId) {
        res.status(400).json(error);
    }
    //Det räckar att ett värde uppdateras
    else if (!editMenu.foodName && !editMenu.description && !editMenu.price) {
        res.status(400).json(error);
    }
    //värdet skrivs in på rätt index i rätt kolomn i databasen.
    else {
        try {
            await Menu.findByIdAndUpdate(indexId, editMenu);
            return res.status(200).json({ Success: "Put data updated in database." });
        } catch (error) {
            return res.status(500).json({ error: "Database error. " + error });
        }
    }
});

//routes för borttagning av rader från menyn där id skickas med som parameter
router.delete("/menu/delete/:id", async (req, res) => {
    //läser in data från parameter
    let indexId = req.params.id;

    //Felhantering om uppgifter saknas.
    if (!indexId) {
        res.status(400).json(error);
    }
    //värdet skrivs in på rätt index i rätt kolomn i databasen.
    else {
        try {
            await Menu.findByIdAndDelete(indexId);
            return res.json({ Success: "Delete data removed from database." });
        } catch (error) {
            return res.status(500).json({ error: "Database error. " + error });
        }
    }
});



// Följande routes är för ordrar till restaurangen

//routes för att visa alla ordrar
router.get("/order", async (req, res) => {
    try {
        let result = await Order.find();
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ error: "Database error. " + error });
    }
});

//routes för admin ska kunna markera ordrar som klara och upphämtade
router.put("/order/completed", async (req, res) => {
    //läser in data från request
    let orderId = req.body.indexId;
    //värdet skrivs in på rätt index i rätt kolomn i databasen.
    if (orderId) {
        try {
            await Order.findByIdAndUpdate(orderId, { completed: true });
            return res.status(200).json({ Success: "Put data updated in database." });
        } catch (error) {
            return res.status(500).json({ error: "Database error. " + error });
        }
    }
});


//routes för att ta bort en order
router.delete("/order/delete/:id", async (req, res) => {
    //läser in data från request
    let indexId = req.params.id;

    //Felhantering om uppgifter saknas.
    if (!indexId) {
        res.status(400).json(error);
    }
    //värdet skrivs in på rätt index i rätt kolomn i databasen.
    else {
        try {
            await Order.findByIdAndDelete(indexId);
            return res.json({ Success: "Delete data removed from database." });
        } catch (error) {
            return res.status(500).json({ error: "Database error. " + error });
        }
    }
});






//Neden är routes för användarhantering

//routes för att hämta all användarinformation ifall användaren är admin
router.get("/user", async (req, res) => {
    let userName = req.username.username;

    //Om kontot är admin returneras användarinformation
    if (userName === "admin") {
        try {
            let result = await Worker.find();
            return res.json(result);
        } catch (error) {
            return res.status(500).json({ error: "Could not reach database. " + error });
        }
    }

    //Om svaret inte är admin returneras det result: "notadmin"
    else {
        try {
            let result = {result: "notadmin"};
            return res.json(result);

        } catch (error) {
            return res.status(500).json({ error: "Could not reach database. " + error });
        }
    }
});

//routes för admin ska kunna verifiera användare för tillgång till restaurangens admin-gränsnitt med hjälp av användarnamnet som följer med JWT-token som payload och sen authentiseras i authtenticateToken-funktionen
router.put("/user/verify", async (req, res) => {
    //läser in data från request
    let adminUsername = req.username.username;
    let workerId = req.body.indexId;
    //Felhantering om uppgifter saknas.
    if (!adminUsername) {
        res.status(400).json(error);
    }
    //värdet skrivs in på rätt index i rätt kolomn i databasen. vald användare identifieras med id och verified: false ändras till verified: true.
    //Endast admin kommer åt funktionen
    else if (adminUsername === "admin") {
        try {
            await Worker.findByIdAndUpdate(workerId, { verified: true });
            return res.status(200).json({ Success: "Put data updated in database." });
        } catch (error) {
            return res.status(500).json({ error: "Database error. " + error });
        }
    }
});

//routes för att ta bort användare. Går bara att göra för admin-kontot med hjälp av användarnamnet som följer med JWT-token som payload och sen authentiseras i authtenticateToken-funktionen
router.delete("/user/delete/:id", async (req, res) => {
    //tar bort data från mongoDb-servern när förfrågan till webbadress/api/cv görs. Skickar felmeddelande om fel uppstår hos databasen.
    let indexId = req.params.id;

    //Felhantering om uppgifter saknas.
    if (!indexId) {
        res.status(400).json(error);
    }
    //Vald användare identifieras med id och tas bort.
    //Endast admin kommer åt funktionen
    else {
        try {
            await Worker.findByIdAndDelete(indexId);
            return res.json({ Success: "Delete data removed from database." });
        } catch (error) {
            return res.status(500).json({ error: "Database error. " + error });
        }
    }
});


module.exports = router;