/* ── Utility ── */
function extractYouTubeId(input) {
    if (!input) return null;
    const str = String(input).trim();
    if (/^[\w-]{11}$/.test(str)) return str;
    const match = str.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/);
    return match ? match[1] : null;
}

function whatsappUrl() {
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMsg)}`;
}

/* ── Social Icons SVG ── */
const SOCIAL_ICONS = {
    tiktok: `<svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
};

/* ── Social Bar Builder ── */
function buildSocialBar(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    [
        { key: 'tiktok', label: 'TikTok' },
        { key: 'facebook', label: 'Facebook' },
        { key: 'youtube', label: 'YouTube' }
    ].forEach(({ key, label }) => {
        const a = document.createElement('a');
        a.className = 'social-btn';
        a.href = SITE.social[key];
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', label);
        a.innerHTML = SOCIAL_ICONS[key];
        el.appendChild(a);
    });
}

/* ── Contact Links ── */
function initContactLinks() {
    const wa = whatsappUrl();
    document.querySelectorAll('[data-whatsapp]').forEach(el => { el.href = wa; });
    const emailEl = document.getElementById('footer-email');
    if (emailEl) {
        emailEl.href = `mailto:${SITE.email}`;
        emailEl.textContent = SITE.email;
    }
}

/* ── Navigation ── */
function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('open');
            toggle.setAttribute('aria-expanded', menu.classList.contains('open'));
        });
    }
    const current = document.body.dataset.page;
    document.querySelectorAll('.nav-menu a').forEach(link => {
        if (link.dataset.nav === current) link.classList.add('active');
    });
}

/* ── Modal ── */
function initModal() {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const closeBtn = document.getElementById('modal-close');
    if (!modal || !modalContent) return;

    window.openModal = function(type, src) {
        modalContent.innerHTML = '';
        if (type === 'local') {
            const v = document.createElement('video');
            v.src = src;
            v.controls = true;
            v.autoplay = true;
            v.playsInline = true;
            modalContent.appendChild(v);
        } else if (type === 'photo') {
            const img = document.createElement('img');
            img.src = src;
            img.alt = '';
            modalContent.appendChild(img);
        } else if (type === 'youtube') {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube-nocookie.com/embed/${src}?autoplay=1&rel=0`;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            iframe.title = 'YouTube video';
            modalContent.appendChild(iframe);
        }
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    function closeModal() {
        modal.classList.remove('open');
        modalContent.innerHTML = '';
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ── Scroll Reveal Observer (centralized) ── */
function initRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Init ── */
function initSite() {
    initContactLinks();
    initNav();
    initModal();
    buildSocialBar('hero-social');
    buildSocialBar('footer-social');
    initRevealObserver();
}

document.addEventListener('DOMContentLoaded', initSite);
