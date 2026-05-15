const showMoreBtn =
document.getElementById("showMoreBtn");

const hiddenProjects =
document.querySelectorAll(".hidden-project");

let visible = false;

showMoreBtn.addEventListener("click", () => {

    visible = !visible;

    hiddenProjects.forEach(project => {

        project.classList.toggle("show-project");

    });

    showMoreBtn.textContent =
    visible ? "VER MENOS" : "VER MÁS";

});

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {

        item.classList.toggle("active");

    });

});

window.addEventListener("load", () => {

    const left = document.querySelector(".reveal-left");

    const right = document.querySelector(".reveal-right");

    if(left){

        setTimeout(() => {
            left.classList.add("active");
        }, 200);

    }

    if(right){

        setTimeout(() => {
            right.classList.add("active");
        }, 500);

    }

});

const reveals = document.querySelectorAll(".scroll-reveal");

window.addEventListener("scroll", () => {

    reveals.forEach(reveal => {

        const windowHeight = window.innerHeight;

        const revealTop = reveal.getBoundingClientRect().top;

        if (revealTop < windowHeight - 100) {

            reveal.classList.add("active");

        }

    });

});