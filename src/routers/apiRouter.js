import express from "express";
import { editComment, deleteComment, createComment, registerView, likeCounting, commentLike } from "../Controller/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/like", likeCounting)
apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView)
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment)
apiRouter.post("/comment/:id([0-9a-f]{24})/edit", editComment)
apiRouter.post("/comment/:id([0-9a-f]{24})/like", commentLike)
apiRouter.delete("/videos/:id([0-9a-f]{24})/comment/delete", deleteComment)


export default apiRouter