const videoContainer = document.getElementById("videoContainer")
const form = document.getElementById("commentForm");



const addComment = (text, id, avatarUrl) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li")

    newComment.dataset.id = id
    newComment.className = "video__comment"
    const div = document.createElement("div")
    div.className = "firstDiv"
    const div2 = document.createElement("div")
    div2.className = "avatar__div"
    newComment.appendChild(div)
    div.appendChild(div2)
    if (!avatarUrl) {
        const emptyAvatar = document.createElement("div")
        emptyAvatar.className = "comment_avatar empty__avatar"
        div2.appendChild(emptyAvatar)
    }
    if (avatarUrl) {
        const img = document.createElement("img")
        img.crossOrigin = "crossorigin"
        img.className = "comment_avatar"
        if (avatarUrl.startsWith("uploads")) {
            img.src = `/${avatarUrl}`
        }
        if (!avatarUrl.startsWith("uploads")) {
            img.src = `${avatarUrl}`
        }
        div2.appendChild(img)
    }
    const div3 = document.createElement("div")
    div3.className = "textAndBtn"
    const div4 = document.createElement("div")
    div4.className = "parentNode"
    const span = document.createElement("span")
    span.innerText = videoComments.dataset.username
    span.className = "usernameSpan"
    const span2 = document.createElement("span")
    span2.className = "date_counting"
    span2.innerText = "0 분전"
    const span3 = document.createElement("span")
    span3.className = "contentSpan"
    span3.innerText = ` ${text}`
    const div5 = document.createElement("div")
    div5.className = "btns"
    const form = document.createElement("form")
    form.method = "POST"
    form.action = `/api/comment/${id}/like`
    const button = document.createElement("button")
    button.id = "commentLikeBtn"
    button.className = "fa-solid fa-thumbs-up"
    const span4 = document.createElement("span")
    span4.innerText = "0"
    span4.id = "commentLikeSpan"
    const div6 = document.createElement("div")
    div6.className = "editingBtns"
    const span5 = document.createElement("span")
    span5.className = "fa-solid fa-pencil editCommentBtn"
    const span6 = document.createElement("span")
    span6.className = "fas fa-x deleteCommentBtn"

    div.appendChild(div3)
    div3.appendChild(div4)
    div3.appendChild(span3)
    div3.appendChild(div5)
    div4.appendChild(span)
    div4.appendChild(span2)
    div5.appendChild(form)
    form.appendChild(button)
    form.appendChild(span4)
    div5.appendChild(div6)
    div6.appendChild(span5)
    div6.appendChild(span6)
    videoComments.prepend(newComment);



    const editComment = (e) => {
        const textAndBtn = e.path[3]
        const contentSpan = textAndBtn.querySelector(".contentSpan")
        const editBtn = document.createElement("button")
        const editCancel = document.createElement("button")
        const textarea = document.createElement("textarea")
        const editingDiv = textAndBtn.querySelector(".editingBtns")
        const editCommentBtn = textAndBtn.querySelector(".editCommentBtn")
        const deleteCommentBtn = textAndBtn.querySelector(".deleteCommentBtn")

        editCancel.className = "editCancel"
        editBtn.className = "editBtn"
        textarea.id = "textarea"
        textarea.innerText = contentSpan.innerText
        textAndBtn.replaceChild(textarea, contentSpan);
        editBtn.innerText = "Submit"
        editCancel.innerText = "Cancel"
        editingDiv.replaceChild(editBtn, editCommentBtn)
        editingDiv.replaceChild(editCancel, deleteCommentBtn)

        const handleEditCancel = () => {
            const editBtn = textAndBtn.querySelector(".editBtn")
            const editCancel = textAndBtn.querySelector(".editCancel")
            const textarea = textAndBtn.querySelector("#textarea")
            const contentSpan = document.createElement("span")
            contentSpan.className = "contentSpan"
            textAndBtn.replaceChild(contentSpan, textarea);
            contentSpan.innerText = textarea.innerText
            editingDiv.replaceChild(editCommentBtn, editBtn)
            editingDiv.replaceChild(deleteCommentBtn, editCancel)
        }

        const editCommentServer = async (e) => {
            const { id } = e.path[5].dataset
            const textarea = textAndBtn.querySelector("#textarea")
            const text = textarea.value
            if (text === "") {
                return
            }
            const response = await fetch(`/api/comment/${id}/edit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text }),

            })
            if (response.status === 201) {
                const editBtn = textAndBtn.querySelector(".editBtn")
                const editCancel = textAndBtn.querySelector(".editCancel")
                const textarea = textAndBtn.querySelector("#textarea")
                const contentSpan = document.createElement("contentSpan")
                contentSpan.className = "contentSpan"
                textAndBtn.replaceChild(contentSpan, textarea);
                contentSpan.innerText = text
                editingDiv.replaceChild(editCommentBtn, editBtn)
                editingDiv.replaceChild(deleteCommentBtn, editCancel)
            }
        }

        editCancel.addEventListener("click", handleEditCancel)
        editBtn.addEventListener("click", editCommentServer)
    }




    const deleteComment = async () => {
        const res = await fetch(`/api/videos/${id}/comment/delete`, {
            method: "DELETE"
        })
        if (res.status === 200) {
            newComment.remove()
        }
    }

    const handleCommentLike = async (event) => {
        event.preventDefault()
        const { id } = newComment.dataset
        const response = await fetch(`/api/comment/${id}/like`, {
            method: "POST"
        })
        if (response.status === 200) {
            switchCommentLike(event)
        }
    }
    const switchCommentLike = (event) => {
        const list = event.target.classList
        if (list.length === 3) {
            list.remove("liked")
            span4.innerText = Number(span4.innerText) - 1;
        } else {
            list.add("liked")
            span4.innerText = Number(span4.innerText) + 1;
        }
    }

    span5.addEventListener("click", editComment)
    span6.addEventListener("click", deleteComment)
    button.addEventListener("click", handleCommentLike)
}

const handleSubmit = async (event) => {
    event.preventDefault()
    const formBtn = event.target[1]
    const videoId = videoContainer.dataset.id;
    const text = textarea.value;

    if (text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text }),
    })
    if (response.status === 201) {
        textarea.value = "";
        const { newCommentId, avatarUrl } = await response.json();
        formBtn.style.color = "#909CB7"
        formBtn.style.background = "#ECECEC"
        formBtn.style.cursor = ""
        addComment(text, newCommentId, avatarUrl);
    }
}

const btnChange = (e) => {
    const formBtn = e.target.form[1]
    if (e.target.value === "") {
        formBtn.style.color = "#909CB7"
        formBtn.style.background = "#ECECEC"
        formBtn.style.cursor = ""
        return
    }
    formBtn.style.backgroundColor = "red"
    formBtn.style.color = "white"
    formBtn.style.cursor = "pointer"
    return
}

if (form) {
    const textarea = form.querySelector("textarea")
    form.addEventListener("submit", handleSubmit)
    textarea.addEventListener("input", btnChange)
}

const video__comment = document.querySelectorAll(".video__comment")

const modifyComment = (e) => {
    const deleteCommentBtn = e.querySelector(".deleteCommentBtn")
    const editCommentBtn = e.querySelector(".editCommentBtn")
    const textAndBtn = e.querySelector(".textAndBtn")
    const commentLikeBtn = e.querySelector("#commentLikeBtn")
    const commentLikeSpan = e.querySelector("#commentLikeSpan")
    const editingDiv = e.querySelector(".editingBtns")

    const handleCommentLike = async (event) => {
        event.preventDefault()
        const { id } = e.dataset
        const response = await fetch(`/api/comment/${id}/like`, {
            method: "POST"
        })
        if (response.status === 200) {
            switchCommentLike(event)
        }
    }
    const switchCommentLike = (event) => {
        const list = event.target.classList
        if (list.length === 3) {
            list.remove("liked")
            commentLikeSpan.innerText = Number(commentLikeSpan.innerText) - 1;
        } else {
            list.add("liked")
            commentLikeSpan.innerText = Number(commentLikeSpan.innerText) + 1;
        }
    }

    commentLikeBtn.addEventListener("click", handleCommentLike)

    if (deleteCommentBtn && editCommentBtn) {
        const { id } = e.dataset


        const deleteComment = async () => {
            const res = await fetch(`/api/videos/${id}/comment/delete`, {
                method: "DELETE"
            })
            if (res.status === 200) {
                e.remove()
            }


        }
        const handleEditCancel = () => {
            const editBtn = e.querySelector(".editBtn")
            const editCancel = e.querySelector(".editCancel")
            const textarea = e.querySelector("#textarea")
            const contentSpan = document.createElement("span")
            contentSpan.className = "contentSpan"
            textAndBtn.replaceChild(contentSpan, textarea);
            contentSpan.innerText = textarea.innerText
            editingDiv.replaceChild(editCommentBtn, editBtn)
            editingDiv.replaceChild(deleteCommentBtn, editCancel)
        }
        const editComment = () => {
            const contentSpan = e.querySelector(".contentSpan")
            const editBtn = document.createElement("button")
            const editCancel = document.createElement("button")
            const textarea = document.createElement("textarea")

            editCancel.className = "editCancel"
            editBtn.className = "editBtn"
            textarea.id = "textarea"
            textarea.innerText = contentSpan.innerText
            textAndBtn.replaceChild(textarea, contentSpan);
            editBtn.innerText = "Submit"
            editCancel.innerText = "Cancel"
            editingDiv.replaceChild(editBtn, editCommentBtn)
            editingDiv.replaceChild(editCancel, deleteCommentBtn)

            editCancel.addEventListener("click", handleEditCancel)
            editBtn.addEventListener("click", editCommentServer)

        }

        deleteCommentBtn.addEventListener("click", deleteComment)
        editCommentBtn.addEventListener("click", editComment)

        const updateComment = (text) => {
            const editBtn = e.querySelector(".editBtn")
            const editCancel = e.querySelector(".editCancel")
            const textarea = e.querySelector("#textarea")
            const contentSpan = document.createElement("contentSpan")
            contentSpan.className = "contentSpan"
            textAndBtn.replaceChild(contentSpan, textarea);
            contentSpan.innerText = text
            editingDiv.replaceChild(editCommentBtn, editBtn)
            editingDiv.replaceChild(deleteCommentBtn, editCancel)
        }

        const editCommentServer = async (event) => {
            const textarea = textAndBtn.querySelector("textarea")
            const commentId = e.dataset.id
            const text = textarea.value
            if (text === "") {
                return
            }
            const response = await fetch(`/api/comment/${commentId}/edit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text }),

            })
            if (response.status === 201) {
                updateComment(text)
            }


        }
    }

}


video__comment.forEach(modifyComment);



