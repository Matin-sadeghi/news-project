const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema

const commentSchema = Schema({
    user:{type:Schema.Types.ObjectId,ref:"User",required:true,trim:true},
    body:{type:String,required:true,trim:true},
    article:{type:Schema.Types.ObjectId,ref:"Article",required:true},
    parent: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    approved: { type: Boolean, default: false },
},{timestamps: true})
commentSchema.plugin(mongoosePaginate)

const Comment = mongoose.model("Comment",commentSchema);

module.exports = Comment;
