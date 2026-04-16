/* ================================================================
   EXPÉRIENCE ESTHÉTIQUE J.F.W — script.js
   Premium Mobile Car Detailing Website

   TABLE OF CONTENTS:
   1.  DOMContentLoaded — Initialize everything
   2.  Sticky Navbar — Scroll-based style changes
   3.  Mobile Menu — Toggle hamburger menu
   4.  Smooth Scrolling — Internal anchor links
   5.  Active Nav Link — Highlight on scroll
   6.  Scroll Reveal — Intersection Observer animations
   7.  Loyalty Progress Bar — Animated on entry
   8.  Footer Year — Dynamic copyright year
   ================================================================ */


/* ================================================================
   1. DOMContentLoaded — Entry point: run after DOM is loaded
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initStickyNavbar();
    initMobileMenu();
    initSmoothScrolling();
    initActiveNavLinks();
    initScrollReveal();
    initLoyaltyProgressBar();
    setFooterYear();
    initLogoTransparency();
    initFoamCannon();
    initCardVideos();
    initReviewBubbles();
    initServiceMap();
});


/* ================================================================
   2. STICKY NAVBAR
   Adds .scrolled class when page is scrolled past 20px.
   This triggers the opaque background via CSS.
   ================================================================ */
function initStickyNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const SCROLL_THRESHOLD = 20;

    function handleNavbarScroll() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Run on load in case page starts scrolled
    handleNavbarScroll();

    // Use passive listener for performance
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
}


/* ================================================================
   3. MOBILE MENU
   Toggles the mobile dropdown menu open/closed.
   Also closes when a link is clicked or user presses Escape.
   ================================================================ */
function initMobileMenu() {
    const toggle    = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-book-btn');

    if (!toggle || !mobileMenu) return;

    // Toggle open/close
    toggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('open');

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when any mobile link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const navbar = document.getElementById('navbar');
        if (navbar && !navbar.contains(e.target)) {
            closeMobileMenu();
        }
    });

    function openMobileMenu() {
        mobileMenu.classList.add('open');
        toggle.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent scroll while menu open
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scroll
    }
}


/* ================================================================
   4. SMOOTH SCROLLING
   Handles all internal anchor links (href="#section").
   Accounts for the sticky navbar height so sections aren't hidden.
   ================================================================ */
function initSmoothScrolling() {
    const NAVBAR_HEIGHT = 80; // px — matches .navbar height

    // Select all anchor links that point to an ID on the page
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');

            // Skip empty or just "#" links
            if (!targetId || targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            e.preventDefault();

            // Calculate scroll position accounting for sticky nav
            const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;

            window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
        });
    });
}


/* ================================================================
   5. ACTIVE NAV LINK HIGHLIGHTING
   Uses IntersectionObserver to detect which section is currently
   in view, then highlights the matching nav link.
   ================================================================ */
function initActiveNavLinks() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    if (!navLinks.length || !sections.length) return;

    // Build a map: sectionId → navLink element
    const linkMap = {};
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            linkMap[href.slice(1)] = link;
        }
    });

    function setActive(id) {
        // Remove active from all
        navLinks.forEach(l => l.classList.remove('active'));
        // Set active on matching link
        if (linkMap[id]) {
            linkMap[id].classList.add('active');
        }
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        },
        {
            // Section is "active" when it occupies the upper portion of the viewport
            rootMargin: '-10% 0px -80% 0px',
            threshold: 0
        }
    );

    sections.forEach(section => observer.observe(section));
}


/* ================================================================
   6. SCROLL REVEAL ANIMATIONS
   Elements with class .scroll-reveal animate in when they enter
   the viewport. Respects data-delay attribute for stagger effects.

   Usage in HTML:
     <div class="scroll-reveal" data-delay="200">...</div>

   The CSS handles the actual animation via .is-visible class.
   ================================================================ */
function initScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseInt(el.getAttribute('data-delay') || '0', 10);

                    // Apply delay via inline style for precise control
                    setTimeout(() => {
                        el.classList.add('is-visible');
                    }, delay);

                    // Once animated in, no need to observe anymore
                    observer.unobserve(el);
                }
            });
        },
        {
            threshold: 0.1,        // Trigger when 10% of element is visible
            rootMargin: '0px 0px -40px 0px' // Slight bottom offset for better timing
        }
    );

    elements.forEach(el => observer.observe(el));
}


/* ================================================================
   7. LOYALTY PROGRESS BAR ANIMATION
   Animates the progress bar in the Loyalty section when it enters
   the viewport. Target width: 49% (representing 740/1500 pts).
   ================================================================ */
function initLoyaltyProgressBar() {
    const progressFill = document.getElementById('loyaltyProgress');
    if (!progressFill) return;

    const TARGET_WIDTH = 49; // percentage — matches 740/1500 pts example

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Small delay before animating for visual polish
                    setTimeout(() => {
                        progressFill.style.width = TARGET_WIDTH + '%';
                    }, 400);

                    // Only animate once
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    observer.observe(progressFill.closest('.loyalty-demo') || progressFill);
}


/* ================================================================
   8. FOOTER YEAR
   Automatically updates the copyright year — no manual edits needed.
   ================================================================ */
function setFooterYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}


/* ================================================================
   8. BUTTON RIPPLE EFFECT (water drop click animation)
   Attaches to every element with class .ripple-btn.
   On click, injects a temporary ripple circle at the click point.
   ================================================================ */
function initRippleEffect() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.ripple-btn');
        if (!btn) return;

        // Create ripple element
        const ripple = document.createElement('span');
        ripple.className = 'ripple-circle';

        // Size the ripple to cover the button
        const size = Math.max(btn.offsetWidth, btn.offsetHeight);
        ripple.style.width  = size + 'px';
        ripple.style.height = size + 'px';

        // Position at click point, centred
        const rect = btn.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';

        btn.appendChild(ripple);

        // Remove after animation completes
        ripple.addEventListener('animationend', () => ripple.remove());
    });
}

