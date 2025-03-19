const express = require('express');
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser")
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const db = require("./config/mongoose-connection")


const indexRouter = require("./routes/index-router")
const hisaabRouter = require("./routes/hisaab-router")


app.use(session({
    secret: process.env.JWT_KEY,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});


app.set("view engine" , "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());




app.use("/", indexRouter);
app.use("/hisaab",hisaabRouter)

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
