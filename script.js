const pages = document.querySelectorAll(".page");
const links = document.querySelectorAll("[data-page]");
const header = document.querySelector(".header");

function showPage(pageName) {
    pages.forEach((page) => {
        page.classList.remove("page--active");
    });

    links.forEach((link) => {
        link.classList.remove("header__link--active");
    });

    const page = document.getElementById(pageName);

    if (page) {
        page.classList.add("page--active");
    }

    const activeLink = document.querySelector(
        `.header__link[data-page="${pageName}"]`
    );

    if (activeLink) {
        activeLink.classList.add("header__link--active");
    }
}

links.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const pageName = link.dataset.page;

        showPage(pageName);

        history.pushState(
            null,
            "",
            `#${pageName}`
        );
    });
});

window.addEventListener("popstate", () => {
    const pageName =
        location.hash.replace("#", "") || "home";

    showPage(pageName);
});

const initialPage =
    location.hash.replace("#", "") || "home";

showPage(initialPage);

document.addEventListener("mousemove", (event) => {
    document.documentElement.style.setProperty(
        "--cursor-x",
        `${event.clientX}px`
    );

    document.documentElement.style.setProperty(
        "--cursor-y",
        `${event.clientY}px`
    );

    if (header) {
        const rect = header.getBoundingClientRect();

        header.style.setProperty(
            "--header-mouse-x",
            `${event.clientX - rect.left}px`
        );

        header.style.setProperty(
            "--header-mouse-y",
            `${event.clientY - rect.top}px`
        );
    }
});

document.addEventListener("mousedown", () => {
    document.body.style.setProperty(
        "--cursor-size",
        "4px"
    );
});

document.addEventListener("mouseup", () => {
    document.body.style.setProperty(
        "--cursor-size",
        "7px"
    );
});

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

document.addEventListener("selectstart", (event) => {
    event.preventDefault();
});

document.addEventListener("dragstart", (event) => {
    event.preventDefault();
});

document.addEventListener("copy", (event) => {
    event.preventDefault();
});

document.addEventListener("cut", (event) => {
    event.preventDefault();
});

document.addEventListener("paste", (event) => {
    event.preventDefault();
});

document.addEventListener("keydown", (event) => {
    event.preventDefault();
});