/* Call ripple init — already inside DOMContentLoaded via the main init */
document.addEventListener('DOMContentLoaded', initRippleEffect);

/* ================================================================
   SECURITY UTILITIES
   ================================================================ */

/* Whitelist: maps local filename keys → YouTube embed URLs */
const ALLOWED_VIDEOS = new Map([
    ['headlights.mp4',              'https://www.youtube.com/embed/a381RRhpNh8?autoplay=1'],
    ['0412.mp4',                    'https://www.youtube.com/embed/TwO3yFJCNXw?autoplay=1'],
    ['iron decontamination .mp4',   'https://www.youtube.com/embed/GOc_DmH898s?autoplay=1'],
    ['engine bay file.mp4',         'https://www.youtube.com/embed/HUkhb2afToA?autoplay=1'],
    ['lexperienceeee.mp4',          'https://www.youtube.com/embed/gpekWlNlJB8?autoplay=1'],
    ['standard package.mov',        'https://www.youtube.com/embed/C6_ummklYyA?autoplay=1'],
]);

/**
 * Sanitize a plain-text field value:
 *  - Strips newline/carriage-return characters (prevents body injection in mailto)
 *  - Trims whitespace
 *  - Enforces a max character length
 */
function sanitizeField(value, maxLen = 200) {
    return String(value)
        .replace(/[\r\n\t]/g, ' ')   // no control characters
        .replace(/\s{2,}/g, ' ')     // collapse multiple spaces
        .trim()
        .slice(0, maxLen);
}

/**
 * Basic email format check. Not exhaustive — just blocks obvious garbage.
 * RFC 5321 max length is 254 chars.
 */
function isValidEmail(email) {
    return /^[^\s@]{1,64}@[^\s@]{1,255}$/.test(email) && email.length <= 254;
}

/* ================================================================
   VIDEO RESULTS MODAL
   ================================================================ */
function openVideoModal(src) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('modalVideo');
    if (!modal || !iframe) return;
    /* Security: only allow whitelisted YouTube embed URLs */
    const embedUrl = ALLOWED_VIDEOS.get(src);
    if (!embedUrl) {
        console.warn('openVideoModal: blocked non-whitelisted src:', src);
        return;
    }
    iframe.src = embedUrl;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal(e) {
    // If called from backdrop click, only close when clicking outside the box
    if (e && e.target !== document.getElementById('videoModal')) return;
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('modalVideo');
    if (!modal || !iframe) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    iframe.src = ''; // stops YouTube playback immediately
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
});


/* ================================================================
   SPIN WHEEL — CLIENT PROGRAM
   ================================================================ */
