/* ===============================
   NAVBAR SCROLL EFFECT
================================ */
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

/* ===============================
   MOBILE MENU (HAMBURGER)
================================ */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    document.body.classList.toggle("menu-open");
});

// Close menu ONLY for real navigation links
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {

        // Do NOT close menu for dropdown toggles
        if (link.parentElement.classList.contains("has-dropdown")) return;

        navLinks.classList.remove("active");
        document.body.classList.remove("menu-open");
    });
});

// Mobile dropdown toggle
document.querySelectorAll(".has-dropdown > a").forEach(link => {
    link.addEventListener("click", e => {
        if (window.innerWidth <= 768) {
            e.preventDefault();

            const parent = link.parentElement;

            // Close other dropdowns
            document.querySelectorAll(".has-dropdown").forEach(item => {
                if (item !== parent) item.classList.remove("active");
            });

            parent.classList.toggle("active");
        }
    });
});

/* ===============================
   COUNTER ANIMATION
================================ */
const counters = document.querySelectorAll(".counter");
let counterAnimated = false;

const animateCounters = () => {
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        let current = 0;
        const increment = target / 120;

        const update = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };
        update();
    });
};

/* ===============================
   PROGRESS BAR ANIMATION
================================ */
const progressBars = document.querySelectorAll(".progress-fill");
let progressAnimated = false;

const animateProgress = () => {
    progressBars.forEach(bar => {
        bar.style.width = bar.dataset.progress + "%";
    });
};

/* ===============================
   SCROLL OBSERVER (STATS + TECH)
================================ */
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        if (entry.target.classList.contains("stats") && !counterAnimated) {
            animateCounters();
            counterAnimated = true;
        }

        if (entry.target.classList.contains("technologies") && !progressAnimated) {
            animateProgress();
            progressAnimated = true;
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll(".stats, .technologies").forEach(el => observer.observe(el));

/* ===============================
   TESTIMONIAL SLIDER
================================ */
const testimonialCards = document.querySelectorAll(".testimonial-card");
const dots = document.querySelectorAll(".dot");
let currentSlide = 0;

function showSlide(index) {
    testimonialCards.forEach((card, i) => {
        card.classList.toggle("active", i === index);
        dots[i].classList.toggle("active", i === index);
    });
}

setInterval(() => {
    currentSlide = (currentSlide + 1) % testimonialCards.length;
    showSlide(currentSlide);
}, 5000);

dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
        currentSlide = i;
        showSlide(i);
    });
});

/* ===============================
   CONTACT FORM VALIDATION
================================ */
// const contactForm = document.getElementById("contactForm");
// const nameInput = document.getElementById("name");
// const emailInput = document.getElementById("email");
// const phoneInput = document.getElementById("phone");
// const messageInput = document.getElementById("message");

// const validateEmail = email =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// const validatePhone = phone =>
//     phone.replace(/\D/g, "").length >= 10;

// contactForm.addEventListener("submit", e => {
//     e.preventDefault();

//     let valid = true;

//     if (!nameInput.value.trim()) valid = false;
//     if (!validateEmail(emailInput.value)) valid = false;
//     if (!validatePhone(phoneInput.value)) valid = false;
//     if (!messageInput.value.trim()) valid = false;

//     if (valid) {
//         alert("Thank you for your message! We will get back to you soon.");
//         contactForm.reset();
//     }
// });

/* ===============================
   SCROLL PROGRESS + TOP BUTTON
================================ */
const scrollIndicator = document.getElementById("scrollIndicator");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const progressCircle = document.querySelector(".progress-ring__circle");

const radius = 22;
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = circumference;

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const offset = circumference - (scrollTop / height) * circumference;

    progressCircle.style.strokeDashoffset = offset;
    scrollIndicator.style.display = scrollTop > 200 ? "flex" : "none";
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ===============================
   SCROLL REVEAL
================================ */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        entry.target.classList.toggle("active", entry.isIntersecting);
    });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ===============================
   FAQ ACCORDION
