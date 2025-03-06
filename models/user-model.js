const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    profilePicture: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    hisaab: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hisaab"
    }]
});

module.exports = mongoose.model("User", userSchema);
