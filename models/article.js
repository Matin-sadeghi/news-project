const mongoose = require("mongoose");
const { articleSchemaValidation } = require("./validation/articleValidation");
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const articleSchema = Schema(
  {
    title: { type: String, required: true, trime: true },
    summery: { type: String, required: true, trime: true },
    body: { type: String, required: true, trime: true },
    thumbnail: { type: String, required: true, trime: true },
    status: { type: String, enum: ["visible", "invisible"], default: "invisible" },
    images: [{ type: String, default: null }],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    
    
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true,toJSON:{virtuals:true} }
);

articleSchema.plugin(mongoosePaginate)

articleSchema.statics.articleValidation = function (body) {
  return articleSchemaValidation.validate(body, { abortEarly: false });
};


articleSchema.methods.statusForTable = function(){
  const article = this;
  if(article.status =="invisible" ){
    return "نمایش داده نشده"
  }else if(article.status =="visible"){
    return "نمایش داده شده"
  }
}

articleSchema.virtual("comments",{
  ref:"Comment",
  localField: "_id",
  foreignField: "article",
})

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
