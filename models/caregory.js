const mongoose = require('mongoose');
const {categorySchemaValidation} = require('./validation/categoryValidation');
const mongoosePaginate = require('mongoose-paginate');
const Shema =  mongoose.Schema;

const categorySchema = Shema({
    title:{type:String,required:true,trim:true},
    slug:{type:String,required:true,trim:true},
},{timestamps:true});

categorySchema.plugin(mongoosePaginate)

categorySchema.statics.categoryValidation = function(body){
    return categorySchemaValidation.validate(body,{abortEarly:false})
}

const Category = mongoose.model("Category",categorySchema);

module.exports = Category;