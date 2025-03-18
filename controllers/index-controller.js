const userModel = require("../models/user-model");
const hisaabModel = require("../models/hisab-model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


module.exports.landingPageController = function (req, res){
   res.render("index", {loggedin: false})
}

module.exports.registerPageController = function (req, res){
    res.render("register")
 }

 
module.exports.registerController = async function (req, res){
   let {name , username , password , email} = req.body;
   
try {
   
   let user = await userModel.findOne({email});
   if(user) return res.render("You already have an account , Please login ");
   // res.send("You can create a new account")

   let salt = await bcrypt.genSalt(10);
   let hashed = await bcrypt.hash(password , salt)
  

   user = await userModel.create({
      username,
      name,
      email,
      password:hashed
   });

   let token = jwt.sign({id: user._id , email:user.email}, process.env.JWT_KEY);

   res.cookie("token", token);
   res.redirect("/")

} catch (error) {
   res.send(error.message)
}

}


module.exports.loginController = async function (req, res){
   let {email ,password} = req.body;
  try {
   let user = await userModel.findOne({email}).select("+password");
   
   
   if(!user) return res.redirect("/?error=true");
   let result = await bcrypt.compare(password , user.password)
  
if (result){
   let token = jwt.sign({id: user._id , email:user.email}, process.env.JWT_KEY);

   res.cookie("token", token);
   res.redirect("/profile")
}
else {
   return res.redirect("/")
}

  } catch (error) {
   return res.send(error.message)
  }
}

module.exports.logoutController = async function (req, res){
   res.cookie("token", "");
   return res.redirect("/")
}

module.exports.profileController = async function (req, res){

  let byDate = Number(req.query.byDate);
  let {startDate , endDate} = req.query;

  byDate = byDate ? byDate : -1;
  startDate = startDate ? startDate : new Date("1978-01-01");
  endDate = endDate ? endDate : new Date();



 let user = await  userModel.findOne({email : req.user.email}).populate({
   path:"hisaab",
   match: { createdAt : { $gte : startDate , $lte: endDate}},
   options: {sort :{createdAt: byDate}},
 });
  res.render('profile',{user})
}

