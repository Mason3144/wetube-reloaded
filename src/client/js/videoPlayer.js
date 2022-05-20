const video = document.querySelector("#videoInPlayer");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreenBtn");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const textarea = document.getElementById("textarea")

let volumeValue = 0.5;
video.volume = volumeValue;

let videoStatus = false;
let videoStatus2 = false;

let controlsTimout = null;
let controlsMovementTimeout = null;

video.play()
const handlePlayClick = (e) => {
    if (video.paused) {
        video.play()
        // playBtn.innerText = "Pause";
    } else {
        video.pause()
        // playBtn.innerText = "Play";
    }

    if (video.paused) {
        playBtn.classList.replace("fa-pause", "fa-play")
    } else {
        playBtn.classList.replace("fa-play", "fa-pause")
    }
}
const handleMute = () => {
    if (video.muted) {
        video.muted = false;
        muteBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
        volumeRange.value = 0
    } else {
        video.muted = true;
        muteBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
        volumeRange.value = volumeValue
    }
}

const handleVolumeChange = (event) => {
    const { target: { value } } = event;
    // if (video.muted) {
    //     video.muted = false;
    //     muteBtn.innerText = "Mute"
    // }
    volumeValue = value;
    video.volume = value;
    if (video.volume === 0) {
        video.muted = true;
        muteBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    } else {
        video.muted = false;
        muteBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
    }


}



const formatTime = (seconds) => {
    if (seconds >= 3600 * 1000) {
        return new Date(seconds * 1000).toISOString().substring(11, 19);
    } else {
        return new Date(seconds * 1000).toISOString().substring(14, 19);
    }
};


const handleLoadedMetadata = () => {
    console.dir(video)
    if (!isNaN(video.duration)) {
        totalTime.innerText = formatTime(Math.floor(video.duration));
        timeline.max = Math.floor(video.duration)
    } else {
        handleLoadedMetadata()
    }


}




const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
}


// pause false, 
const handleTimelineChange = (event) => {
    const { target: { value } } = event;
    if (!videoStatus) {
        videoStatus2 = video.paused ? false : true;
        videoStatus = true;
    }
    video.pause();
    video.currentTime = value
}
const pauseTimeline = () => {
    // if (!videoStatus2) {
    //     video.pause()
    // } else {
    //     video.play()
    // }
    videoStatus2 ? video.play() : video.pause();
    videoStatus = false
}

const shortcutKeyCtr = (event) => {
    if (event.target.id === "textarea") {
        return
    }
    if (event.keyCode === 32 && event.target === document.body) {
        event.preventDefault();
        return handlePlayClick();
    }
    if (event.code === "KeyM") {
        return handleMute();
    }
    if (event.code === "KeyF") {
        return handleFullScreen();
    }
}
const handleFullScreen = () => {
    const fullescreen = document.fullscreenElement;
    if (fullescreen) {
        document.exitFullscreen()
        fullScreenBtn.classList.replace("fa-compress", "fa-expand")
    } else {
        videoContainer.requestFullscreen()
        fullScreenBtn.classList.replace("fa-expand", "fa-compress")
    }


}

const hideControls = () => videoControls.classList.remove("showing")


const handleMouseMove = () => {
    if (controlsTimout) {
        clearTimeout(controlsTimout);
        controlsTimout = null;
    }
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing")
    controlsMovementTimeout = setTimeout(hideControls, 3000)
}

const handleMouseLeave = () => {
    controlsTimout = setTimeout(hideControls, 3000)
}

const handleEnded = () => {
    const { id } = videoContainer.dataset
    fetch(`/api/videos/${id}/view`, {
        method: "POST"
    })
}


playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange)
video.addEventListener("canplay", handleLoadedMetadata)
video.addEventListener("timeupdate", handleTimeUpdate)
timeline.addEventListener("input", handleTimelineChange)
timeline.addEventListener("change", pauseTimeline)
window.addEventListener("keydown", shortcutKeyCtr)
fullScreenBtn.addEventListener("click", handleFullScreen)
videoControls.addEventListener("mousemove", handleMouseMove);
videoControls.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("click", handlePlayClick)
video.addEventListener("ended", handleEnded)