(function () {
    const SEGMENTS = [
        { label: '10% Off',      reward: '10% off your first service',                isTryAgain: false },
        { label: '15% Off',      reward: '15% off your first service',                isTryAgain: false },
        { label: 'Try Again',    reward: null,                                         isTryAgain: true  },
        { label: '20% Off',      reward: '20% off your first service',                isTryAgain: false },
        { label: '30% Ceramic',  reward: 'Up to 30% off your first ceramic coating',  isTryAgain: false },
        { label: '15% Off',      reward: '15% off your first service',                isTryAgain: false },
    ];

    // Segment colors — dark blues/navy palette, no garish hues
    const COLORS = ['#0e2244', '#0d2a52', '#1c2438', '#0a2040', '#1b1608', '#162442'];
    const NUM    = SEGMENTS.length;
    const ARC    = (2 * Math.PI) / NUM;

    let rotation   = 0;
    let spinning   = false;
    let usedRetry  = false; // try-again retry used

    /* ---- Draw wheel ---- */
    function drawWheel(rot) {
        const canvas = document.getElementById('spinWheel');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        const cx = W / 2, cy = H / 2, r = cx - 6;

        ctx.clearRect(0, 0, W, H);

        SEGMENTS.forEach((seg, i) => {
            const start = rot - Math.PI / 2 + i * ARC;
            const end   = start + ARC;

            // Segment fill
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, start, end);
            ctx.closePath();
            ctx.fillStyle = COLORS[i];
            ctx.fill();

            // Subtle divider line
            ctx.strokeStyle = 'rgba(255,255,255,0.07)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Label text
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(start + ARC / 2);
            ctx.textAlign    = 'right';
            ctx.fillStyle    = seg.isTryAgain ? 'rgba(255,255,255,0.45)' : '#ffffff';
            const fontSize   = seg.label.length > 7 ? 10 : 12;
            ctx.font         = `600 ${fontSize}px Inter, sans-serif`;
            ctx.fillText(seg.label, r - 10, 4);
            ctx.restore();
        });

        // Center cap
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
        grad.addColorStop(0, '#1e2f55');
        grad.addColorStop(1, '#070a14');
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
        ctx.fillStyle   = grad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth   = 1.5;
        ctx.stroke();
    }

    /* ---- Winner calculation ---- */
    function getWinner(rot) {
        const twoPI       = 2 * Math.PI;
        const pointerAngle = ((-rot % twoPI) + twoPI) % twoPI;
        return SEGMENTS[Math.floor(pointerAngle / ARC) % NUM];
    }

    /* ---- Ease-out quartic ---- */
    function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

    /* ---- Run the spin animation ---- */
    function doSpin() {
        if (spinning) return;
        spinning = true;

        const btn = document.getElementById('spinBtn');
        if (btn) btn.disabled = true;

        const totalAngle = (4 + Math.random() * 2) * 2 * Math.PI + Math.random() * 2 * Math.PI;
        const startRot   = rotation;
        const duration   = 3600;
        const startTime  = performance.now();

        function animate(now) {
            const t  = Math.min((now - startTime) / duration, 1);
            rotation = startRot + easeOut(t) * totalAngle;
            drawWheel(rotation);

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                spinning = false;
                showResult(getWinner(rotation));
            }
        }
        requestAnimationFrame(animate);
    }

    /* ---- Show result panel ---- */
    function showResult(seg) {
        const panel      = document.getElementById('spinResult');
        const titleEl    = document.getElementById('resultTitle');
        const subEl      = document.getElementById('resultSub');
        const tryWrap    = document.getElementById('tryAgainWrap');
        const formWrap   = document.getElementById('formWrap');
        if (!panel) return;

        // If "Try Again" and haven't used the retry yet → give one more spin
        if (seg.isTryAgain && !usedRetry) {
            usedRetry    = true;
            titleEl.textContent = 'Try Again!';
            subEl.textContent   = 'Spin one more time to unlock your welcome offer.';
            if (tryWrap)  tryWrap.style.display  = 'block';
            if (formWrap) formWrap.style.display = 'none';
        } else {
            // If second "Try Again" → default to 10% Off
            const reward = seg.isTryAgain ? SEGMENTS[0].reward : seg.reward;
            titleEl.textContent = 'You\'ve unlocked: ' + reward + '!';
            subEl.textContent   = 'Complete the form below to claim your offer. We\'ll confirm by email within 24 hours.';
            if (tryWrap)  tryWrap.style.display  = 'none';
            if (formWrap) formWrap.style.display = 'block';
            const hiddenReward = document.getElementById('rewardValue');
            if (hiddenReward) hiddenReward.value = reward;
        }

        panel.style.display = 'block';
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /* ---- Init on DOM ready ---- */
    document.addEventListener('DOMContentLoaded', function () {
        drawWheel(rotation);

        const spinBtn = document.getElementById('spinBtn');
        if (spinBtn) spinBtn.addEventListener('click', doSpin);

        const tryAgainBtn = document.getElementById('tryAgainBtn');
        if (tryAgainBtn) tryAgainBtn.addEventListener('click', function () {
            document.getElementById('spinResult').style.display = 'none';
            const spinBtn2 = document.getElementById('spinBtn');
            if (spinBtn2) spinBtn2.disabled = false;
            doSpin();
        });

        /* ── Individual lead form → mailto ── */
        const leadForm = document.getElementById('leadForm');
        let leadFormSubmitted = false; /* rate-limit: one submission per page load */

        if (leadForm) leadForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (leadFormSubmitted) return; /* prevent double/spam submit */

            /* Sanitize every field — strips newlines, limits length */
            const name     = sanitizeField(document.getElementById('leadName').value, 100);
            const email    = sanitizeField(document.getElementById('leadEmail').value, 254);
            const phone    = sanitizeField(document.getElementById('leadPhone').value, 20) || 'Not provided';
            const vehicle  = sanitizeField(document.getElementById('leadVehicle').value, 100);
            const checked  = document.querySelector('input[name="interest"]:checked');
            const interest = checked ? sanitizeField(checked.value, 60) : 'Not selected';

            /* Validate required fields + email format */
            if (!name || !vehicle) return;
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            /* Security: validate reward against the actual segment list, not the DOM field */
            const validRewards = SEGMENTS
                .filter(s => !s.isTryAgain && s.reward)
                .map(s => s.reward);
            const rawReward = document.getElementById('rewardValue').value;
            const reward    = validRewards.includes(rawReward) ? rawReward : validRewards[0];

            leadFormSubmitted = true;
            const submitBtn = leadForm.querySelector('[type="submit"]');
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

            const subject = encodeURIComponent('New Client / Contract Request - Expérience Esthétique J.F.W');
            const body    = encodeURIComponent(
                'NEW INDIVIDUAL CLIENT REQUEST\n' +
                '================================\n\n' +
                'Client Type: Individual\n' +
                'Reward Won:  ' + reward + '\n\n' +
                'Name:        ' + name    + '\n' +
                'Email:       ' + email   + '\n' +
                'Phone:       ' + phone   + '\n' +
                'Vehicle:     ' + vehicle + '\n' +
                'Interest:    ' + interest + '\n\n' +
                'Sent from the website Rewards / Client Program section.'
            );

            window.location.href = 'mailto:laveautojw@gmail.com?subject=' + subject + '&body=' + body;
        });

        /* ── Audience toggle — Individual / Business ── */
        const btnInd  = document.getElementById('btnIndividual');
        const btnBiz  = document.getElementById('btnBusiness');
        const panelInd = document.getElementById('panelIndividual');
        const panelBiz = document.getElementById('panelBusiness');

        function switchAudience(show) {
            const isInd = show === 'individual';
            if (btnInd)   { btnInd.classList.toggle('aud-btn--active', isInd);  btnInd.setAttribute('aria-pressed', isInd); }
            if (btnBiz)   { btnBiz.classList.toggle('aud-btn--active', !isInd); btnBiz.setAttribute('aria-pressed', !isInd); }
            if (panelInd) panelInd.style.display = isInd ? 'block' : 'none';
            if (panelBiz) panelBiz.style.display = isInd ? 'none'  : 'block';
        }

        if (btnInd) btnInd.addEventListener('click', function () { switchAudience('individual'); });
        if (btnBiz) btnBiz.addEventListener('click', function () { switchAudience('business'); });

        /* ── Business: "Request a Commercial Quote" shows the form ── */
        const bizFormBtn = document.getElementById('bizFormBtn');
        const bizResult  = document.getElementById('bizResult');
        if (bizFormBtn && bizResult) {
            bizFormBtn.addEventListener('click', function () {
                bizResult.style.display = 'block';
                bizResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        }

        /* ── Business lead form → mailto ── */
        const bizLeadForm = document.getElementById('bizLeadForm');
        let bizFormSubmitted = false; /* rate-limit: one submission per page load */

        if (bizLeadForm) bizLeadForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (bizFormSubmitted) return;

            /* Sanitize every field */
            const name    = sanitizeField(document.getElementById('bizName').value, 100);
            const email   = sanitizeField(document.getElementById('bizEmail').value, 254);
            const phone   = sanitizeField(document.getElementById('bizPhone').value, 20)   || 'Not provided';
            const company = sanitizeField(document.getElementById('bizCompany').value, 150);
            const fleet   = sanitizeField(document.getElementById('bizFleet').value, 150);
            const checked = document.querySelector('input[name="bizInterest"]:checked');
            const interest = checked ? sanitizeField(checked.value, 60) : 'Not selected';

            /* Validate required fields + email format */
            if (!name || !company || !fleet) return;
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            bizFormSubmitted = true;
            const submitBtn = bizLeadForm.querySelector('[type="submit"]');
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

            const subject = encodeURIComponent('New Client / Contract Request - Expérience Esthétique J.F.W');
            const body    = encodeURIComponent(
                'NEW COMMERCIAL / FLEET REQUEST\n' +
                '================================\n\n' +
                'Client Type:  Business / Fleet\n\n' +
                'Contact Name: ' + name    + '\n' +
                'Email:        ' + email   + '\n' +
                'Phone:        ' + phone   + '\n' +
                'Company:      ' + company + '\n' +
                'Fleet Size:   ' + fleet   + '\n' +
                'Interest:     ' + interest + '\n\n' +
                'Sent from the website Rewards / Client Program section.'
            );

            window.location.href = 'mailto:laveautojw@gmail.com?subject=' + subject + '&body=' + body;
        });
    });
})();


