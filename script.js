/* =====================================================
   SIYAH E AZAL — Cinematic Interactions
   ===================================================== */

(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------
     1. DUST PARTICLES (canvas, ambient throughout)
  --------------------------------------------------- */
  const canvas = document.getElementById('dust-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas(){
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles(count){
    particles = [];
    for(let i=0;i<count;i++){
      particles.push({
        x: Math.random()*window.innerWidth,
        y: Math.random()*window.innerHeight,
        r: Math.random()*1.6 + 0.4,
        speedY: Math.random()*0.25 + 0.05,
        speedX: (Math.random()-0.5)*0.15,
        opacity: Math.random()*0.5 + 0.1,
        flicker: Math.random()*0.02
      });
    }
  }

  function animateDust(){
    ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
    for(const p of particles){
      p.y -= p.speedY;
      p.x += p.speedX;
      p.opacity += (Math.random()-0.5)*p.flicker;
      p.opacity = Math.max(0.05, Math.min(0.6, p.opacity));

      if(p.y < -10){ p.y = window.innerHeight + 10; p.x = Math.random()*window.innerWidth; }
      if(p.x < -10) p.x = window.innerWidth+10;
      if(p.x > window.innerWidth+10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(212,175,55,${p.opacity})`;
      ctx.fill();
    }
    if(!reducedMotion) requestAnimationFrame(animateDust);
  }

  resizeCanvas();
  createParticles(window.innerWidth < 700 ? 45 : 90);
  if(!reducedMotion) requestAnimationFrame(animateDust);
  else animateDust();

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles(window.innerWidth < 700 ? 45 : 90);
  });

  /* ---------------------------------------------------
     2. OPENING SEQUENCE
  --------------------------------------------------- */
  const openingEl = document.getElementById('opening');
  const lines = document.querySelectorAll('.opening-line');
  const enterBtn = document.getElementById('enter-btn');
  const mainExperience = document.getElementById('main-experience');

  function runOpeningSequence(){
    // line 1
    setTimeout(() => lines[0].classList.add('is-visible'), 600);
    // line 2 (after line 1 fades, ~3.6s animation)
    setTimeout(() => lines[1].classList.add('is-visible'), 4400);
    // enter button appears after both lines have played
    setTimeout(() => enterBtn.classList.add('is-visible'), 8200);
  }

  function enterExperience(){
    openingEl.classList.add('opening--hidden');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
      mainExperience.classList.add('is-active');
    }, 300);
  }

  enterBtn.addEventListener('click', enterExperience);

  // lock scroll during opening
  document.body.style.overflow = 'hidden';
  runOpeningSequence();

  // safety: allow skipping opening by pressing any key or clicking anywhere after lines show
  window.addEventListener('keydown', (e) => {
    if(enterBtn.classList.contains('is-visible') && !openingEl.classList.contains('opening--hidden')){
      enterExperience();
    }
  });

  /* ---------------------------------------------------
     3. SCROLL REVEAL (IntersectionObserver)
  --------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.reveal-section, .review-card, .union'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-revealed');
      }
    });
  }, { threshold: 0.25 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------
     4. HERO PARALLAX (mouse + scroll)
  --------------------------------------------------- */
  const mansion = document.querySelector('.hero-mansion');
  const heroContent = document.querySelector('.hero-content');
  const hero = document.getElementById('hero');

  if(!reducedMotion && mansion){
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mansion.style.transform = `scale(1.08) translate(${x*-14}px, ${y*-8}px)`;
      if(heroContent) heroContent.style.transform = `translate(${x*8}px, ${y*4}px)`;
    });

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = hero.offsetHeight;
      if(scrollY < heroHeight){
        const progress = scrollY / heroHeight;
        mansion.style.filter = `brightness(${1 - progress*0.4})`;
        if(heroContent) heroContent.style.opacity = String(1 - progress*1.4);
      }
    }, { passive: true });
  }

  /* ---------------------------------------------------
     5. JEELANI SISTERS — flip cards
  --------------------------------------------------- */
  const sisterCards = document.querySelectorAll('.sister-card');

  sisterCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
    });
    card.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });

    // subtle 3D tilt on hover (desktop only)
    if(!reducedMotion && window.matchMedia('(hover: hover)').matches){
      const inner = card.querySelector('.sister-card-inner');
      card.addEventListener('mousemove', (e) => {
        if(card.classList.contains('is-flipped')) return;
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        inner.style.transform = `rotateY(${px*14}deg) rotateX(${-py*14}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        if(card.classList.contains('is-flipped')) return;
        inner.style.transform = '';
      });
    }
  });

  /* ---------------------------------------------------
     6. UNION SECTION — ring crack trigger
  --------------------------------------------------- */
  // handled via .is-revealed class added by revealObserver (union included above)

  /* ---------------------------------------------------
     7. ENDING SEQUENCE
  --------------------------------------------------- */
  const endingLines = document.querySelectorAll('.ending-line');
  const endingSection = document.getElementById('ending');

  const endingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        setTimeout(() => endingLines[0].classList.add('is-visible'), 800);
        setTimeout(() => endingLines[1].classList.add('is-visible'), 5400);
        endingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  if(endingSection) endingObserver.observe(endingSection);

  /* ---------------------------------------------------
     8. BUY BUTTON — placeholder action
  --------------------------------------------------- */
  const buyBtn = document.querySelector('.buy-btn');
  if(buyBtn){
    buyBtn.addEventListener('click', () => {
      buyBtn.style.transform = 'scale(0.97)';
      setTimeout(() => { buyBtn.style.transform = ''; }, 200);
    });
  }

})();
