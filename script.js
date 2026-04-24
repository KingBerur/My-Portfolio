/* =====================================================
   KingBerurInc Portfolio — script.js
   Ryan Berur | Photography & Videography
   ===================================================== */

/* ---------- 1. LOADER ---------- */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // trigger hero zoom after load
    document.getElementById('hero-bg').classList.add('zoomed');
    // Trigger initial reveals
    revealObserver.observe(document.querySelector('.hero__content'));
  }, 1800);
});

/* ---------- 2. STICKY HEADER ---------- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
}, { passive: true });

/* ---------- 3. MOBILE NAV TOGGLE ---------- */
const navToggle = document.getElementById('nav-toggle');
const nav       = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  // Animate hamburger to X
  const spans = navToggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(6px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    document.body.style.overflow = '';
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ---------- 4. ACTIVE NAV ---------- */
const sections = document.querySelectorAll('section[id]');
function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  document.querySelectorAll('.nav__link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

/* ---------- 5. PARALLAX HERO & WAVE ---------- */
window.addEventListener('scroll', () => {
  const heroBg = document.getElementById('hero-bg');
  const waveBg = document.querySelector('.wave-bg');
  
  if (heroBg) {
    heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.15}px)`;
  }
  
  if (waveBg) {
    const scrollPos = window.scrollY;
    // Hide wave on hero, show elsewhere
    if (scrollPos > window.innerHeight * 0.8) {
      waveBg.classList.add('visible');
    } else {
      waveBg.classList.remove('visible');
    }
    
    // Global scroll-reactive movement
    waveBg.style.backgroundPosition = `${scrollPos * 0.15}% ${scrollPos * 0.08}%`;
  }
}, { passive: true });

/* ---------- 6. SCROLL REVEAL (Intersection Observer) ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger children if they share the reveal class
      const revealItems = entry.target.querySelectorAll
        ? entry.target.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
        : [];
      if (revealItems.length > 0) {
        revealItems.forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 120);
        });
      }
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ---------- 7. GALLERY FILTER ---------- */
const filterTabs = document.querySelectorAll('.filter-tab');
const galleryItems = document.querySelectorAll('.gallery__item');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;
    galleryItems.forEach(item => {
      const cat = item.dataset.category;
      if (filter === 'all' || cat === filter) {
        item.classList.remove('hidden');
        item.style.animation = 'fadeIn .4s ease forwards';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* Fade-in keyframe via JS */
const styleTag = document.createElement('style');
styleTag.textContent = `@keyframes fadeIn { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }`;
document.head.appendChild(styleTag);

/* ---------- 8. LIGHTBOX ---------- */
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose   = document.getElementById('lightbox-close');
const lightboxPrev    = document.getElementById('lightbox-prev');
const lightboxNext    = document.getElementById('lightbox-next');

// Collect only photo items (not video)
const photoItems = () => Array.from(document.querySelectorAll(
  '.gallery__item:not(.gallery__item--video):not(.hidden)'
));
let currentIndex = 0;

function openLightbox(index) {
  const items = photoItems();
  if (!items[index]) return;
  currentIndex = index;
  const img   = items[index].querySelector('img');
  const title = items[index].querySelector('.gallery__title');
  lightboxImg.src               = img ? img.src : '';
  lightboxImg.alt               = img ? img.alt : '';
  lightboxCaption.textContent   = title ? title.textContent : '';
  lightbox.classList.add('open');
  document.body.style.overflow  = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow  = '';
}

galleryItems.forEach((item, idx) => {
  if (!item.classList.contains('gallery__item--video')) {
    item.addEventListener('click', () => {
      const photoArr = photoItems();
      const imgEl = item.querySelector('img');
      const clickedIdx = photoArr.findIndex(p => p.querySelector('img') === imgEl);
      openLightbox(clickedIdx !== -1 ? clickedIdx : 0);
    });
  }
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

lightboxPrev.addEventListener('click', () => {
  const items = photoItems();
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  openLightbox(currentIndex);
});
lightboxNext.addEventListener('click', () => {
  const items = photoItems();
  currentIndex = (currentIndex + 1) % items.length;
  openLightbox(currentIndex);
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')       closeLightbox();
  if (e.key === 'ArrowLeft')    lightboxPrev.click();
  if (e.key === 'ArrowRight')   lightboxNext.click();
});

/* ---------- 9. CONTACT FORM ---------- */
const contactForm    = document.getElementById('contact-form');
const formSuccess    = document.getElementById('form-success');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('form-submit');
  btn.textContent   = 'Sending…';
  btn.disabled      = true;
  // Simulate async
  setTimeout(() => {
    formSuccess.classList.add('visible');
    contactForm.reset();
    btn.textContent = 'Send Message';
    btn.disabled    = false;
    setTimeout(() => formSuccess.classList.remove('visible'), 5000);
  }, 1200);
});
