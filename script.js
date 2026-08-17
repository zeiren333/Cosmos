const pages = document.querySelectorAll(".page");
const links = document.querySelectorAll("[data-page]");
const header = document.querySelector(".header");
const mobileNav = document.getElementById("mobileNav");
const mobileToggle = document.getElementById("mobileToggle");

const preloadScreen =
    document.getElementById("preloadScreen");

const preloadProgressBar =
    document.getElementById("preloadProgressBar");

const preloadPercent =
    document.getElementById("preloadPercent");

const preloadEnter =
    document.getElementById("preloadEnter");

const bgMusic =
    document.getElementById("bg-music");

let preloadFinished = false;

function closeMobileNav() {
    if (mobileNav) {
        mobileNav.classList.remove(
            "mobile-nav--open"
        );
    }

    if (mobileToggle) {
        mobileToggle.classList.remove(
            "header__toggle--open"
        );

        mobileToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    }
}

function showPage(pageName) {
    pages.forEach((page) => {
        page.classList.remove(
            "page--active"
        );
    });

    links.forEach((link) => {
        link.classList.remove(
            "header__link--active"
        );
    });

    const page =
        document.getElementById(pageName);

    if (page) {
        page.classList.add(
            "page--active"
        );
    }

    document
        .querySelectorAll(
            `.header__link[data-page="${pageName}"]`
        )
        .forEach((activeLink) => {
            activeLink.classList.add(
                "header__link--active"
            );
        });

    closeMobileNav();

    revealVisible();

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
}

links.forEach((link) => {
    link.addEventListener(
        "click",
        (event) => {
            event.preventDefault();

            const pageName =
                link.dataset.page;

            showPage(pageName);

            history.pushState(
                null,
                "",
                `#${pageName}`
            );
        }
    );
});

window.addEventListener(
    "popstate",
    () => {
        const pageName =
            location.hash.replace(
                "#",
                ""
            ) || "home";

        showPage(pageName);
    }
);

if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener(
        "click",
        () => {
            const isOpen =
                mobileNav.classList.toggle(
                    "mobile-nav--open"
                );

            mobileToggle.classList.toggle(
                "header__toggle--open",
                isOpen
            );

            mobileToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        }
    );
}

const cursor = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,

    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,

    velocityX: 0,
    velocityY: 0,

    size: 7
};

document.addEventListener(
    "mousemove",
    (event) => {
        const dx =
            event.clientX -
            cursor.targetX;

        const dy =
            event.clientY -
            cursor.targetY;

        cursor.velocityX +=
            dx * 0.12;

        cursor.velocityY +=
            dy * 0.12;

        cursor.targetX =
            event.clientX;

        cursor.targetY =
            event.clientY;

        document.documentElement.style.setProperty(
            "--cursor-target-x",
            `${event.clientX}px`
        );

        document.documentElement.style.setProperty(
            "--cursor-target-y",
            `${event.clientY}px`
        );

        if (header) {
            const rect =
                header.getBoundingClientRect();

            header.style.setProperty(
                "--header-mouse-x",
                `${event.clientX - rect.left}px`
            );

            header.style.setProperty(
                "--header-mouse-y",
                `${event.clientY - rect.top}px`
            );
        }
    }
);

document.addEventListener(
    "mousedown",
    () => {
        cursor.size = 4;
    }
);

document.addEventListener(
    "mouseup",
    () => {
        cursor.size = 7;
    }
);

function animateCursor() {
    const dx =
        cursor.targetX -
        cursor.x;

    const dy =
        cursor.targetY -
        cursor.y;

    cursor.velocityX +=
        dx * 0.025;

    cursor.velocityY +=
        dy * 0.025;

    cursor.velocityX *= 0.82;
    cursor.velocityY *= 0.82;

    cursor.x +=
        cursor.velocityX;

    cursor.y +=
        cursor.velocityY;

    document.documentElement.style.setProperty(
        "--cursor-x",
        `${cursor.x}px`
    );

    document.documentElement.style.setProperty(
        "--cursor-y",
        `${cursor.y}px`
    );

    document.documentElement.style.setProperty(
        "--cursor-size",
        `${cursor.size}px`
    );

    requestAnimationFrame(
        animateCursor
    );
}

