/* ========================================
   RETRO PORTFOLIO - JavaScript
   ======================================== */

// --- Theme Toggle ---
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('retro-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('retro-theme', next);
});

// --- Retro Cursor ---
const cursor = document.getElementById('retroCursor');
const cursorDot = document.getElementById('retroCursorDot');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top = my + 'px';
});

function animateCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, input, select, textarea, .work-card, .service-item, .filter-btn, .skill-list span, .nav-cta, .btn, .theme-toggle, .contact-link-item, .highlight-item, .review-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

// --- Navigation ---
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target) && navLinks.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// --- Smooth Scroll ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const id = this.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            const offset = 80;
            const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: pos, behavior: 'smooth' });
        }
    });
});

// --- Typing Animation ---
const titles = [
    'WordPress Expert',
    'Figma to WordPress',
    'Elementor Pro Developer',
    'WooCommerce Specialist',
    'Divi Developer'
];
let tIndex = 0, cIndex = 0, deleting = false;
const subtitle = document.getElementById('heroSubtitle');

function typeLoop() {
    const current = titles[tIndex];
    if (deleting) {
        subtitle.textContent = current.substring(0, cIndex - 1);
        cIndex--;
    } else {
        subtitle.textContent = current.substring(0, cIndex + 1);
        cIndex++;
    }
    let speed = deleting ? 40 : 90;
    if (!deleting && cIndex === current.length) {
        speed = 2200;
        deleting = true;
    } else if (deleting && cIndex === 0) {
        deleting = false;
        tIndex = (tIndex + 1) % titles.length;
        speed = 400;
    }
    setTimeout(typeLoop, speed);
}
setTimeout(typeLoop, 800);

// --- Counter Animation ---
function animateCounters() {
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = prefix + Math.floor(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = prefix + target + suffix;
        }
        requestAnimationFrame(update);
    });
}

const heroObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            animateCounters();
            heroObs.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });
heroObs.observe(document.getElementById('hero'));

// --- Portfolio Filter + Load More ---
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadMoreWrap = document.getElementById('loadMoreWrap');
let showingAll = false;

// Initially hide extra cards
workCards.forEach((card, i) => {
    if (i >= 6) {
        card.style.display = 'none';
        card.dataset.extra = 'true';
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        let visibleCount = 0;
        workCards.forEach((card) => {
            const match = filter === 'all' || card.getAttribute('data-category') === filter;
            if (match) {
                visibleCount++;
                if (!showingAll && visibleCount > 6) {
                    card.style.display = 'none';
                } else {
                    card.style.display = '';
                    card.style.animation = `fadeUp 0.4s ease ${(visibleCount - 1) * 0.06}s forwards`;
                }
            } else {
                card.style.display = 'none';
            }
        });

        loadMoreWrap.style.display = (!showingAll && visibleCount > 6) ? 'block' : 'none';
    });
});

loadMoreBtn.addEventListener('click', () => {
    showingAll = true;
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    let count = 0;

    workCards.forEach(card => {
        const match = activeFilter === 'all' || card.getAttribute('data-category') === activeFilter;
        if (match) {
            count++;
            card.style.display = '';
            card.style.animation = `fadeUp 0.3s ease ${count * 0.04}s forwards`;
        }
    });

    loadMoreWrap.style.display = 'none';
});

// --- Scroll Fade-In ---
const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.work-card, .service-item, .skill-group, .review-card, .highlight-item, .about-stat-card, .contact-link-item, .hero-photo-wrap').forEach(el => {
    el.classList.add('fade-in');
    fadeObs.observe(el);
});


// --- Contact Form ---
// const form = document.getElementById('contactForm');
// const submitBtn = document.getElementById('submitBtn');

// form.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const name = document.getElementById('formName').value.trim();
//     const email = document.getElementById('formEmail').value.trim();
//     const service = document.getElementById('formService').value;
//     const message = document.getElementById('formMessage').value.trim();
//     if (!name || !email || !service || !message) return;

//     submitBtn.textContent = 'SENDING...';
//     submitBtn.disabled = true;

//     try {
//         const formData = new FormData(form);
//         const response = await fetch(form.action, {
//             method: 'POST',
//             body: formData,
//             headers: { 'Accept': 'application/json' }
//         });

//         if (response.ok) {
//             submitBtn.textContent = 'SENT!';
//             form.reset();
//         } else {
//             throw new Error('Submission failed');
//         }
//     } catch (err) {
//         submitBtn.textContent = 'FAILED - TRY AGAIN';
//     }

//     setTimeout(() => {
//         submitBtn.textContent = 'SEND MESSAGE';
//         submitBtn.disabled = false;
//     }, 2000);
// });


// --- Active Nav Link ---
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            link.style.color = (scrollY >= top && scrollY < top + height) ? 'var(--accent)' : '';
        }
    });
});

// --- Add keyframe ---
const style = document.createElement('style');
style.textContent = `@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);

// --- Project Modal ---
const projectModal = document.getElementById('projectModal');
const projectModalOverlay = document.getElementById('projectModalOverlay');
const projectModalClose = document.getElementById('projectModalClose');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalDesc = document.getElementById('projectModalDesc');
const projectModalBody = document.getElementById('projectModalBody');
const projectModalTech = document.getElementById('projectModalTech');
const projectModalLink = document.getElementById('projectModalLink');
const workCardsClickable = document.querySelectorAll('.work-card');

// Stop visit link from closing modal and open in new tab
projectModalLink.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = projectModalLink.href;
    if (url && url !== '#' && url !== window.location.href + '#') {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
});

// Open project modal on card click
workCardsClickable.forEach(card => {
    card.addEventListener('click', (e) => {
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        const tech = card.getAttribute('data-tech');
        const url = card.getAttribute('data-url');
        const video = card.getAttribute('data-video');
        const screenshot = card.getAttribute('data-screenshot');

        projectModalTitle.textContent = title;
        projectModalDesc.textContent = desc;
        projectModalTech.textContent = tech;
        projectModalLink.href = url;

        // Clear previous content
        projectModalBody.innerHTML = '';

        // Show video if available, otherwise show screenshot
        if (video && video.trim() !== '') {
            const iframe = document.createElement('iframe');
            iframe.src = video + '?autoplay=0&rel=0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            projectModalBody.appendChild(iframe);
        } else if (screenshot) {
            const img = document.createElement('img');
            img.src = screenshot;
            img.alt = title;
            img.loading = 'lazy';
            projectModalBody.appendChild(img);
        }

        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeProjectModal() {
    projectModal.classList.remove('active');
    projectModalBody.innerHTML = '';
    document.body.style.overflow = '';
}

projectModalOverlay.addEventListener('click', closeProjectModal);
projectModalClose.addEventListener('click', closeProjectModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeProjectModal();
    }
});
