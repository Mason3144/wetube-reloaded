import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    avatarUrl: { type: String },
    username: { type: String, required: true },
    video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
    like: {
        likes: { type: Number, default: 0, required: true },
        users: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }]
    },
})

const Comment = mongoose.model("Comment", commentSchema)

export default Comment;