const mongoose = require("mongoose");

/* mongoose-schema för ordrar till restaurangen, foods är av typen array för att kunna lagra flera object med mat. Created är med för att restaurangen ska se när ordern är lagd och completed för att restaurangen ska kunna klarmarkera ordrar*/
const orderSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    foods: {
        type: Array,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    completed: {
        type: Boolean,
        default: false
    }
});

// Skapa modellen Order och exporterar den
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;