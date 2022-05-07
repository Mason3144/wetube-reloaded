const videoContainer = document.getElementById("videoContainer")
const form = document.getElementById("commentForm");
const li = document.querySelector("li")
const deleteBtn = document.querySelectorAll(".deleteBtn")

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

const deleteClick = (e) => {
    const deleteComment = async (event) => {
        const path = event.path[2]
        const { id } = path.dataset
        const res = await fetch(`/api/videos/${id}/comment/delete`, {
            method: "DELETE"
        })
        if (res.status === 200) {
            path.remove()
        }


    }
    e.addEventListener("click", deleteComment)
}


if (form) {
    form.addEventListener("submit", handleSubmit)
}

deleteBtn.forEach(deleteClick);
