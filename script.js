
document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // Scroll progress indicator
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);

    let scrollTicking = false;

    function updateScrollEffects() {
        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const percentage = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        progress.style.width = `${percentage}%`;

        const navbar = document.querySelector(".navbar");
        if (navbar) {
            navbar.classList.toggle("scrolled", window.scrollY > 20);
        }

        scrollTicking = false;
    }

    window.addEventListener("scroll", () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(updateScrollEffects);
            scrollTicking = true;
        }
    }, { passive: true });

    updateScrollEffects();

    // Reveal sections and cards as they enter the viewport
    const revealTargets = document.querySelectorAll(
        ".section .eyebrow, .section h2, .section .section-copy, " +
        ".project-card, .highlight-item, .experience-card, " +
        ".education-card, .skill-group"
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealTargets.forEach(element => {
            element.classList.add("is-visible");
        });
    } else {
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    currentObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        });

        revealTargets.forEach(element => {
            element.classList.add("reveal");
            observer.observe(element);
        });
    }

    // Mouse-responsive lavender lighting around the chip
    const heroVisual = document.querySelector(".hero-visual");

    if (heroVisual && !reduceMotion) {
        heroVisual.addEventListener("pointermove", event => {
            const rect = heroVisual.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;

            heroVisual.style.setProperty("--pointer-x", `${x}%`);
            heroVisual.style.setProperty("--pointer-y", `${y}%`);
        });

        heroVisual.addEventListener("pointerleave", () => {
            heroVisual.style.setProperty("--pointer-x", "50%");
            heroVisual.style.setProperty("--pointer-y", "50%");
        });
    }

    // Subtle 3D tilt on desktop project cards
    const projectCards = document.querySelectorAll(".project-card");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!reduceMotion && finePointer) {
        projectCards.forEach(card => {
            card.addEventListener("pointermove", event => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;

                const rotateY = (x - 0.5) * 5;
                const rotateX = (0.5 - y) * 5;

                card.style.transform =
                    `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }

    // Keep in-page navigation smooth and close to the selected section
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });

            history.replaceState(null, "", targetId);
        });
    });
});
