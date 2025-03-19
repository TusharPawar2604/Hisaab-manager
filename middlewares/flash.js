const flash = require('connect-flash');
const app = require('express')();
const session = require('express-session');
const cookieParser = require('cookie-parser');


app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});