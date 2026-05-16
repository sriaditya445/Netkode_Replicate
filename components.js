const headerHTML = `
    <!-- CUSTOM CURSOR -->
    <div class="cursor-dot"></div>
    <div class="cursor-outline"></div>

    <!-- SCROLL INDICATOR / SCROLL TO TOP -->
    <div id="scrollIndicator">
        <svg class="progress-ring" width="52" height="52">
            <circle class="progress-ring__circle" stroke="var(--primary-color)" stroke-width="4" fill="transparent" r="22" cx="26" cy="26" />
        </svg>
        <button id="scrollTopBtn" aria-label="Scroll to top">
            <i class="bi bi-arrow-up-short"></i>
        </button>
    </div>

    <!-- HEADER / NAVBAR -->
    <header id="header" class="glass-header">
        <nav class="container">
            <a href="index.html" class="logo-link">
                <div class="logo"><span class="logo-text-main">Netkode</span><span class="logo-text-primary">Networks</span></div>
            </a>

            <ul class="nav-links" id="navLinks" data-lenis-prevent="true">
                <li><a href="index.html#home">Home</a></li>
                <li><a href="index.html#about">About</a></li>
                
                <!-- SERVICES DROPDOWN -->
                <li class="has-dropdown">
                    <a href="services-strategy.html">
                        Services <i class="bi bi-chevron-down"></i>
                    </a>
                    <ul class="dropdown">
                        <li><a href="services-strategy.html#consulting">Consulting & Assessment</a></li>
                        <li><a href="services-strategy.html#iac">IaC Development & CI/CD</a></li>
                        <li><a href="services-strategy.html#nso">Cisco NSO Service Packs</a></li>
                        <li><a href="services-strategy.html#api">API Automation Frameworks</a></li>
                        <li><a href="services-strategy.html#terraform">Terraform Templates</a></li>
                        <li><a href="services-strategy.html#managed">Managed Automation</a></li>
                    </ul>
                </li>

                <!-- SOLUTIONS DROPDOWN -->
                <li class="has-dropdown">
                    <a href="solutions.html">
                        Solutions <i class="bi bi-chevron-down"></i>
                    </a>
                    <ul class="dropdown">
                        <li><a href="solutions.html#enterprise">Enterprise Networking</a></li>
                        <li><a href="solutions.html#smb">Small Business Networks</a></li>
                        <li><a href="solutions.html#cloud">Cloud Migration</a></li>
                        <li><a href="solutions.html#remote">Secure Remote Access</a></li>
                        <li><a href="solutions.html#iot">IoT Networking</a></li>
                    </ul>
                </li>

                <!-- TECHNOLOGIES DROPDOWN -->
                <li class="has-dropdown">
                    <a href="technologies.html">
                        Technologies <i class="bi bi-chevron-down"></i>
                    </a>
                    <ul class="dropdown">
                        <li><a href="technologies.html#cisco">Cisco</a></li>
                        <li><a href="technologies.html#aws">AWS</a></li>
                        <li><a href="technologies.html#azure">Azure</a></li>
                        <li><a href="technologies.html#linux">Linux</a></li>
                        <li><a href="technologies.html#sdwan">SD-WAN</a></li>
                    </ul>
                </li>

                <li><a href="index.html#contact">Contact</a></li>

                <!-- DARK MODE TOGGLE -->
                <li>
                    <button id="themeToggle" class="theme-toggle" aria-label="Toggle Theme">
                        <i class="bi bi-moon-fill dark-icon"></i>
                        <i class="bi bi-sun-fill light-icon"></i>
                    </button>
                </li>
            </ul>
            <div class="menu-toggle" id="menuToggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    </header>
`;

const footerHTML = `
    <!-- FOOTER -->
    <footer class="footer pt-5 border-top-glass">
        <div class="container pb-4">
            <div class="row g-4 mb-4 text-center text-md-start">
                <div class="col-lg-6">
                    <div class="logo mb-3"><span style="color:var(--text-main)">Netkode</span><span>Networks</span>
                    </div>
                    <p class="text-muted text-sm pe-lg-4 mb-4">Empowering organizations through intelligent network
                        automation and infrastructure as code.</p>
                    <div class="social-links d-flex gap-3 justify-content-center justify-content-md-start">
                        <a href="#" class="social-icon glass-card"><i class="bi bi-linkedin"></i></a>
                        <a href="#" class="social-icon glass-card"><i class="bi bi-github"></i></a>
                        <a href="#" class="social-icon glass-card"><i class="bi bi-twitter-x"></i></a>
                    </div>
                </div>
                <div class="col-lg-2 col-6">
                    <h5 class="footer-heading mb-4">Company</h5>
                    <ul class="footer-links list-unstyled">
                        <li><a href="index.html#about">About</a></li>
                        <li><a href="services-strategy.html">Services</a></li>
                        <li><a href="solutions.html">Solutions</a></li>
                    </ul>
                </div>
                <div class="col-lg-2 col-6">
                    <h5 class="footer-heading mb-4">Focus</h5>
                    <ul class="footer-links list-unstyled">
                        <li><a href="index.html#focus">Focus Areas</a></li>
                        <li><a href="index.html#engagement">Models</a></li>
                        <li><a href="index.html#contact">Contact</a></li>
                    </ul>
                </div>
            </div>

            <div
                class="footer-bottom pt-4 border-top-glass text-center text-md-start d-md-flex justify-content-between align-items-center">
                <p class="text-muted text-sm mb-0">&copy; 2025 Netkode Networks. All rights reserved.</p>
                <div class="footer-legal d-flex gap-3 justify-content-center mt-3 mt-md-0 text-sm">
                    <a href="#" class="text-muted text-decoration-none">Privacy Policy</a>
                    <a href="#" class="text-muted text-decoration-none">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- FLOATING WHATSAPP BUTTON -->
    <a href="https://wa.me/918977774016" target="_blank" class="whatsapp-float pulse" aria-label="Chat on WhatsApp">
        <i class="bi bi-whatsapp"></i>
    </a>
`;

// Inject into placeholders
const headerPlaceholder = document.getElementById('header-placeholder');
const footerPlaceholder = document.getElementById('footer-placeholder');

if (headerPlaceholder) {
    headerPlaceholder.innerHTML = headerHTML;
}

if (footerPlaceholder) {
    footerPlaceholder.innerHTML = footerHTML;
}
