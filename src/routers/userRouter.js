import express from "express";

import {
    finishGithubLogin,
    startGithubLogin,
    getEdit,
    postEdit,
    see,
    logout,
    getChangePassword,
    postChangePassword
} from "../Controller/userController";
import { avatarUpload, protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();


userRouter.route("/edit")
    .all(protectorMiddleware)
    .get(getEdit)
    .post(avatarUpload.single("avatar"), postEdit);
userRouter.get("/logout", protectorMiddleware, logout);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin)
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin)
userRouter.route("/change-password")
    .all(protectorMiddleware)
    .get(getChangePassword)
    .post(postChangePassword)
userRouter.get("/:id", see);


export default userRouter;