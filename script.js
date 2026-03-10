// ===== LOADER =====
const loaderLines = [
    '$ ssh ahmed@portfolio.dev',
    '$ Loading modules...',
    '$ Initializing components... ✓',
    '$ Welcome, Ahmed Elashry. Ready.'
];
let lineIndex = 0;
function showLoaderLine() {
    if (lineIndex < loaderLines.length) {
        const el = document.getElementById('loader-line' + (lineIndex + 1));
        if (el) {
            el.textContent = loaderLines[lineIndex];
            el.classList.add('show');
        }
        lineIndex++;
        setTimeout(showLoaderLine, 500);
    } else {
        setTimeout(() => {
            document.getElementById('loader').classList.add('hide');
        }, 600);
    }
}
window.addEventListener('load', () => setTimeout(showLoaderLine, 300));

// ===== TYPING =====
const typingTexts = [
    'Senior Flutter Developer',
    'Full-Stack Engineer',
    'IT Infrastructure Specialist',
    '30+ Apps in Production',
    '100K+ Active Users'
];
let txtIdx = 0, charIdx = 0, deleting = false;
function typeEffect() {
    const el = document.getElementById('typingText');
    if (!el) return;
    const current = typingTexts[txtIdx];
    if (!deleting) {
        el.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
            deleting = true;
            setTimeout(typeEffect, 2000);
            return;
        }
        setTimeout(typeEffect, 80);
    } else {
        el.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
            deleting = false;
            txtIdx = (txtIdx + 1) % typingTexts.length;
        }
        setTimeout(typeEffect, 40);
    }
}
setTimeout(typeEffect, 2500);

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
        const target = +el.dataset.count;
        const duration = 2000;
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.querySelector('.stat-num')) animateCounters();
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section, .hero-stats, .project-card, .cert-card, .stack-category').forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
});

// ===== PROJECT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
            const cats = card.dataset.category;
            if (filter === 'all' || cats.includes(filter)) {
                card.style.display = '';
                setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => { card.style.display = 'none'; }, 300);
            }
        });
    });
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbCounter = document.getElementById('lbCounter');
let lbImages = [];
let lbIndex = 0;

function openLightbox(images, index, title) {
    lbImages = images;
    lbIndex = index;
    lbImg.src = lbImages[lbIndex];
    lbCaption.textContent = title || '';
    lbCounter.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
}

function navigateLb(dir) {
    lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
    lbImg.src = lbImages[lbIndex];
    lbCounter.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => navigateLb(-1));
document.getElementById('lbNext').addEventListener('click', () => navigateLb(1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLb(-1);
    if (e.key === 'ArrowRight') navigateLb(1);
});

// Attach gallery click to screenshot thumbnails
document.querySelectorAll('.project-screenshots img').forEach(img => {
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = img.closest('.project-card');
        const gallery = JSON.parse(card.dataset.gallery || '[]');
        const title = card.dataset.title || '';
        const idx = Array.from(card.querySelectorAll('.project-screenshots img')).indexOf(img);
        openLightbox(gallery, idx, title);
    });
});

// Also open lightbox on main project image click
document.querySelectorAll('.project-card[data-gallery] > .project-img > img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
        const card = img.closest('.project-card');
        const gallery = JSON.parse(card.dataset.gallery || '[]');
        const title = card.dataset.title || '';
        openLightbox(gallery, 0, title);
    });
});