animateCursor();

document.addEventListener(
    "contextmenu",
    (event) => {
        event.preventDefault();
    }
);

document.addEventListener(
    "selectstart",
    (event) => {
        event.preventDefault();
    }
);

document.addEventListener(
    "dragstart",
    (event) => {
        event.preventDefault();
    }
);

document.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Escape") {
            closeCosmosModal();
            closeMobileNav();
        }
    }
);

const revealTargets =
    document.querySelectorAll(
        ".reveal"
    );

let revealObserver = null;

if (
    "IntersectionObserver" in
    window
) {
    revealObserver =
        new IntersectionObserver(
            (entries) => {
                entries.forEach(
                    (entry) => {
                        if (
                            entry.isIntersecting
                        ) {
                            entry.target.classList.add(
                                "reveal--visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );
                        }
                    }
                );
            },
            {
                threshold: 0.15
            }
        );
}

function revealVisible() {
    if (revealObserver) {
        revealTargets.forEach(
            (element) => {
                revealObserver.observe(
                    element
                );
            }
        );
    } else {
        revealTargets.forEach(
            (element) => {
                element.classList.add(
                    "reveal--visible"
                );
            }
        );
    }
}

const initialPage =
    location.hash.replace(
        "#",
        ""
    ) || "home";

showPage(initialPage);

revealVisible();

function getPreloadResources() {
    const resources = [];

    document
        .querySelectorAll(
            "img[src]"
        )
        .forEach((image) => {
            resources.push(
                image.currentSrc ||
                    image.src
            );
        });

    document
        .querySelectorAll(
            "video[src]"
        )
        .forEach((video) => {
            resources.push(
                video.currentSrc ||
                    video.src
            );
        });

    document
        .querySelectorAll(
            "audio[src]"
        )
        .forEach((audio) => {
            resources.push(
                audio.currentSrc ||
                    audio.src
            );
        });

    document
        .querySelectorAll(
            "source[src]"
        )
        .forEach((source) => {
            resources.push(
                source.src
            );
        });

    document
        .querySelectorAll(
            "link[rel='stylesheet'][href]"
        )
        .forEach((link) => {
            resources.push(
                link.href
            );
        });

    document
        .querySelectorAll(
            "[data-preload]"
        )
        .forEach((element) => {
            if (
                element.dataset.preload
            ) {
                resources.push(
                    element.dataset.preload
                );
            }
        });

    return [
        ...new Set(
            resources.filter(Boolean)
        )
    ];
}

function updatePreloadProgress(
    loaded,
    total
) {
    const progress =
        total === 0
            ? 100
            : Math.round(
                  (loaded / total) *
                      100
              );

    if (preloadProgressBar) {
        preloadProgressBar.style.width =
            `${progress}%`;
    }

    if (preloadPercent) {
        preloadPercent.textContent =
            `${progress}%`;
    }
}

function preloadImage(url) {
    return new Promise(
        (resolve) => {
            const image =
                new Image();

            image.onload = resolve;
            image.onerror = resolve;

            image.src = url;

            if (
                image.complete
            ) {
                resolve();
            }
        }
    );
}

function preloadResource(url) {
    if (
        url.startsWith("data:")
    ) {
        return Promise.resolve();
    }

    const lowerUrl =
        url.toLowerCase();

    if (
        /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/
            .test(lowerUrl)
    ) {
        return preloadImage(url);
    }

    return new Promise(
        (resolve) => {
            fetch(url, {
                cache: "force-cache"
            })
                .then(() => {
                    resolve();
                })
                .catch(() => {
                    resolve();
                });
        }
    );
}

async function startPreload() {
    if (!preloadScreen) {
        preloadFinished = true;

        return;
    }

    const resources =
        getPreloadResources();

    let loaded = 0;

    updatePreloadProgress(
        0,
        resources.length
    );

    if (resources.length > 0) {
        await Promise.all(
            resources.map(
                async (resource) => {
                    await preloadResource(
                        resource
                    );

                    loaded += 1;

                    updatePreloadProgress(
                        loaded,
                        resources.length
                    );
                }
            )
        );
    }

    if (
        document.fonts &&
        document.fonts.ready
    ) {
        await document.fonts.ready;
    }

    updatePreloadProgress(
        resources.length,
        resources.length
    );

    preloadFinished = true;

    if (preloadPercent) {
        preloadPercent.textContent =
            "Готово";
    }

    if (preloadEnter) {
        preloadEnter.disabled =
            false;

        preloadEnter.classList.add(
            "preload-screen__button--visible"
        );
    }
}

function enterSite() {
    if (
        !preloadFinished ||
        !preloadScreen
    ) {
        return;
    }

    if (bgMusic) {
        bgMusic.volume = 0.5;

        const playPromise =
            bgMusic.play();

        if (
            playPromise &&
            typeof playPromise.catch ===
                "function"
        ) {
            playPromise.catch(
                () => {}
            );
        }
    }

    preloadScreen.classList.add(
        "preload-screen--hidden"
    );

    document.body.classList.add(
        "site--loaded"
    );

    setTimeout(() => {
        preloadScreen.remove();
    }, 450);
}

if (preloadEnter) {
    preloadEnter.addEventListener(
        "click",
        enterSite
    );
}

startPreload();

const canvas =
    document.getElementById(
        "starfield"
    );

if (canvas) {
    const ctx =
        canvas.getContext("2d");

    let stars = [];
    let shootingStar = null;

    let width;
    let height;

    function resize() {
        width =
            canvas.width =
                window.innerWidth;

        height =
            canvas.height =
                window.innerHeight;

        const count =
            Math.min(
                220,
                Math.floor(
                    (width * height) /
                        9000
                )
            );

        stars =
            Array.from(
                {
                    length: count
                },
                () => ({
                    x:
                        Math.random() *
                        width,

                    y:
                        Math.random() *
                        height,

                    r:
                        Math.random() *
                            1.3 +
                        0.3,

                    baseAlpha:
                        Math.random() *
                            0.5 +
                        0.25,

                    speed:
                        Math.random() *
                            0.02 +
                        0.005,

                    phase:
                        Math.random() *
                        Math.PI *
                        2
                })
            );
    }

    function maybeSpawnShootingStar() {
        if (
            !shootingStar &&
            Math.random() <
                0.0025
        ) {
            shootingStar = {
                x:
                    Math.random() *
                        width *
                        0.6 +
                    width *
                        0.2,

                y: -10,

                vx:
                    -4 -
                    Math.random() *
                        3,

                vy:
                    4 +
                    Math.random() *
                        3,

                life: 0,

                maxLife: 60
            };
        }
    }

    function draw(time) {
        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        stars.forEach(
            (star) => {
                const twinkle =
                    star.baseAlpha +
                    Math.sin(
                        time *
                            star.speed +
                            star.phase
                    ) *
                        0.2;

                ctx.beginPath();

                ctx.arc(
                    star.x,
                    star.y,
                    star.r,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    `rgba(255, 255, 255, ${Math.max(
                        0,
                        twinkle
                    )})`;

                ctx.fill();
            }
        );

        maybeSpawnShootingStar();

        if (shootingStar) {
            shootingStar.x +=
                shootingStar.vx;

            shootingStar.y +=
                shootingStar.vy;

            shootingStar.life += 1;

            const alpha =
                1 -
                shootingStar.life /
                    shootingStar.maxLife;

            ctx.beginPath();

            ctx.strokeStyle =
                `rgba(255, 255, 255, ${Math.max(
                    0,
                    alpha
                )})`;

            ctx.lineWidth = 1.5;

            ctx.moveTo(
                shootingStar.x,
                shootingStar.y
            );

            ctx.lineTo(
                shootingStar.x -
                    shootingStar.vx *
                        4,

                shootingStar.y -
                    shootingStar.vy *
                        4
            );

            ctx.stroke();

            if (
                shootingStar.life >
                    shootingStar.maxLife ||
                shootingStar.y >
                    height + 20
            ) {
                shootingStar = null;
            }
        }

        requestAnimationFrame(
            draw
        );
    }

    resize();

    window.addEventListener(
        "resize",
        resize
    );

    requestAnimationFrame(
        draw
    );
}

const factTitle =
    document.getElementById(
        "factTitle"
    );

const factText =
    document.getElementById(
        "factText"
    );

const factButton =
    document.getElementById(
        "factButton"
    );

const spaceFacts = [
    {
        q: "Один день на Венере длиннее её года",
        a: "Венера вращается вокруг своей оси настолько медленно, что один оборот занимает 243 земных дня - больше, чем 225 дней, за которые она облетает Солнце."
    },
    {
        q: "Свет от Солнца идёт до нас 8 минут",
        a: "Расстояние от Солнца до Земли фотон преодолевает примерно за 8 минут 20 секунд."
    },
    {
        q: "В космосе нет звука",
        a: "Звук - это колебания частиц среды, а космос - почти идеальный вакуум."
    },
    {
        q: "Нейтронная звезда невероятно плотная",
        a: "Чайная ложка вещества нейтронной звезды весила бы на Земле около миллиарда тонн."
    }
];

let lastFactIndex = -1;

function showRandomFact() {
    if (
        !factTitle ||
        !factText
    ) {
        return;
    }

    let index =
        Math.floor(
            Math.random() *
                spaceFacts.length
        );

    while (
        spaceFacts.length > 1 &&
        index === lastFactIndex
    ) {
        index =
            Math.floor(
                Math.random() *
                    spaceFacts.length
            );
    }

    lastFactIndex = index;

    factTitle.textContent =
        spaceFacts[index].q;

    factText.textContent =
        spaceFacts[index].a;
}

if (factButton) {
    factButton.addEventListener(
        "click",
        showRandomFact
    );

    showRandomFact();
}

const cosmosModal =
    document.getElementById(
        "cosmosModal"
    );

const cosmosModalTitle =
    document.getElementById(
        "cosmosModalTitle"
    );

const cosmosModalText =
    document.getElementById(
        "cosmosModalText"
    );

const cosmosModalClose =
    document.getElementById(
        "cosmosModalClose"
    );

function openCosmosModal(
    title,
    detail
) {
    if (!cosmosModal) {
        return;
    }

    cosmosModalTitle.textContent =
        title;

    cosmosModalText.textContent =
        detail;

    cosmosModal.classList.add(
        "modal--open"
    );

    document.body.style.overflow =
        "hidden";
}

function closeCosmosModal() {
    if (!cosmosModal) {
        return;
    }

    cosmosModal.classList.remove(
        "modal--open"
    );

    document.body.style.removeProperty(
        "overflow"
    );
}

document
    .querySelectorAll(
        ".cosmos-card__more"
    )
    .forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                const card =
                    button.closest(
                        ".cosmos-card"
                    );

                const title =
                    card
                        ?.querySelector(
                            ".cosmos-card__title"
                        )
                        ?.textContent.trim();

                const detail =
                    card?.dataset.detail;

                if (
                    title &&
                    detail
                ) {
                    openCosmosModal(
                        title,
                        detail
                    );
                }
            }
        );
    });

if (cosmosModalClose) {
    cosmosModalClose.addEventListener(
        "click",
        closeCosmosModal
    );
}

if (cosmosModal) {
    cosmosModal.addEventListener(
        "click",
        (event) => {
            if (
                event.target ===
                cosmosModal
            ) {
                closeCosmosModal();
            }
        }
    );
}

document
    .querySelectorAll(
        ".contact-card__copy"
    )
    .forEach((button) => {
        button.addEventListener(
            "click",
            async (event) => {
                event.preventDefault();

                const value =
                    button.dataset.copy;

                try {
                    await navigator.clipboard.writeText(
                        value
                    );

                    const toast =
                        document.getElementById(
                            "toast"
                        );

                    if (toast) {
                        toast.textContent =
                            "Скопировано: " +
                            value;

                        toast.classList.add(
                            "toast--visible"
                        );

                        clearTimeout(
                            toast._hideTimer
                        );

                        toast._hideTimer =
                            setTimeout(
                                () => {
                                    toast.classList.remove(
                                        "toast--visible"
                                    );
                                },
                                2000
                            );
                    }
                } catch (error) {}
            }
        );
    });
