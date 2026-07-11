/* =====================================================
   SIYAH E AZAL — Chapter One interactions
   Reuses the same ambient particle system as script.js
   on the landing page, plus reading-page specific behavior.
   ===================================================== */

(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------
     1. DUST PARTICLES (identical system to the landing page)
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
     2. READING PROGRESS BAR
  --------------------------------------------------- */
  const progressFill = document.getElementById('progress-fill');

  function updateProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressFill.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------------------------------------------------
     3. SCROLL REVEAL
  --------------------------------------------------- */
  const revealTargets = document.querySelectorAll('.reveal-section');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-revealed');
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------
     4. PDF LOADING STATE
  --------------------------------------------------- */
  const pdfFrame = document.getElementById('chapter-pdf');
  const pdfLoading = document.getElementById('pdf-loading');

  if(pdfFrame && pdfLoading){
    pdfFrame.addEventListener('load', () => {
      pdfLoading.style.opacity = '0';
      setTimeout(() => { pdfLoading.style.display = 'none'; }, 500);
    });
    // fallback in case load event doesn't fire in some browsers
    setTimeout(() => {
      if(pdfLoading.style.display !== 'none'){
        pdfLoading.style.opacity = '0';
        setTimeout(() => { pdfLoading.style.display = 'none'; }, 500);
      }
    }, 4000);
  }

  /* ---------------------------------------------------
     5. CHAPTER OPENING — fade out as the user scrolls past it
  --------------------------------------------------- */
  const chapterOpening = document.getElementById('chapter-opening');

  if(chapterOpening && !reducedMotion){
    window.addEventListener('scroll', () => {
      const openingHeight = chapterOpening.offsetHeight;
      const progress = Math.min(window.scrollY / openingHeight, 1);
      chapterOpening.style.opacity = String(1 - progress * 1.2);
      chapterOpening.style.transform = `translateY(${progress * -40}px)`;
    }, { passive: true });
  }

})();