/* ================================================================
   ADDITIONAL UX POLISH
   Small quality-of-life improvements for a premium feel.
   ================================================================ */

// Prevent flash of content before fonts load
document.documentElement.classList.add('fonts-loading');

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
        document.documentElement.classList.remove('fonts-loading');
        document.documentElement.classList.add('fonts-loaded');
    });
}

// Add touch device detection for CSS enhancements
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.documentElement.classList.add('touch-device');
}

/* ================================================================
   9. LOGO TRANSPARENCY
   Removes white/light background from logo.png using canvas flood-fill.
   Works when served over HTTP (same-origin). Falls back to CSS
   mix-blend-mode: screen on file:// protocol or CORS errors.
   ================================================================ */
function initLogoTransparency() {
    const logoImgs = document.querySelectorAll('.hero-logo-img, .nav-logo-img, .footer-logo-img');
    if (!logoImgs.length) return;

    const offscreen = document.createElement('canvas');
    const ctx       = offscreen.getContext('2d');
    const img       = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = function () {
        offscreen.width  = img.naturalWidth;
        offscreen.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        try {
            const id = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
            _floodRemoveBg(id, offscreen.width, offscreen.height);
            ctx.putImageData(id, 0, 0);

            const dataURL = offscreen.toDataURL('image/png');
            logoImgs.forEach(el => {
                el.src = dataURL;
                el.style.mixBlendMode = 'normal'; // bg is transparent — no blend needed
            });
        } catch (e) {
            // file:// CORS restriction — CSS mix-blend-mode: screen acts as fallback
        }
    };

    img.src = 'logo.png';
}

/* Flood-fill from all 4 edges, removing white-ish background pixels */
function _floodRemoveBg(imageData, W, H) {
    const px        = imageData.data;
    const visited   = new Uint8Array(W * H);
    const toRemove  = new Uint8Array(W * H);
    const THRESHOLD = 65; // color distance from white — raise if bg not fully removed

    function colorDist(i) {
        const r = px[i], g = px[i + 1], b = px[i + 2];
        return Math.sqrt((r - 255) ** 2 + (g - 255) ** 2 + (b - 255) ** 2);
    }

    function flood(sx, sy) {
        const stack = [sy * W + sx];
        while (stack.length) {
            const idx = stack.pop();
            if (visited[idx]) continue;
            visited[idx] = 1;
            if (colorDist(idx * 4) > THRESHOLD) continue;
            toRemove[idx] = 1;
            const x = idx % W, y = (idx / W) | 0;
            if (x > 0)     stack.push(idx - 1);
            if (x < W - 1) stack.push(idx + 1);
            if (y > 0)     stack.push(idx - W);
            if (y < H - 1) stack.push(idx + W);
        }
    }

    for (let x = 0; x < W; x++) { flood(x, 0); flood(x, H - 1); }
    for (let y = 1; y < H - 1; y++) { flood(0, y); flood(W - 1, y); }

    for (let i = 0; i < W * H; i++) {
        if (toRemove[i]) px[i * 4 + 3] = 0;
    }
}

/* ================================================================
   10. WATER CANNON CURSOR
   Mouse becomes a pressure-washer cannon scoped to the logo.
   A constant high-pressure water stream shoots from the nozzle
   toward the logo centre whenever the cursor is over the logo.
   ================================================================ */
