
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//mongoose-schema för användare. Skapande datum skapas automatiskt för att veta när kontot är skapat och även verified används för att admin ska kunna bekräfta tillgång
const WorkerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false
    }
});

//Innan en user lagras i databasen hashas lösenordet för att det inte ska gå att läsa av i klartext.
WorkerSchema.pre("save", async function (next) {
    try {
        if (this.isNew || this.isModified("password")) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
});

//Vid inloggning hashas det inskrivna lösenordet och testas mot det hashade lösenorden som finns i databasen.
WorkerSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

//Modellen Worker exporteras
const Worker = mongoose.model("Worker", WorkerSchema);
module.exports = Worker;

