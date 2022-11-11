const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {userSchemaValidation,userSchemaValidationLogin} = require('./validation/userValidation');
const mongoosePaginate = require('mongoose-paginate');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
    maxlength: 256,
  },
  img: {
    type: String,
    trim: true,
    default:null
  },
  phoneNumber:{
    type: String,
    trim: true,
    default:null
  },

  permisson: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

},{timestamps:true});


userSchema.plugin(mongoosePaginate)

userSchema.pre("save", async function (next) {
  let user = this;
  if (!user.isModified("password")) {
    return next();
  } else {
    user.password = await bcrypt.hash(user.password, 10);
    return next();
  }
});


userSchema.statics.userValidation = function(body){
    return userSchemaValidation.validate(body,{abortEarly:false})
}
userSchema.statics.userValidationLogin = function(body){
  return userSchemaValidationLogin.validate(body,{abortEarly:false})
}
const User = mongoose.model("User", userSchema);

module.exports = User;
