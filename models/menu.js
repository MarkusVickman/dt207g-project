const mongoose = require("mongoose");

// mongoose-schema för cv-inlägg
const MenuSchema = new mongoose.Schema({
    starter: [{
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
    }],
    main: [{
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
    }],
    dessert: [{
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
    }]
});

// Skapa en model
const Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;