function initFoamCannon() {
    const logoWrap = document.querySelector('.hero-logo');
    if (!logoWrap) return;

    /* ── Canvas overlay scoped to logo element only ──────────────── */
    const cv = document.createElement('canvas');
    cv.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;';
    logoWrap.appendChild(cv);
    const ctx = cv.getContext('2d');

    let W, H;
    function resize() {
        W = cv.width  = logoWrap.offsetWidth;
        H = cv.height = logoWrap.offsetHeight;
    }
    resize();
    new ResizeObserver(resize).observe(logoWrap);

    /* ── Mouse tracking (logo-relative coords) ───────────────────── */
    let mx = -999, my = -999;
    let cannonAngle  = 0;
    let cursorHidden = false;

    function isOverLogo() {
        return mx >= 0 && mx <= W && my >= 0 && my <= H;
    }

    document.addEventListener('mousemove', e => {
        const r = logoWrap.getBoundingClientRect();
        mx = e.clientX - r.left;
        my = e.clientY - r.top;

        if (isOverLogo()) {
            if (!cursorHidden) { document.body.style.cursor = 'none'; cursorHidden = true; }
        } else {
            if (cursorHidden) { document.body.style.cursor = ''; cursorHidden = false; }
        }
    });

    /* ── Water drop — a single particle in the stream ────────────── */
    let drops = [];

    class Drop {
        constructor(ox, oy, angle) {
            /* tiny jitter around the nozzle exit */
            const jitter = 2.5;
            this.x  = ox + (Math.random() - 0.5) * jitter;
            this.y  = oy + (Math.random() - 0.5) * jitter;

            /* tight stream: small angular spread + random speed variance */
            const spread  = 0.08 + Math.random() * 0.06;   // ±2–4°
            const a       = angle + (Math.random() - 0.5) * spread;
            const spd     = 10 + Math.random() * 6;
            this.vx = Math.cos(a) * spd;
            this.vy = Math.sin(a) * spd;

            /* visual */
            this.r    = 0.8 + Math.random() * 1.4;          // tiny droplet radius
            this.life = 1;
            this.decay= 0.028 + Math.random() * 0.022;      // fades fast
            this.alpha= 0.55 + Math.random() * 0.4;
        }

        update() {
            this.vy += 0.12;          // gravity curves the stream naturally
            this.vx *= 0.995;
            this.x  += this.vx;
            this.y  += this.vy;
            this.life -= this.decay;
        }

        /* draw as a short elongated streak in the direction of travel */
        draw() {
            if (this.life <= 0) return;
            const alpha = this.life * this.alpha;
            const len   = Math.hypot(this.vx, this.vy) * 0.55;  // streak length
            const ang   = Math.atan2(this.vy, this.vx);

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = `rgba(${140 + Math.random() * 60}, 210, 255, 1)`;
            ctx.lineWidth   = this.r * 2;
            ctx.lineCap     = 'round';

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x - Math.cos(ang) * len,
                this.y - Math.sin(ang) * len
            );
            ctx.stroke();
            ctx.restore();
        }

        get dead() { return this.life <= 0 || this.x < -20 || this.x > W + 20 || this.y > H + 20; }
    }

    /* ── Nozzle tip: origin IS the tip, water exits at x=+7 ─────── */
    function nozzleTip(cx, cy, angle) {
        return {
            x: cx + Math.cos(angle) * 7,
            y: cy + Math.sin(angle) * 7
        };
    }

    /* ── Spawn a continuous burst of drops every frame ───────────── */
    function spawnDrops(cx, cy, angle) {
        const tip = nozzleTip(cx, cy, angle);
        /* 8–12 drops per frame = dense, pressurised-looking stream */
        const count = 8 + Math.floor(Math.random() * 5);
        for (let i = 0; i < count; i++) {
            drops.push(new Drop(tip.x, tip.y, angle));
        }
        /* safety cap */
        if (drops.length > 800) drops.splice(0, drops.length - 800);
    }

    /* ── Realistic foam cannon drawn at cursor ───────────────────── */
    function drawCannon(x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        /* origin = nozzle tip; cannon body extends left (negative x) */

        /* helper: linear gradient along x-axis */
        function metalGrad(x1, y1, x2, y2, light, mid, dark) {
            const g = ctx.createLinearGradient(x1, y1, x2, y2);
            g.addColorStop(0,   light);
            g.addColorStop(0.45, mid);
            g.addColorStop(1,   dark);
            return g;
        }

        /* ── 1. Adjustable nozzle head (front, at origin) ────────── */
        /* outer ring */
        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = metalGrad(0, -10, 0, 10, '#c8d8e8', '#8aaabb', '#4a6070');
        ctx.fill();
        ctx.strokeStyle = '#334455';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        /* inner orifice */
        ctx.beginPath();
        ctx.ellipse(0, 0, 3.5, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1a2a35';
        ctx.fill();
        /* knurling lines on nozzle */
        ctx.strokeStyle = 'rgba(80,110,130,0.7)';
        ctx.lineWidth = 0.6;
        for (let i = -3; i <= 3; i++) {
            ctx.beginPath();
            ctx.moveTo(-3, i * 2.8);
            ctx.lineTo( 3, i * 2.8);
            ctx.stroke();
        }

        /* ── 2. Lance / wand — stainless tube ────────────────────── */
        /* main tube */
        const lanceStart = -10, lanceEnd = -80;
        ctx.beginPath();
        ctx.rect(lanceEnd, -4, Math.abs(lanceEnd - lanceStart), 8);
        ctx.fillStyle = metalGrad(0, -4, 0, 4, '#ddeeff', '#9ab8cc', '#5a7888');
        ctx.fill();
        /* top highlight stripe */
        ctx.beginPath();
        ctx.rect(lanceEnd, -4, Math.abs(lanceEnd - lanceStart), 2.5);
        ctx.fillStyle = 'rgba(255,255,255,0.22)';
        ctx.fill();
        /* bottom shadow stripe */
        ctx.beginPath();
        ctx.rect(lanceEnd, 2.5, Math.abs(lanceEnd - lanceStart), 1.5);
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fill();

        /* ── 3. Nozzle-to-lance coupler collar ───────────────────── */
        ctx.beginPath();
        ctx.rect(-10, -6, 12, 12);
        ctx.fillStyle = metalGrad(-10, -6, -10, 6, '#b0c8d8', '#7090a0', '#3a5060');
        ctx.fill();
        ctx.strokeStyle = '#334455';
        ctx.lineWidth = 0.7;
        ctx.stroke();

        /* ── 4. Reservoir bottle (hangs below lance at ~-45) ─────── */
        const bx = -45, bTopY = 5, bH = 34, bW = 18;
        /* bottle body — translucent plastic with soap tint */
        const bottleGrad = ctx.createLinearGradient(bx - bW/2, 0, bx + bW/2, 0);
        bottleGrad.addColorStop(0,    'rgba(200,230,255,0.18)');
        bottleGrad.addColorStop(0.3,  'rgba(220,240,255,0.55)');
        bottleGrad.addColorStop(0.65, 'rgba(180,215,245,0.45)');
        bottleGrad.addColorStop(1,    'rgba(140,190,220,0.25)');

        ctx.beginPath();
        ctx.roundRect(bx - bW/2, bTopY, bW, bH, [3, 3, 6, 6]);
        ctx.fillStyle = bottleGrad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(120,180,220,0.7)';
        ctx.lineWidth = 0.9;
        ctx.stroke();

        /* soap liquid fill inside bottle */
        const liquidH = bH * 0.65;
        const liqGrad = ctx.createLinearGradient(bx - bW/2 + 2, 0, bx + bW/2 - 2, 0);
        liqGrad.addColorStop(0,   'rgba(160,210,240,0.55)');
        liqGrad.addColorStop(0.5, 'rgba(190,225,250,0.75)');
        liqGrad.addColorStop(1,   'rgba(140,200,230,0.45)');
        ctx.beginPath();
        ctx.roundRect(bx - bW/2 + 2, bTopY + (bH - liquidH) - 2, bW - 4, liquidH, [0, 0, 4, 4]);
        ctx.fillStyle = liqGrad;
        ctx.fill();

        /* bottle label strip */
        ctx.beginPath();
        ctx.rect(bx - bW/2 + 2, bTopY + 8, bW - 4, 10);
        ctx.fillStyle = 'rgba(37,99,235,0.35)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(37,99,235,0.6)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        /* bottle highlight (left edge glint) */
        ctx.beginPath();
        ctx.rect(bx - bW/2 + 2, bTopY + 2, 2.5, bH - 6);
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fill();

        /* bottle neck / mount collar connecting to lance */
        ctx.beginPath();
        ctx.rect(bx - 6, bTopY - 5, 12, 7);
        ctx.fillStyle = metalGrad(bx - 6, 0, bx + 6, 0, '#aabccc', '#6a8898', '#334455');
        ctx.fill();
        ctx.strokeStyle = '#223344';
        ctx.lineWidth = 0.7;
        ctx.stroke();

        /* ── 5. Adjustment dial on bottle neck ───────────────────── */
        ctx.beginPath();
        ctx.ellipse(bx - 20, 0, 5, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = metalGrad(bx - 25, -5, bx - 15, 5, '#c0d0de', '#7090a4', '#3a5060');
        ctx.fill();
        ctx.strokeStyle = '#334455';
        ctx.lineWidth = 0.6;
        ctx.stroke();
        /* dial notch */
        ctx.beginPath();
        ctx.moveTo(bx - 20, -5); ctx.lineTo(bx - 20, -2);
        ctx.strokeStyle = '#223344';
        ctx.lineWidth = 1;
        ctx.stroke();

        /* ── 6. Quick-connect fitting (back end of lance) ─────────── */
        ctx.beginPath();
        ctx.rect(lanceEnd - 10, -6, 12, 12);
        ctx.fillStyle = metalGrad(lanceEnd - 10, -6, lanceEnd - 10, 6, '#c0c8d0', '#788898', '#3a4850');
        ctx.fill();
        ctx.strokeStyle = '#223344';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        /* QC ring grooves */
        ctx.strokeStyle = 'rgba(60,80,100,0.55)';
        ctx.lineWidth = 0.6;
        [lanceEnd - 4, lanceEnd - 7].forEach(gx => {
            ctx.beginPath();
            ctx.moveTo(gx, -6); ctx.lineTo(gx, 6);
            ctx.stroke();
        });
        /* hose stub */
        ctx.beginPath();
        ctx.rect(lanceEnd - 18, -3, 10, 6);
        ctx.fillStyle = '#223344';
        ctx.fill();

        /* ── 7. Nozzle spray shimmer (always visible) ─────────────── */
        ctx.strokeStyle = 'rgba(180,230,255,0.5)';
        ctx.lineWidth   = 1;
        [-6, -3, 0, 3, 6].forEach(off => {
            ctx.beginPath();
            ctx.moveTo(7, off * 0.45);
            ctx.lineTo(16, off);
            ctx.stroke();
        });

        ctx.restore();
    }

    /* ── Render loop ─────────────────────────────────────────────── */
    function tick() {
        ctx.clearRect(0, 0, W, H);

        const over = isOverLogo();

        if (over) {
            /* keep cannon aimed at logo centre */
            cannonAngle = Math.atan2(H * 0.5 - my, W * 0.5 - mx);

            /* emit constant water stream */
            spawnDrops(mx, my, cannonAngle);

            drawCannon(mx, my, cannonAngle);
        }

        /* update & draw all drops */
        drops.forEach(d => { d.update(); d.draw(); });
        drops = drops.filter(d => !d.dead);

        requestAnimationFrame(tick);
    }

    tick();
}

/* ================================================================
   11. SHOWCASE VIDEOS
   Marks videos as loaded so the placeholder ::before is hidden.
   Drop your 10–20s MP4 files into the /videos/ folder.
   ================================================================ */
function initCardVideos() {
    document.querySelectorAll('.showcase-video-slot video').forEach(vid => {
        vid.addEventListener('loadeddata', () => {
            vid.setAttribute('data-loaded', '');
        });
    });
}

/* ================================================================
   12. REVIEW BUBBLES
   Floating speech-bubble reviews that pop in at random positions,
   float gently, then burst and disappear before the next spawns.
   ================================================================ */
function initReviewBubbles() {
    const arena = document.getElementById('reviewBubblesArena');
    if (!arena) return;

    const reviews = [
        { text: "Service impeccable! J'ai fait laver mon véhicule par J&W et je suis extrêmement satisfait du résultat. L'équipe est professionnelle, ponctuelle et très minutieuse. Mon auto n'a jamais été aussi propre, à l'intérieur comme à l'extérieur elle avait littéralement l'air sortie du concessionnaire!", author: "Avis Google" },
        { text: "Ils sont très gentils et professionnels. Ils prennent leur temps pour bien faire leur travail. Le résultat est très satisfaisant. Nos 2 voitures sont comme neuves. Je vous recommande fortement.", author: "Avis Google" },
        { text: "Le travail est bien fait, Excellent service, très professionnel. Ma voiture est impeccable, en plus elle sent hyper bon. À recommander sans hésitation. Merci encore", author: "Avis Google" },
        { text: "Très beau travail, ils ont ciré l'extérieur de ma voiture et elle est impeccable.", author: "Avis Google" },
        { text: "5 star service! My car look brand new with a beautiful finish and smell. Thank you for the easy service.", author: "Google Review" },
        { text: "Un service impeccable, le personnel courtois. Je recommande ses services sans hésitation. Mon auto est remise à neuf et sent si bon.", author: "Avis Google" },
        { text: "Un service exceptionnel. Ils ont dépassé toutes nos attentes. Je n'ai jamais vu quelqu'un d'aussi dévoué à la qualité que cette équipe. Nous ferons à nouveau appel à eux l'année prochaine.", author: "Avis Google" },
        { text: "Meilleurs service de lavage de voiture personnalisés en ville! Et moins cher que vous ne l'imaginez en plus! Ca fait un super cadeau à offrir. Et on n'a pas eu à se déplacer. Le résultat est parfait. Merci beaucoup!", author: "Avis Google" },
        { text: "Excellent service, tres professionnel. Voiture impeccable. A recommander sans hesitation. Merci.", author: "Avis Google" },
        { text: "An excellent job. Really put the time in and the car looks new. Plus the convenience of coming to my house to do it. Top notch.", author: "Google Review" },
        { text: "Super service. Très minutieux. Travail de qualité à domicile. Prix très compétitif.", author: "Avis Google" },
        { text: "Très bon service à la clientèle, ponctuel et professionnel.", author: "Avis Google" },
    ];

    let activeCount = 0;
    const MAX_ACTIVE = 3;

    /* Track active bubble rects to prevent overlap */
    const activeBubbles = [];

    function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh, pad = 20) {
        return ax < bx + bw + pad &&
               ax + aw + pad > bx &&
               ay < by + bh + pad &&
               ay + ah + pad > by;
    }

    function tryPosition(bubbleW, bubbleH, arenaW, arenaH) {
        /* ── Static exclusion zones ────────────────────────────────────── */
        /* Logo: centered, occupies roughly the middle 46% wide × 80% tall */
        const logoX = arenaW * 0.27;
        const logoY = arenaH * 0.04;
        const logoW = arenaW * 0.46;
        const logoH = arenaH * 0.82;

        /* Location pin: top-right corner */
        const pinX = arenaW * 0.78;
        const pinY = 0;
        const pinW = arenaW * 0.22;
        const pinH = arenaH * 0.32;

        /* ── Spawn bands ─────────────────────────────────────────────────
           Left  band: bubble right-edge ≤ 28% of arena width
           Right band: bubble left-edge  ≥ 72% of arena width             */
        const leftMax    = arenaW * 0.28 - bubbleW;   /* x max for left band  */
        const rightStart = arenaW * 0.72;              /* x min for right band */
        const topMax     = arenaH * 0.42 - bubbleH;
        const botMin     = arenaH * 0.50;

        /* Try up to 18 candidates, reject any that touch logo or pin */
        for (let attempt = 0; attempt < 18; attempt++) {
            const isLeft = Math.random() < 0.5;
            const isTop  = Math.random() < 0.5;

            const x = isLeft
                ? Math.max(10, Math.random() * Math.max(leftMax, 10))
                : rightStart + Math.random() * Math.max(arenaW - bubbleW - 16 - rightStart, 10);

            const y = isTop
                ? Math.max(10, Math.random() * Math.max(topMax, 10))
                : botMin + Math.random() * Math.max(arenaH - botMin - bubbleH - 10, 10);

            /* Reject if overlaps logo or pin exclusion zones */
            if (rectsOverlap(x, y, bubbleW, bubbleH, logoX, logoY, logoW, logoH, 12)) continue;
            if (rectsOverlap(x, y, bubbleW, bubbleH, pinX,  pinY,  pinW,  pinH,  12)) continue;

            /* Reject if overlaps another active bubble */
            const overlaps = activeBubbles.some(r =>
                rectsOverlap(x, y, bubbleW, bubbleH, r.x, r.y, r.w, r.h)
            );
            if (!overlaps) return { x, y };
        }
        return null; /* no valid position found — skip this spawn */
    }

    function spawnBubble() {
        if (activeCount >= MAX_ACTIVE) return;

        const review = reviews[Math.floor(Math.random() * reviews.length)];
        const arenaW = arena.offsetWidth;
        const arenaH = arena.offsetHeight;

        const bubble = document.createElement('div');
        bubble.className = 'review-bubble';
        /* Build bubble content via DOM (avoids innerHTML XSS risk) */
        const stars = document.createElement('span');
        stars.className = 'review-bubble-stars';
        stars.textContent = '★★★★★';
        const textP = document.createElement('p');
        textP.className = 'review-bubble-text';
        textP.textContent = review.text;
        const authorSpan = document.createElement('span');
        authorSpan.className = 'review-bubble-author';
        authorSpan.textContent = '— ' + review.author;
        bubble.appendChild(stars);
        bubble.appendChild(textP);
        bubble.appendChild(authorSpan);

        /* Measure actual rendered size (invisible, off-screen) */
        bubble.style.visibility = 'hidden';
        bubble.style.position   = 'absolute';
        bubble.style.top        = '-9999px';
        arena.appendChild(bubble);
        const bubbleW = bubble.offsetWidth  || 280;
        const bubbleH = bubble.offsetHeight || 130;
        bubble.style.visibility = '';
        bubble.style.top        = '';

        const pos = tryPosition(bubbleW, bubbleH, arenaW, arenaH);
        if (!pos) {
            /* No room — remove the unmeasured bubble and skip */
            bubble.remove();
            return;
        }

        const { x, y } = pos;
        const lifespan  = 5000 + Math.random() * 3000;
        const floatDur  = 4 + Math.random() * 3;
        const floatDelay = Math.random() * 2;

        bubble.style.cssText += `
            left: ${x}px;
            top:  ${y}px;
            --float-dur:   ${floatDur}s;
            --float-delay: ${floatDelay}s;
            --fade-at:     ${(lifespan - 400) / 1000}s;
        `;

        /* Register position */
        const record = { x, y, w: bubbleW, h: bubbleH };
        activeBubbles.push(record);
        activeCount++;

        /* Allow mouse interaction so hover can pause the bubble */
        bubble.style.pointerEvents = 'auto';

        /* Pause lifespan timer while hovered */
        let remaining = lifespan;
        let startTime = Date.now();
        let dismissTimer = setTimeout(dismiss, remaining);

        function dismiss() {
            bubble.remove();
            activeCount--;
            const idx = activeBubbles.indexOf(record);
            if (idx !== -1) activeBubbles.splice(idx, 1);
        }

        bubble.addEventListener('mouseenter', () => {
            clearTimeout(dismissTimer);
            remaining -= Date.now() - startTime;
            /* Freeze fade-out animation */
            bubble.style.animationPlayState = 'paused';
        });

        bubble.addEventListener('mouseleave', () => {
            /* Resume fade-out animation */
            bubble.style.animationPlayState = 'running';
            startTime = Date.now();
            dismissTimer = setTimeout(dismiss, Math.max(remaining, 600));
        });
    }

    /* spawn first bubble immediately, then stagger */
    function scheduleNext() {
        spawnBubble();
        setTimeout(scheduleNext, 1800 + Math.random() * 1200);
    }

    /* first bubble immediately on load, then keep scheduling */
    spawnBubble();
    setTimeout(scheduleNext, 1800);
}

