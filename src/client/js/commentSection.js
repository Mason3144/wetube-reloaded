const videoContainer = document.getElementById("videoContainer")
const form = document.getElementById("commentForm");
const li = document.querySelector("li")

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li")
    newComment.dataset.id = id
    newComment.className = "video__comment"
    const div = document.createElement("div")
    const div2 = document.createElement("div")
    const icon = document.createElement("i")
    icon.className = "fas fa-comment"
    const span = document.createElement("span")
    span.className = "contentSpan"
    span.innerText = ` ${text}`

    const span2 = document.createElement("span")
    span2.className = "fas fa-x deleteBtn"
    newComment.appendChild(div);
    newComment.appendChild(div2);

    div.appendChild(icon);
    div.appendChild(span);
    div2.appendChild(span2);
    videoComments.prepend(newComment);
}


const handleSubmit = async (event) => {
    event.preventDefault()
    const textarea = form.querySelector("textarea")
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
        const { newCommentId } = await response.json();

        addComment(text, newCommentId);
    }
}



if (form) {
    form.addEventListener("submit", handleSubmit)
}



const video__comment = document.querySelectorAll(".video__comment")



const modifyComment = (e) => {
    const deleteCommentBtn = e.querySelector(".deleteCommentBtn")
    const editCommentBtn = e.querySelector(".editCommentBtn")
    const parentNode = e.querySelector(".parentNode")
    const { id } = e.dataset


    const deleteComment = async () => {
        const res = await fetch(`/api/videos/${id}/comment/delete`, {
            method: "DELETE"
        })
        if (res.status === 200) {
            e.remove()
        }


    }

    const editComment = () => {
        const contentSpan = e.querySelector(".contentSpan")
        const editBtn = document.createElement("button")
        const textarea = document.createElement("textarea")
        editBtn.className = "editBtn"
        textarea.className = "textarea"
        parentNode.replaceChild(textarea, contentSpan);
        e.appendChild(editBtn)
        textarea.innerText = contentSpan.innerText
        editBtn.innerText = "submit"

        editBtn.addEventListener("click", editCommentServer)

    }

    deleteCommentBtn.addEventListener("click", deleteComment)
    editCommentBtn.addEventListener("click", editComment)

    const updateComment = (text) => {
        const editBtn = e.querySelector(".editBtn")
        const textarea = e.querySelector(".textarea")
        const contentSpan = document.createElement("contentSpan")
        contentSpan.className = "contentSpan"
        parentNode.replaceChild(contentSpan, textarea);
        contentSpan.innerText = text
        editBtn.remove()
    }

    const editCommentServer = async (event) => {
        const textarea = parentNode.querySelector("textarea")
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


video__comment.forEach(modifyComment);