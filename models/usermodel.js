const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
let userScheme=new mongoose.Schema({
    name : String,
    email : String,
    password : {
      type : String,
      select : false
//as we dont have to show this password to anyone who wants to console.log()-> this password so we type select:false

    },
    resetPasswordToken : String,
    resetPasswordExpires : Date
});
//as we have to connect schema to our passportLocalMongoose we use plugin
userScheme.plugin(passportLocalMongoose,{usernameField:'email'});
module.exports=mongoose.model('User',userScheme);
//model wil be Employee and this file will be included in routes file which is employee.js file in routes folder - written so that there is no confusion