const { isLoggedIn } = require("../middlewares/auth-middlewares");
const hisaabModel = require("../models/hisab-model");
const userModel = require("../models/user-model");

module.exports.createhisaabController = async function(req,res){
  let {title,description,encrypted,shareable,passcode,editpermission} = req.body;

   encrypted = encrypted === "on" ? true : false;
   shareable = shareable === "on" ? true : false;
   editpermission = editpermission === "on" ? true : false;
   
 try{
  let hisaabcreated = await  hisaabModel.create({
    title,
    description,
    user:req.user_id,
    passcode,
    encrypted,
    shareable,
    editpermission
});

let user =  await userModel.findOne({email: req.user.email});
user.hisaab.push(hisaabcreated._id);
await user.save();
res.redirect("/profile");
 }
 catch (err){
   console.log(err.message);
 }
    
};


module.exports.hisaabPageController = async function(req,res){
  res.render("create");
  
}

module.exports.readHisaabController = async function(req,res){

  const id = req.params.id;
   
 const hisaab  = await hisaabModel.findOne({
  _id:id
 })

 if(!hisaab){
  return res.redirect('/profile');
 }

 if(hisaab.encrypted){
  return res.render('passcode',{id})
 }

  res.render("hisaab", {hisaab})
}

module.exports.verifyHisaabController = async function(req,res){
  const id = req.params.id;

  const hisaab = await hisaabModel.findOne({_id:id})
  

  if(!hisaab){

    
    return res.redirect("/profile")
  }
   
  if(hisaab.passcode !== req.body.passcode){
    
    return res.redirect("/profile")
  }


  return res.render("hisaab",{hisaab})
}


module.exports.deleteController = async function(req,res){

   const id = req.params.id;
   
   const hisaab = await hisaabModel.findOne({
    _id :id,
     user: req.user_id
   });

   

   if(!hisaab){
    return res.redirect("/profile");
   }
    
   await hisaabModel.deleteOne({
    _id:id
   });

   return res.redirect("/profile");

}

module.exports.editController = async function(req,res){
  const id = req.params.id;

  const hisaab = await hisaabModel.findById(id);
  
  
  if(!hisaab){
    return res.redirect('/profile');
  }

  await res.render('edit',{ hisaab})

}

module.exports.editPostController = async function(req,res){
  const id = req.params.id;

  const hisaab = await hisaabModel.findById(id);

  if(!hisaab){
    return res.redirect("/profile")
  }

  

  hisaab.title = req.body.title;
  hisaab.description = req.body.description;
  hisaab.editpermissions = req.body.editpermissions == 'on' ? true : false;
  hisaab.encrypted   = req.body.encrypted == 'on' ? true : false;
  hisaab.shareable= req.body.shareable == 'on' ? true : false;
  hisaab.passcode = req.body.passcode;

 
  await hisaab.save();
  console.log(hisaab.editpermissions);
  
  res.redirect("/profile")
}