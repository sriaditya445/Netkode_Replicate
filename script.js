document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. LENIS SMOOTH SCROLL
    // ==========================================================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP with Lenis
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);


    // ==========================================================================
    // 2. CUSTOM CURSOR
    // ==========================================================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows exactly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with slight delay
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });
    }

    // ==========================================================================
    // 3. THEME TOGGLE (DARK/LIGHT MODE)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Check local storage or system preference
    const savedTheme = localStorage.getItem('netkode-theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        htmlElement.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('netkode-theme', newTheme);
        });
    }

    // ==========================================================================
    // 4. NAVBAR LOGIC & MOBILE MENU
    // ==========================================================================
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const dropdowns = document.querySelectorAll('.has-dropdown');

    // Sticky header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            // Toggle body scroll
            if (navLinks.classList.contains('active')) {
                document.documentElement.style.overflow = 'hidden';
                document.body.style.overflow = 'hidden';
            } else {
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
            }
        });
    }

    // Close mobile menu on link click (only if it's not a dropdown toggle)
    document.querySelectorAll('.nav-links > li > a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 991) {
                const parentLi = link.parentElement;
                if (!parentLi.classList.contains('has-dropdown')) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.documentElement.style.overflow = '';
                    document.body.style.overflow = '';
                } else {
                    e.preventDefault(); // Prevent navigation on mobile so they can open dropdown
                }
            }
        });
    });

    // Mobile dropdown toggle
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 991) {
                // If they clicked the toggle itself, just toggle active
                // If they clicked a link inside the dropdown, don't stop propagation, let it navigate, but close menu
                if (!e.target.closest('.dropdown')) {
                    dropdown.classList.toggle('active');
                }
            }
        });

        // Close menu when a child link is clicked
        dropdown.querySelectorAll('.dropdown li a').forEach(childLink => {
            childLink.addEventListener('click', () => {
                if (window.innerWidth <= 991) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.documentElement.style.overflow = '';
                    document.body.style.overflow = '';
                }
            });
        });
    });


    // ==========================================================================
    // 5. GSAP ANIMATIONS
    // ==========================================================================
    gsap.registerPlugin(ScrollTrigger);

    // Fade Up Animation
    const revealUps = document.querySelectorAll('.reveal-up');
    revealUps.forEach((elem) => {
        let delay = 0;
        if (elem.classList.contains('delay-1')) delay = 0.2;
        if (elem.classList.contains('delay-2')) delay = 0.4;
        if (elem.classList.contains('delay-3')) delay = 0.6;

        gsap.fromTo(elem,
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: delay,
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Reveal Left Animation
    const revealLefts = document.querySelectorAll('.reveal-left');
    revealLefts.forEach((elem) => {
        gsap.fromTo(elem,
            { x: -50, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Reveal Right Animation
    const revealRights = document.querySelectorAll('.reveal-right');
    revealRights.forEach((elem) => {
        gsap.fromTo(elem,
            { x: 50, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Parallax on Hero Grid
    gsap.to(".hero-grid", {
        y: 100,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Tilt Effect on Service Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });


    // ==========================================================================
    // 6. SWIPER INITIALIZATION (TESTIMONIALS)
    // ==========================================================================
    if (document.querySelector('.testimonial-swiper')) {
        new Swiper('.testimonial-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }

    // ==========================================================================
    // 7. COUNTER ANIMATION
    // ==========================================================================
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            once: true,
            onEnter: () => {
                const target = +counter.getAttribute('data-target');
                const duration = 2; // seconds

                gsap.to(counter, {
                    innerHTML: target,
                    duration: duration,
                    ease: "power2.out",
                    snap: { innerHTML: 1 },
                    onUpdate: function () {
                        counter.innerHTML = Math.ceil(this.targets()[0].innerHTML);
                    }
                });
            }
        });
    });

    // ==========================================================================
    // 8. SCROLL INDICATOR & BACK TO TOP
    // ==========================================================================
    const scrollIndicator = document.getElementById('scrollIndicator');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const circle = document.querySelector('.progress-ring__circle');

    if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;

        window.addEventListener('scroll', () => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            const offset = circumference - scrollPercent * circumference;
            circle.style.strokeDashoffset = offset;

            if (window.scrollY > 300) {
                scrollIndicator.classList.add('show');
            } else {
                scrollIndicator.classList.remove('show');
            }
        });
    }

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            lenis.scrollTo(0, { duration: 1.5 });
        });
    }

    // ==========================================================================
    // 9. ADVANCED FORM VALIDATION & AJAX SUBMIT
    // ==========================================================================
    class FormValidator {
        static sanitizeHTML(str) {
            const temp = document.createElement('div');
            temp.textContent = str;
            return temp.innerHTML;
        }

        static validateName(name) {
            const trimmed = name.trim();
            if (!trimmed) return { valid: false, message: "Name is required." };
            if (trimmed.length < 3) return { valid: false, message: "Name must be at least 3 characters." };
            if (trimmed.length > 50) return { valid: false, message: "Name cannot exceed 50 characters." };
            if (!/^[A-Za-z\s]+$/.test(trimmed)) return { valid: false, message: "Only alphabets and spaces are allowed." };
            return { valid: true, value: trimmed };
        }

        static validateEmail(email) {
            const trimmed = email.trim();
            if (!trimmed) return { valid: false, message: "Email is required." };
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmed)) return { valid: false, message: "Please enter a valid email address." };
            return { valid: true, value: trimmed };
        }

        static validatePhone(phone) {
            // Auto strip spaces
            const stripped = phone.replace(/\s+/g, '');
            if (!stripped) return { valid: false, message: "Phone number is required." };
            if (!/^\d+$/.test(stripped)) return { valid: false, message: "Only numeric digits are allowed." };
            if (stripped.length !== 10) return { valid: false, message: "Phone number must be exactly 10 digits." };
            return { valid: true, value: stripped };
        }

        static validateMessage(message) {
            const trimmed = message.trim();
            if (!trimmed) return { valid: true, value: '' }; // Optional field
            if (trimmed.length < 10) return { valid: false, message: "Message must be at least 10 characters if provided." };
            if (trimmed.length > 500) return { valid: false, message: "Message cannot exceed 500 characters." };
            return { valid: true, value: this.sanitizeHTML(trimmed) };
        }
    }

    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        const inputs = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            message: document.getElementById('message')
        };
        const charCounter = document.querySelector('.char-counter');

        // Debounce utility
        const debounce = (func, delay) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), delay);
            };
        };

        const setFieldState = (field, isValid, message) => {
            const feedback = field.closest('.form-group').querySelector('.invalid-feedback');
            if (isValid) {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
                if (feedback) feedback.textContent = '';
            } else {
                field.classList.remove('is-valid');
                field.classList.add('is-invalid');
                if (feedback) feedback.textContent = message;
            }
            checkFormValidity();
        };

        const checkFormValidity = () => {
            const n = FormValidator.validateName(inputs.name.value);
            const e = FormValidator.validateEmail(inputs.email.value);
            const p = FormValidator.validatePhone(inputs.phone.value);
            const m = FormValidator.validateMessage(inputs.message.value);

            if (n.valid && e.valid && p.valid && m.valid) {
                submitBtn.disabled = false;
            } else {
                submitBtn.disabled = true;
            }
        };

        // Real-time validation
        const validateField = (fieldId) => {
            const val = inputs[fieldId].value;
            let result;
            switch (fieldId) {
                case 'name': result = FormValidator.validateName(val); break;
                case 'email': result = FormValidator.validateEmail(val); break;
                case 'phone':
                    inputs.phone.value = val.replace(/[^\d\s]/g, ''); // strip invalid chars instantly
                    result = FormValidator.validatePhone(inputs.phone.value);
                    break;
                case 'message':
                    if (charCounter) charCounter.textContent = `${val.length}/500`;
                    result = FormValidator.validateMessage(val);
                    break;
            }
            // Only show errors if field isn't empty (unless they blurred it)
            // But we want to show success instantly if valid
            if (result.valid) {
                setFieldState(inputs[fieldId], true, '');
            } else if (val.trim() !== '') {
                setFieldState(inputs[fieldId], false, result.message);
            } else {
                // Clear state if empty (unless submitting)
                inputs[fieldId].classList.remove('is-valid', 'is-invalid');
                checkFormValidity();
            }
        };

        // Attach listeners
        Object.keys(inputs).forEach(key => {
            const el = inputs[key];
            if (!el) return;

            // Debounced input for real-time checking without annoyance
            el.addEventListener('input', debounce(() => validateField(key), 300));

            // Immediate feedback on blur
            el.addEventListener('blur', () => {
                const val = el.value;
                let result;
                if (key === 'name') result = FormValidator.validateName(val);
                if (key === 'email') result = FormValidator.validateEmail(val);
                if (key === 'phone') result = FormValidator.validatePhone(val);
                if (key === 'message') result = FormValidator.validateMessage(val);
                setFieldState(el, result.valid, result.message);
            });
        });

        // Message char counter exact update
        if (inputs.message && charCounter) {
            inputs.message.addEventListener('input', (e) => {
                charCounter.textContent = `${e.target.value.length}/500`;
            });
        }

        // Form Submit
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Final comprehensive check
            const n = FormValidator.validateName(inputs.name.value);
            const em = FormValidator.validateEmail(inputs.email.value);
            const p = FormValidator.validatePhone(inputs.phone.value);
            const m = FormValidator.validateMessage(inputs.message.value);

            setFieldState(inputs.name, n.valid, n.message);
            setFieldState(inputs.email, em.valid, em.message);
            setFieldState(inputs.phone, p.valid, p.message);
            setFieldState(inputs.message, m.valid, m.message);

            if (!n.valid || !em.valid || !p.valid || !m.valid) {
                // Shake form
                contactForm.classList.remove('shake');
                void contactForm.offsetWidth; // trigger reflow
                contactForm.classList.add('shake');

                // Auto-focus first invalid
                const firstInvalid = contactForm.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus({ preventScroll: true });
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            const originalBtnText = submitBtn.innerHTML;

            // Loading State
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';
            submitBtn.disabled = true;
            if (formStatus) formStatus.innerHTML = '';

            try {
                // Prepare sanitized data
                const formData = new FormData();
                formData.append('name', n.value);
                formData.append('email', em.value);
                formData.append('phone', p.value);
                formData.append('message', m.value);
                formData.append('access_key', contactForm.querySelector('input[name="access_key"]').value);
                formData.append('_subject', contactForm.querySelector('input[name="_subject"]').value);

                let isSuccess = false;

                // ATTEMPT 1: PHPMailer (send_mail.php)
                try {
                    const phpResponse = await fetch('send_mail.php', {
                        method: 'POST',
                        body: formData
                    });

                    if (phpResponse.ok) {
                        const phpResult = await phpResponse.json();
                        if (phpResult.status === 'success') {
                            isSuccess = true;
                        } else {
                            throw new Error(phpResult.message || 'PHPMailer failed to send.');
                        }
                    } else {
                        throw new Error('Server error or PHP not supported.');
                    }
                } catch (phpError) {
                    console.warn("PHPMailer failed or not supported by server. Falling back to Web3Forms...");
                }

                // ATTEMPT 2: Fallback to Web3Forms (CURRENTLY COMMENTED OUT AS REQUESTED)

                if (!isSuccess) {
                    const web3Response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        body: formData
                    });

                    const web3Result = await web3Response.json();

                    if (web3Response.status === 200 && web3Result.success) {
                        isSuccess = true;
                    } else {
                        throw new Error(web3Result.message || 'Web3Forms failed to send.');
                    }
                }


                // Handle Final Success
                if (isSuccess) {
                    if (formStatus) formStatus.innerHTML = '<div class="alert alert-success mt-3" role="alert"><i class="bi bi-check-circle-fill me-2"></i> Your message has been sent successfully!</div>';
                    contactForm.reset();
                    Object.values(inputs).forEach(el => el.classList.remove('is-valid'));
                    submitBtn.disabled = true;
                    if (charCounter) charCounter.textContent = '0/500';
                }
            } catch (error) {
                if (formStatus) formStatus.innerHTML = `<div class="alert alert-danger mt-3" role="alert"><i class="bi bi-exclamation-triangle-fill me-2"></i> ${error.message || 'Error submitting form. Please try again.'}</div>`;
            } finally {
                // Restore button
                submitBtn.innerHTML = originalBtnText;
                // Leave disabled if reset, otherwise enable if valid
                checkFormValidity();
            }
        });
    }





});
