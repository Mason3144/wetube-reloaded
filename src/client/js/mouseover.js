const thumbnail_play = document.querySelectorAll(".thumbnail_play");

thumbnail_play.forEach(function (on) {
    on.onmouseover = function () {
        this.children[0].classList.add("hiding")
        this.children[1].classList.remove("hiding")
        this.children[1].play()
        this.classList.add("scale_animation")

    }
    on.onmouseout = function () {
        this.children[0].classList.remove("hiding")
        this.children[1].classList.add("hiding")
        this.children[1].load();
        this.classList.remove("scale_animation")
    }
})
