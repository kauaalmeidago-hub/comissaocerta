document.addEventListener("DOMContentLoaded", () => {
    if (typeof AOS !== "undefined") {
        AOS.init({
            once: true,
            offset: 48,
            duration: 560,
            easing: "ease-out-cubic"
        });
    }

    const body = document.body;
    const header = document.querySelector("[data-header]");
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const nav = document.querySelector("[data-nav]");

    const updateHeader = () => {
        if (!header) return;
        header.classList.toggle("is-scrolled", window.scrollY > 18);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = body.classList.toggle("menu-open");
            menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => body.classList.remove("menu-open"));
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const targetId = anchor.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            const headerHeight = header ? header.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

            window.scrollTo({
                top,
                behavior: "smooth"
            });
        });
    });

    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");
        if (!question || !answer) return;

        question.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            faqItems.forEach((faq) => {
                faq.classList.remove("active");
                const currentAnswer = faq.querySelector(".faq-answer");
                if (currentAnswer) currentAnswer.style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add("active");
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
        });
    });

    const pricingToggle = document.getElementById("pricingToggle");
    const labelMensal = document.getElementById("labelMensal");
    const labelAnual = document.getElementById("labelAnual");

    const prices = {
        annual: {
            pro: ["137", ",90", "Cobrado anualmente: R$ 1.654,80"],
            master: ["258", ",05", "Cobrado anualmente: R$ 3.096,60"]
        },
        monthly: {
            pro: ["197", ",00", "Cobrança mensal sem fidelidade"],
            master: ["397", ",00", "Cobrança mensal sem fidelidade"]
        }
    };

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    const updatePricing = () => {
        if (!pricingToggle) return;
        const mode = pricingToggle.checked ? "annual" : "monthly";
        const data = prices[mode];

        setText("pricePro", data.pro[0]);
        setText("centsPro", data.pro[1]);
        setText("billingPro", data.pro[2]);
        setText("priceMaster", data.master[0]);
        setText("centsMaster", data.master[1]);
        setText("billingMaster", data.master[2]);

        labelMensal?.classList.toggle("active", mode === "monthly");
        labelAnual?.classList.toggle("active", mode === "annual");
    };

    pricingToggle?.addEventListener("change", updatePricing);
    updatePricing();

    const modalRoot = document.querySelector("[data-modal-root]");
    const modalPanel = modalRoot?.querySelector(".portal-modal");
    const modalTitle = modalRoot?.querySelector("[data-modal-title]");
    const modalKicker = modalRoot?.querySelector("[data-modal-kicker]");
    const modalCopy = modalRoot?.querySelector("[data-modal-copy]");
    const modalPoints = modalRoot?.querySelector("[data-modal-points]");
    let lastFocusedElement = null;

    const modalContent = {
        pro: {
            kicker: "Plano Pro",
            title: "Comece o teste com a estrutura ideal para equipes enxutas.",
            copy: "O portal abre em uma nova guia para voc\u00ea seguir com a avalia\u00e7\u00e3o, cadastro e acesso ao ambiente.",
            points: ["2 usu\u00e1rios para validar o fluxo", "30 relat\u00f3rios IA/m\u00eas", "An\u00e1lise de comiss\u00e3o por IA"]
        },
        master: {
            kicker: "Master Business",
            title: "Leve a auditoria para a corretora inteira.",
            copy: "O portal abre em uma nova guia para voc\u00ea continuar com a assinatura e liberar o ambiente de avalia\u00e7\u00e3o.",
            points: ["Usu\u00e1rios ilimitados", "Relat\u00f3rios IA ilimitados", "Treinamento e suporte priorit\u00e1rio"]
        },
        specialist: {
            kicker: "Especialista",
            title: "Converse com a equipe antes do pr\u00f3ximo fechamento.",
            copy: "Use o portal para entrar em contato e alinhar o melhor caminho para testar com os dados da sua opera\u00e7\u00e3o.",
            points: ["Demonstra\u00e7\u00e3o guiada do fluxo", "Ajuda para escolher o plano", "Pr\u00f3ximos passos claros para sua equipe"]
        }
    };

    const setModalContent = (type) => {
        const content = modalContent[type] || modalContent.pro;
        if (modalKicker) modalKicker.textContent = content.kicker;
        if (modalTitle) modalTitle.textContent = content.title;
        if (modalCopy) modalCopy.textContent = content.copy;
        if (modalPoints) {
            modalPoints.innerHTML = "";
            content.points.forEach((point) => {
                const item = document.createElement("li");
                item.textContent = point;
                modalPoints.appendChild(item);
            });
        }
    };

    const openModal = (type, trigger) => {
        if (!modalRoot || !modalPanel) return;
        lastFocusedElement = trigger || document.activeElement;
        setModalContent(type);
        body.classList.add("modal-open");
        modalRoot.setAttribute("aria-hidden", "false");
        modalRoot.classList.add("is-open");
        requestAnimationFrame(() => modalPanel.focus({ preventScroll: true }));
    };

    const closeModal = () => {
        if (!modalRoot) return;
        modalRoot.classList.remove("is-open");
        modalRoot.setAttribute("aria-hidden", "true");
        body.classList.remove("modal-open");
        if (lastFocusedElement instanceof HTMLElement) {
            lastFocusedElement.focus({ preventScroll: true });
        }
    };

    document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
        trigger.addEventListener("click", (event) => {
            event.preventDefault();
            openModal(trigger.dataset.openModal, trigger);
        });
    });

    modalRoot?.querySelectorAll("[data-modal-close]").forEach((button) => {
        button.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modalRoot?.classList.contains("is-open")) {
            closeModal();
        }
    });

    const numberItems = document.querySelectorAll("[data-count]");
    const renderFinalNumber = (element) => {
        const value = Number(element.dataset.count || "0");
        const prefix = element.dataset.prefix || "";
        const suffix = element.dataset.suffix || "";
        element.textContent = `${prefix}${Math.round(value).toLocaleString("pt-BR")}${suffix}`;
    };

    const animateNumber = (element) => {
        const target = Number(element.dataset.count || "0");
        const prefix = element.dataset.prefix || "";
        const suffix = element.dataset.suffix || "";
        const duration = 1100;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            element.textContent = `${prefix}${current.toLocaleString("pt-BR")}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    };

    if ("IntersectionObserver" in window) {
        const numberObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                animateNumber(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.4 });

        numberItems.forEach((item) => numberObserver.observe(item));
    } else {
        numberItems.forEach(renderFinalNumber);
    }

    const parallaxCard = document.querySelector("[data-parallax-card]");
    if (parallaxCard && window.matchMedia("(pointer: fine)").matches) {
        parallaxCard.addEventListener("pointermove", (event) => {
            const rect = parallaxCard.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            parallaxCard.style.setProperty("--ry", `${x * 7}deg`);
            parallaxCard.style.setProperty("--rx", `${y * -5}deg`);
        });

        parallaxCard.addEventListener("pointerleave", () => {
            parallaxCard.style.setProperty("--ry", "0deg");
            parallaxCard.style.setProperty("--rx", "0deg");
        });
    }
});

// Product walkthrough carousel
document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector("[data-product-carousel]");
    if (!carousel) return;

    const track = carousel.querySelector("[data-product-carousel-track]");
    const slides = Array.from(carousel.querySelectorAll("[data-product-slide]"));
    const dots = Array.from(carousel.querySelectorAll("[data-product-dot]"));
    const prev = carousel.querySelector("[data-product-carousel-prev]");
    const next = carousel.querySelector("[data-product-carousel-next]");
    let current = 0;

    const render = () => {
        if (!track || !slides.length) return;
        track.style.transform = `translateX(-${current * 100}%)`;
        slides.forEach((slide, index) => {
            slide.setAttribute("aria-hidden", String(index !== current));
        });
        dots.forEach((dot, index) => {
            dot.classList.toggle("is-active", index === current);
        });
    };

    const goTo = (index) => {
        current = (index + slides.length) % slides.length;
        render();
    };

    prev?.addEventListener("click", () => goTo(current - 1));
    next?.addEventListener("click", () => goTo(current + 1));
    dots.forEach((dot, index) => dot.addEventListener("click", () => goTo(index)));
    render();

    const video = document.querySelector("[data-product-video]");
    if (video) {
        const startAt = Number(video.dataset.start || "0");
        const endAt = Number(video.dataset.end || "0");
        const resetVideoStart = () => {
            if (startAt > 0 && video.currentTime < startAt) {
                video.currentTime = startAt;
            }
        };

        if (startAt > 0) {
            video.addEventListener("loadedmetadata", resetVideoStart, { once: true });
            video.addEventListener("play", resetVideoStart);
        }

        if (endAt > 0) {
            video.addEventListener("timeupdate", () => {
                if (video.currentTime >= endAt) {
                    video.pause();
                    video.currentTime = startAt > 0 ? startAt : 0;
                }
            });
        }
    }
});
