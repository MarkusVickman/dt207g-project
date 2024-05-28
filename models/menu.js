const mongoose = require("mongoose");

// mongoose-schema för menyinlägg/menyobjekt. För att kunna veta när menyn ändrats finns created med också
const MenuSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    menyType: {
        type: String,
        required: true
    },
    foodName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// Skapa en mongoose model för Menu och exportera modulen
const Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;