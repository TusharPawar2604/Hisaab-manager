const mongoose = require("mongoose");

const hisaabSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        minlength: 3,
        maxlength: 255,
        trim: true,
    },
    description: { 
        type: String, 
        maxlength: 1024,
        required: true, 
        trim: true,
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
    },
    encrypted: { 
        type: Boolean, 
        default: false,
    },
    shareable: { 
        type: Boolean, 
        default: false,
    },
    passcode: { 
        type: String,
        default: "",
    },
    editpermissions: { 
        type: Boolean, 
        default: false,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Hisaab", hisaabSchema);
