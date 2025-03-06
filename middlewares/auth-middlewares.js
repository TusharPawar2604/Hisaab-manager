const jwt  = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports.isLoggedIn = async function(req,res,next){
    // console.log("Cheaking if logged in ");
    if(req.cookies.token){
        try{
         let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
         let user = await userModel.findOne({email: decoded.email}) ;
         req.user = user;
        //  console.log("User verified", decoded);
         next();
        } catch(err){
    // console.log("Token verification failed, ",err);
            return res.redirect("/");  
        }
    }
   else{
    // console.log("No token found in cookies");
    return res.redirect("/");
   }
}   


module.exports.redirectIfLoggedIn = function(req ,res,next){
    if(req.cookies.token){
        try{
            let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
            req.user = decoded;
          return res.redirect("/profile")
        }
        catch (err){
            return next();
        }
    }
    else return next();
}




