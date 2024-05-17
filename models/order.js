const mongoose = require("mongoose");

// mongoose-schema för ordrar till restaurangen,
const orderSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    foodName: {
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
    },
    completed: {
        type: Boolean,
        default: false
    }
});

// Skapa en model
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;