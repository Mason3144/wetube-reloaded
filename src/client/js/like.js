const videoLikeBtn = document.getElementById("videoLikeBtn")
const videoLikeSpan = document.getElementById("videoLikeSpan")

const handleVideoLike = async (event) => {
    event.preventDefault()
    const { id } = videoContainer.dataset
    const response = await fetch(`/api/videos/${id}/like`, {
        method: "POST"
    })
    if (response.status === 200) {
        switchLike()
    }
}
const switchLike = () => {
    const list = videoLikeBtn.classList
    if (list.length === 3) {
        list.remove("liked")
        videoLikeSpan.innerText = Number(videoLikeSpan.innerText) - 1;
    } else {
        list.add("liked")
        videoLikeSpan.innerText = Number(videoLikeSpan.innerText) + 1;
    }
}




videoLikeBtn.addEventListener("click", handleVideoLike)


