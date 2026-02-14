const { isLoggedIn } = require("../middlewares/auth-middlewares");
const hisaabModel = require("../models/hisab-model");
const userModel = require("../models/user-model");
const flash = require('connect-flash'); 
const session = require('express-session');
 

module.exports.createhisaabController = async function (req, res) {
  let { title, description, encrypted, shareable, passcode, editpermission } = req.body;
  encrypted = encrypted === "on" ? true : false;
  shareable = shareable === "on" ? true : false;
  editpermission = editpermission === "on" ? true : false;

  try {
    let hisaabcreated = await hisaabModel.create({
      title,
      description,
      user: req.user._id,
      passcode,
      encrypted,
      shareable,
      editpermission
    });

    let user = await userModel.findOne({ email: req.user.email });
    user.hisaab.push(hisaabcreated._id);
    await user.save();
    req.flash('success_msg', 'Hisaab created successfully');
    res.redirect("/profile");
  }
  catch (err) {
    console.log(err.message);
  }

};


module.exports.hisaabPageController = async function (req, res) {
  res.render("create");

}

module.exports.readHisaabController = async function (req, res) {

  const id = req.params.id;

  const hisaab = await hisaabModel.findOne({
    _id: id
  })

  if (!hisaab) {
    return res.redirect('/profile');
  }

  if (hisaab.encrypted) {
    return res.render('passcode', { id })
  }

  res.render("hisaab", { hisaab })
}

module.exports.verifyHisaabController = async function (req, res) {
  const id = req.params.id;

  const hisaab = await hisaabModel.findOne({ _id: id })


  if (!hisaab) {


    return res.redirect("/profile")
  }

  if (hisaab.passcode !== req.body.passcode) {

    return res.redirect("/profile")
  }


  return res.render("hisaab", { hisaab })
}


module.exports.deleteController = async function (req, res) {
  const id = req.params.id;

  try {
    console.log(`[DELETE] Attempting to delete hisaab ${id} for user ${req.user._id}`);
    
    // Diagnostic Step: Find by ID only first
    const hisaab = await hisaabModel.findOne({
      _id: id
    });

    if (!hisaab) {
      console.log(`[DELETE] Hisaab ${id} does not exist in database`);
      req.flash('error_msg', 'Hisaab not found');
      return res.redirect("/profile");
    }

    console.log(`[DELETE] Found Hisaab ${id}. Owner is: ${hisaab.user}, Requesting User is: ${req.user._id}`);
    
    // Check if ownership matches (use toString() for safe comparison of ObjectIds)
    if (hisaab.user.toString() !== req.user._id.toString()) {
        console.log(`[DELETE] Ownership mismatch! rejecting delete request.`);
        req.flash('error_msg', 'You are not authorized to delete this Hisaab');
        return res.redirect("/profile");
    }

    await hisaabModel.deleteOne({
      _id: id
    });
    
    console.log(`[DELETE] Hisaab ${id} deleted`);

    // Remove hisaab from user's array to keep data clean
    await userModel.updateOne(
        { _id: req.user._id },
        { $pull: { hisaab: id } }
    );

    req.flash('success_msg', 'Hisaab deleted successfully');
    return res.redirect("/profile");
  } catch (err) {
      console.error("[DELETE] Error deleting hisaab:", err);
      req.flash('error_msg', 'Error deleting Hisaab');
      return res.redirect("/profile");
  }
}

module.exports.editController = async function (req, res) {
  const id = req.params.id;

  const hisaab = await hisaabModel.findById(id);
  if (!hisaab) {
    return res.redirect('/profile');
  }
 await res.render('edit', { hisaab })

}

module.exports.editPostController = async function (req, res) {
  const id = req.params.id;

  const hisaab = await hisaabModel.findById(id);

  if (!hisaab) {
    return res.redirect("/profile")
  }
  hisaab.title = req.body.title;
  hisaab.description = req.body.description;
  hisaab.editpermissions = req.body.editpermissions == 'on' ? true : false;
  hisaab.encrypted = req.body.encrypted == 'on' ? true : false;
  hisaab.shareable = req.body.shareable == 'on' ? true : false;
  hisaab.passcode = req.body.passcode;


  await hisaab.save();
  console.log(hisaab.editpermissions);

  res.redirect("/profile")
}