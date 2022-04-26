import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";
import fetch from "node-fetch";


export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" })
export const postJoin = async (req, res) => {
    const { name, email, username, password, password2, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("join", { pageTitle, errorMessage: "Password confirmation does not match" })
    }
    const usernameExists = await User.exists({ username });
    const emailExists = await User.exists({ email })
    if (usernameExists) {
        return res.status(400).render("join", { pageTitle, errorMessage: `This username : ${username} is already taken` })
    }
    if (emailExists) {
        return res.status(400).render("join", { pageTitle, errorMessage: `This email : ${email} is already taken` })
    }

    await User.create({
        name,
        email,
        username,
        password,
        location
    })

    return res.redirect("/login")

}
export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login"
    const user = await User.findOne({ username, socialOnly: false })
    if (!user) {
        return res.status(400).render("login", { pageTitle, errorMessage: "An account with this username does not exists." })
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", { pageTitle, errorMessage: "Password does not match." })
    }
    req.session.loggedIn = true;
    req.session.user = user

    return res.redirect("/");
}
export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize"
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email"
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`
    return res.redirect(finalUrl)
}
export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token"
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com"
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json()
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json()
        const emailObj = emailData.find((email) => email.primary === true && email.verified === true);
        if (!emailObj) {
            return res.redirect("/login")
        }

        let user = await User.findOne({ email: emailObj.email })
        if (!user) {
            user = await User.create({
                name: userData.name ? userData.name : "Unknown",
                avatarUrl: userData.avatar_url,
                email: emailObj.email,
                username: userData.login,
                password: "",
                socialOnly: true,
                location: userData.location,
            })
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/")
    } else {
        return res.redirect("/login")
    }

}


export const logout = async (req, res) => {
    req.session.destroy()
    return res.redirect("/");
}


export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" })
}
export const postEdit = async (req, res) => {
    //const id = req.session.user._id
    //const {name, email, username, location } = req.body
    const {
        session: {
            user: { _id, avatarUrl },
        },
        body: { name, email, username, location },
        file,
    } = req;
    const usernameExists = await User.exists({ username });
    const emailExists = await User.exists({ email })
    if (usernameExists && usernameExists._id.toString() !== _id) {
        return res.status(400).render("edit-profile", { pageTitle: "Edit Profile", errorMessage: `This username : ${username} is already taken` })
    }
    if (emailExists && emailExists._id.toString() !== _id) {
        return res.status(400).render("edit-profile", { pageTitle: "Edit Profile", errorMessage: `This email : ${email} is already taken` })
    }

    const updatedUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email,
        username,
        location,
    }, { new: true });

    req.session.user = updatedUser
    return res.redirect("/users/edit");
}

export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
        return res.redirect("/")
    }
    return res.render("users/change-password", { pageTitle: "Change Password" })
}
export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: { _id, },
        },
        body: { newPassword, newPasswordConfirm, oldPassword }
    } = req;
    const user = await User.findById({ _id, socialOnly: false })
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
        return res.status(400).render("users/change-password", { pageTitle: "Change Password", errorMessage: "Old password does not match." })
    }
    if (newPassword !== newPasswordConfirm) {
        return res.status(400).render("users/change-password", { pageTitle: "Change Password", errorMessage: "New password confirmation does not match" })
    }
    user.password = newPassword
    req.session.user = user
    await user.save()
    return res.redirect("/")
}


export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
            path: "owner",
            model: "User"
        }
    });
    if (!user) {
        return res.status(404).render("404", { pageTitle: "User not found" })
    }
    return res.render("users/profile", { pageTitle: user.name, user })
};