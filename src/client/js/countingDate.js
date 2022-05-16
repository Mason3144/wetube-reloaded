const div = document.querySelectorAll(".video-mixin__meta")
const commentDiv = document.querySelectorAll(".parentNode")

const countingDate = (event) => {
    const { createdat } = event.dataset
    const span = event.querySelector(".date_counting")

    const setDate = new Date(createdat);
    const currentTime = new Date();
    const distance = currentTime.getTime() - setDate.getTime()

    const year = Math.floor(distance / (1000 * 60 * 60 * 24 * 365))
    const month = Math.floor(distance / (1000 * 60 * 60 * 24 * 30))
    const day = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    if (year > 0) {
        span.innerText = `${year} 년전`
    } else if (month > 0) {
        span.innerText = `${month} 달전`
    } else if (day > 0) {
        span.innerText = `${day} 일전`
    } else if (hours > 0) {
        span.innerText = `${hours} 시간전`
    } else if (minutes > 0) {
        span.innerText = `${minutes} 분전`
    } else if (minutes < 1) {
        span.innerText = `0 분전`
    }

}

div.forEach(countingDate)
commentDiv.forEach(countingDate)
