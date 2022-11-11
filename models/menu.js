const mongoose = require("mongoose");
const { menuSchemaValidation } = require("./validation/menuValidation");
const mongoosePaginate = require("mongoose-paginate");

const Schema = mongoose.Schema;

const menuSchema = Schema(
  {
    title: { type: String, required: true, trim: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Menu",default:null },
    url: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

menuSchema.plugin(mongoosePaginate);

menuSchema.statics.menuValidation = function (body) {
  return menuSchemaValidation.validate(body, { abortEarly: false });
};

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
