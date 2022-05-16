import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
import { sendStatus } from "express/lib/response";


export const home = async (req, res) => {

    const videos = await Video.find({}).sort({ createdAt: "desc" }).populate("owner");
    return res.render("home", { pageTitle: "Home", videos });

}


export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate("comment")
    if (!video) {
        req.flash("error", "Video does not exist.")
        return res.status(404).render("404");
    }
    return res.render("watch", { pageTitle: `Watch ${video.title}`, video });

};


export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    const { user: { _id } } = req.session
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }

    if (String(video.owner) !== String(_id)) {    //video.owner.toString()
        req.flash("error", "You are not the owner of this video.")
        return res.status(403).redirect("/")
    }
    return res.render("edit", { pageTitle: `Editing`, video });
};
export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.findById(id);
    const { user: { _id } } = req.session
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if (String(video.owner) !== String(_id)) {    //video.owner.toString()
        return res.status(403).redirect("/")
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    })
    return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
    const { user: { _id } } = req.session
    const { title, description, hashtags } = req.body;
    const { video, thumb } = req.files;

    try {
        const newVideo = await Video.create({
            title,
            description,
            thumbUrl: thumb[0].path,
            fileUrl: video[0].path,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id)
        user.save();
        return res.redirect("/");
    } catch (error) {
        return res.status(400).render("upload", { pageTitle: "Upload Video", errorMessage: error._message });
    }
}

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session
    const video = await Video.findById(id);
    const user = await User.findById(_id);

    if (!video) {
        req.flash("info", "Video does not exist.")
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if (String(video.owner) !== String(_id)) {    //video.owner.toString()
        req.flash("error", "You are not the owner of this video.")
        return res.status(403).redirect("/")
    }
    await Video.findByIdAndDelete(id)
    user.videos.splice(user.videos.indexOf(id), 1);
    user.save();
    return res.redirect("/")
}

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i")
            }
        }).populate("owner")
    }

    res.render("search", { pageTitle: "Search", videos });
}

export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
}

export const likeCounting = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        req.flash("error", "Video does not exist.")
        return res.sendStatus(404);
    }
    if (!req.session.user) {
        req.flash("info", "Please login for comment.")
        return res.sendStatus(404)
    }
    const { user: { _id } } = req.session
    const repeated = video.like.users.find(element => element.toString() === _id.toString())
    if (repeated && repeated.toString() === _id) {
        video.like.users.splice(video.like.users.indexOf(_id), 1);
        video.like.likes = video.like.users.length;
        await video.save()
        return res.sendStatus(200);
    }
    if (!repeated) {
        video.like.users.push(_id)
        video.like.likes = video.like.users.length;
        await video.save();
        return res.sendStatus(200);
    }
}
export const commentLike = async (req, res) => {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
        req.flash("error", "Comment does not exist.")
        return res.sendStatus(404);
    }
    if (!req.session.user) {
        req.flash("info", "Please login for comment.")
        return res.sendStatus(404)
    }
    const { user: { _id } } = req.session
    const repeated = comment.like.users.find(element => element.toString() === _id.toString())
    if (repeated && repeated.toString() === _id) {
        comment.like.users.splice(comment.like.users.indexOf(_id), 1);
        comment.like.likes = comment.like.users.length;
        await comment.save()
        return res.sendStatus(200);
    }
    if (!repeated) {
        comment.like.users.push(_id)
        comment.like.likes = comment.like.users.length;
        await comment.save();
        return res.sendStatus(200);
    }
}



export const createComment = async (req, res) => {
    // const { id } = req.params;
    // const { text } = req.body;
    // const { user } = req.session;
    const {
        session: { user },
        body: { text },
        params: { id },
    } = req;
    const video = await Video.findById(id);

    if (!video) {
        req.flash("error", "Video does not exist.")
        return res.sendStatus(404);
    }
    const comment = await Comment.create({
        text,
        avatarUrl: user.avatarUrl,
        owner: user._id,
        video: id,
        username: user.username,
    });
    const commentPopulate = await Comment.findById(comment._id).populate("owner");
    const avatarUrl = commentPopulate.owner.avatarUrl
    video.comment.push(comment._id)
    video.save()

    return res.status(201).json({ newCommentId: comment._id, avatarUrl })
}

export const editComment = async (req, res) => {
    const {
        session: { user },
        body: { text },
        params: { id },
    } = req;
    const checkUser = await Comment.findById(id);
    if (user._id !== checkUser.owner._id.toString()) {
        req.flash("error", "User does not match.")
        return res.sendStatus(404);
    }
    await Comment.findByIdAndUpdate(id, {
        text,
    })
    return res.sendStatus(201)


}

export const deleteComment = async (req, res) => {
    const { id } = req.params
    const comment = await Comment.findById(id)
    const videoId = comment.video
    const video = await Video.findById(videoId)
    const { _id } = req.session.user

    if (String(comment.owner) !== String(_id)) {
        return res.sendStatus(403)
    }

    await Comment.findByIdAndDelete(comment._id);
    video.comment.splice(video.comment.indexOf(comment._id), 1);
    video.save();

    return res.sendStatus(200)

}


