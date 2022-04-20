import express from "express";

import { finishGithubLogin, startGithubLogin, getEdit, postEdit, see, logout } from "../Controller/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();


userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/logout", protectorMiddleware, logout);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin)
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin)
userRouter.get("/:id", see);


export default userRouter;