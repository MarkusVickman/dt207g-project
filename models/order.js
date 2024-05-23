const mongoose = require("mongoose");

// mongoose-schema för ordrar till restaurangen,
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

// Skapa en model
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;