================================ */
document.querySelectorAll(".faq-item").forEach(item => {
    item.querySelector(".faq-question").addEventListener("click", () => {
        document.querySelectorAll(".faq-item").forEach(other => {
            if (other !== item) {
                other.classList.remove("active");
                other.querySelector(".faq-answer").style.maxHeight = null;
            }
        });

        item.classList.toggle("active");
        const answer = item.querySelector(".faq-answer");
        answer.style.maxHeight = item.classList.contains("active")
            ? answer.scrollHeight + "px"
            : null;
    });
});

/* ===============================
   HERO EFFECTS
================================ */
const words = ["Modern Enterprises", "Cloud & Data Centers", "Secure Networks"];
let wi = 0, ci = 0;
const typing = document.querySelector(".typing");

function type() {
    if (ci < words[wi].length) {
        typing.textContent += words[wi][ci++];
        setTimeout(type, 90);
    } else setTimeout(erase, 1500);
}

function erase() {
    if (ci > 0) {
        typing.textContent = words[wi].slice(0, --ci);
        setTimeout(erase, 40);
    } else {
        wi = (wi + 1) % words.length;
        setTimeout(type, 300);
    }
}
type();

/* PARTICLES */
const particles = document.querySelector(".hero-particles");
for (let i = 0; i < 35; i++) {
    const p = document.createElement("span");
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = 10 + Math.random() * 20 + "s";
    particles.appendChild(p);
}

/* PARALLAX */
const hero = document.querySelector(".hero");
const heroContent = document.querySelector(".hero-content");

hero.addEventListener("mousemove", e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    heroContent.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
});

hero.addEventListener("mouseleave", () => {
    heroContent.style.transform = "";
});







/* ===============================
   WEB3FORMS + VALIDATION + RESET
================================ */

// const contactForm = document.getElementById("contactForm");

// if (contactForm) {

//     contactForm.addEventListener("submit", function (e) {
//         e.preventDefault();

//         const name = document.getElementById("name");
//         const email = document.getElementById("email");
//         const phone = document.getElementById("phone");
//         const message = document.getElementById("message");
//         const status = document.getElementById("formStatus");

//         if (name.value.trim() === "") {
//             alert("Enter name");
//             return;
//         }

//         if (!email.value.includes("@")) {
//             alert("Enter valid email");
//             return;
//         }

//         if (phone.value.trim().length < 10) {
//             alert("Enter valid phone");
//             return;
//         }



//         fetch(contactForm.action, {
//             method: "POST",
//             body: new FormData(contactForm)
//         })
//             .then(res => res.json())
//             .then(data => {

//                 if (data.success) {
//                     status.innerHTML = "Message Sent Successfully!";
//                     contactForm.reset();
//                 } else {
//                     status.innerHTML = "Failed to send";
//                 }

//             })
//             .catch(() => {
//                 status.innerHTML = " Network error";
//             });

//     });

// }


const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");
        const status = document.getElementById("formStatus");

        let valid = true;

        clearErrors();

        if (name.value.trim() === "") {
            showError(name, "Enter your name");
            valid = false;
        }

        if (!email.value.includes("@")) {
            showError(email, "Enter valid email");
            valid = false;
        }

        if (phone.value.trim().length < 10) {
            showError(phone, "Enter valid phone");
            valid = false;
        }

        if (!valid) return;

        fetch(contactForm.action, {
            method: "POST",
            body: new FormData(contactForm)
        })
            .then(res => res.json())
            .then(data => {

                if (data.success) {
                    status.innerHTML = "Message Sent Successfully!";
                    status.className = "success";
                    contactForm.reset();
                } else {
                    status.innerHTML = "Failed to send";
                }

            })
            .catch(() => {
                status.innerHTML = "Network error";
            });

    });

}

function showError(input, message) {
    input.classList.add("input-error");
    input.nextElementSibling.innerHTML = message;
}

function clearErrors() {
    document.querySelectorAll(".error-text").forEach(e => e.innerHTML = "");
    document.querySelectorAll("input").forEach(i => i.classList.remove("input-error"));
}