/* ================================================================
   SERVICE AREA MAP
   Interactive SVG map — Gatineau & surrounding areas
   ================================================================ */
function initServiceMap() {
    const svg = document.getElementById('serviceMap');
    if (!svg) return;

    const regions     = svg.querySelectorAll('.map-region');
    const tooltip     = document.getElementById('mapTooltip');
    const tooltipBg   = document.getElementById('mapTooltipBg');
    const tooltipName = document.getElementById('mapTooltipName');
    const tooltipSub  = document.getElementById('mapTooltipSub');

    const isFR = document.documentElement.lang === 'fr';

    const areaInfo = {
        'Hull':          { fr: 'Hull',          sub: isFR ? 'Zone principale ✓'    : 'Primary zone ✓' },
        'Aylmer':        { fr: 'Aylmer',        sub: isFR ? 'Zone desservie ✓'     : 'Service area ✓' },
        'Gatineau':      { fr: 'Gatineau',      sub: isFR ? 'Zone desservie ✓'     : 'Service area ✓' },
        'Masson-Angers': { fr: 'Masson-Angers', sub: isFR ? 'Zone desservie ✓'     : 'Service area ✓' },
        'Buckingham':    { fr: 'Buckingham',    sub: isFR ? 'Zone desservie ✓'     : 'Service area ✓' },
        'Chelsea':       { fr: 'Chelsea',       sub: isFR ? 'Zone desservie ✓'     : 'Service area ✓' },
        'Pontiac':       { fr: 'Pontiac',       sub: isFR ? 'Couverture étendue'   : 'Extended coverage' },
    };

    function positionTooltip(e) {
        const pt   = svg.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const sp = pt.matrixTransform(svg.getScreenCTM().inverse());
        const tx = Math.min(sp.x + 14, 730);
        const ty = Math.max(sp.y - 62, 8);
        tooltipBg.setAttribute('x', tx);
        tooltipBg.setAttribute('y', ty);
        tooltipBg.setAttribute('width', '168');
        tooltipBg.setAttribute('height', '48');
        tooltipName.setAttribute('x', tx + 12);
        tooltipName.setAttribute('y', ty + 21);
        tooltipSub.setAttribute('x', tx + 12);
        tooltipSub.setAttribute('y', ty + 38);
    }

    regions.forEach(region => {
        const key  = region.dataset.name;
        const info = areaInfo[key] || {};

        region.addEventListener('mouseenter', e => {
            tooltipName.textContent = isFR ? (info.fr || key) : key;
            tooltipSub.textContent  = info.sub || '✓';
            positionTooltip(e);
            tooltip.setAttribute('opacity', '1');
            region.classList.add('map-region--active');
        });

        region.addEventListener('mousemove', e => positionTooltip(e));

        region.addEventListener('mouseleave', () => {
            tooltip.setAttribute('opacity', '0');
            region.classList.remove('map-region--active');
        });
    });
}

/* ================================================================
   ENROLL PIN — Dismiss (× button) + Swipe-right to dismiss (mobile)
   ================================================================ */

function dismissEnrollPin(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const pin = document.getElementById('enrollPin');
    if (!pin) return;
    pin.classList.add('enroll-pin--dismissed');
    sessionStorage.setItem('enrollPinDismissed', '1');
}

(function initEnrollPinSwipe() {
    document.addEventListener('DOMContentLoaded', function () {
        const pin = document.getElementById('enrollPin');
        if (!pin) return;

        /* Restore dismissed state across page navigations */
        if (sessionStorage.getItem('enrollPinDismissed') === '1') {
            pin.classList.add('enroll-pin--dismissed');
        }

        /* Swipe-right detection (mobile touch only) */
        let touchStartX = 0;
        let touchStartY = 0;

        pin.addEventListener('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        pin.addEventListener('touchend', function (e) {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
            /* Swipe right by at least 50px and mostly horizontal */
            if (dx > 50 && dy < 60) {
                dismissEnrollPin(null);
            }
        }, { passive: true });
    });
})();

/* ================================================================
   END OF SCRIPT
   ================================================================ */
