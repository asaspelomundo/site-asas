/* ==========================================================================
   Asas Pelo Mundo — interações e animações
   GSAP (ScrollTrigger, SplitText, MotionPath) + Lenis
   ========================================================================== */
(() => {
  'use strict';

  const html = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  /* ---------- utilidades que não dependem de animação ---------- */

  // Links de WhatsApp com mensagem específica (data-wa="mensagem")
  const WA_NUMBER = '551124287118';
  $$('[data-wa]').forEach((a) => {
    const msg = a.getAttribute('data-wa');
    if (msg) a.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  });

  // Ano no rodapé
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Status "aberto agora" no horário de São Paulo
  const statusEl = $('[data-status]');
  if (statusEl) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false,
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t)?.value;
    const day = get('weekday');
    const mins = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
    const weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day);
    const open = (weekday && mins >= 540 && mins < 1080) || (day === 'Sat' && mins >= 540 && mins < 840);
    let label;
    if (open) label = 'Aberto agora';
    else if (weekday && mins < 540) label = 'Fechado · abrimos hoje às 9h';
    else if (day === 'Fri' || day === 'Sat') label = day === 'Fri' && mins >= 1080 ? 'Fechado · abrimos sábado às 9h' : 'Fechado · abrimos segunda às 9h';
    else if (day === 'Sun') label = 'Fechado · abrimos segunda às 9h';
    else label = 'Fechado · abrimos amanhã às 9h';
    statusEl.classList.toggle('is-open', open);
    $('span', statusEl).textContent = label;
  }

  // Menu mobile
  const header = $('.header');
  const burger = $('.burger');
  const menu = $('#menu');
  let lenis = null;
  const setMenu = (open) => {
    html.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.setAttribute('aria-hidden', String(!open));
    if (open) header.classList.remove('is-hidden');
    if (lenis) open ? lenis.stop() : lenis.start();
    if (open && window.gsap && !reduceMotion) {
      gsap.fromTo($$('.menu__links a span, .menu__links a i'), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.04, delay: 0.25 });
    }
  };
  burger.addEventListener('click', () => setMenu(!html.classList.contains('menu-open')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Navegação por âncoras (suave com Lenis quando disponível)
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id.length > 1 && $(id);
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      if (lenis) lenis.scrollTo(target, { offset: id === '#home' ? 0 : -10, duration: 1.6 });
      else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Para quem: troca de perfis ---------- */
  const audience = $('.audience');
  const audItems = $$('.aud');
  const audImgs = $$('.audience__stage .swap-img');
  let audIndex = 0;
  const swapTo = (imgs, from, to) => {
    if (from === to) return;
    imgs.forEach((img) => img.classList.remove('is-prev'));
    imgs[from].classList.remove('is-active');
    imgs[from].classList.add('is-prev');
    void imgs[to].offsetWidth; // reinicia transição
    imgs[to].classList.add('is-active');
  };
  const setAudience = (i) => {
    if (i === audIndex) return;
    swapTo(audImgs, audIndex, i);
    audItems[audIndex].classList.remove('is-active');
    audItems[audIndex].querySelector('button').setAttribute('aria-selected', 'false');
    audIndex = i;
    const item = audItems[i];
    item.classList.add('is-active');
    item.querySelector('button').setAttribute('aria-selected', 'true');
    const bar = item.querySelector('.aud__bar i');
    bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
  };
  audItems.forEach((item, i) => {
    const btn = item.querySelector('button');
    btn.addEventListener('click', () => setAudience(i));
    if (finePointer) btn.addEventListener('mouseenter', () => setAudience(i));
    item.querySelector('.aud__bar i').addEventListener('animationend', () => {
      if (!reduceMotion) setAudience((audIndex + 1) % audItems.length);
    });
  });
  const audList = $('.audience__list');
  audList.addEventListener('mouseenter', () => audience.classList.add('is-paused'));
  audList.addEventListener('mouseleave', () => audience.classList.remove('is-paused'));
  new IntersectionObserver(([entry]) => {
    audience.classList.toggle('is-paused', !entry.isIntersecting);
  }, { threshold: 0.35 }).observe(audience);
  if (reduceMotion) audience.classList.add('is-paused');

  /* ---------- Depoimentos: slider ---------- */
  const quotes = $$('.quote');
  const testiImgs = $$('.testi__media .swap-img');
  const testiCount = $('.testi__count b');
  const testiBar = $('.testi__progress i');
  let tIndex = 0;
  let tTimer = null;
  const TESTI_DELAY = 7;
  const goTesti = (n) => {
    const next = (n + quotes.length) % quotes.length;
    if (next !== tIndex) {
      quotes[tIndex].classList.remove('is-active');
      quotes[next].classList.add('is-active');
      swapTo(testiImgs, tIndex, next);
      tIndex = next;
      testiCount.textContent = String(next + 1).padStart(2, '0');
    }
    runTestiTimer();
  };
  const runTestiTimer = () => {
    if (reduceMotion) return;
    if (window.gsap) {
      tTimer && tTimer.kill();
      tTimer = gsap.fromTo(testiBar, { scaleX: 0 }, { scaleX: 1, duration: TESTI_DELAY, ease: 'none', onComplete: () => goTesti(tIndex + 1), paused: !testiVisible });
    }
  };
  let testiVisible = false;
  $('[data-prev]').addEventListener('click', () => goTesti(tIndex - 1));
  $('[data-next]').addEventListener('click', () => goTesti(tIndex + 1));
  // gesto de arrastar no celular
  const testi = $('.testi');
  let touchX = null;
  testi.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  testi.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) goTesti(tIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  });
  new IntersectionObserver(([entry]) => {
    testiVisible = entry.isIntersecting;
    if (tTimer) testiVisible ? tTimer.resume() : tTimer.pause();
  }, { threshold: 0.3 }).observe(testi);

  /* ---------- Cartões de contato: brilho que segue o cursor ---------- */
  if (finePointer) {
    $$('.channel').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ==========================================================================
     A partir daqui: animações. Se as bibliotecas não carregarem,
     a página continua completa e funcional, apenas sem movimento.
     ========================================================================== */
  const loader = $('.loader');
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);

  if (!hasGSAP || reduceMotion) {
    html.classList.remove('js');
    loader && loader.remove();
    $('.wa-float').classList.add('is-visible');
    $$('.step').forEach((s) => s.classList.add('is-on'));
    $$('.wp').forEach((s) => s.classList.add('is-on'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  if (window.MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin);

  /* ---------- rolagem suave ---------- */
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.095, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  const mm = gsap.matchMedia();

  /* ---------- header: some ao descer, volta ao subir ---------- */
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      header.classList.toggle('is-scrolled', y > 30);
      if (html.classList.contains('menu-open')) return;
      if (y > 500 && self.direction === 1) header.classList.add('is-hidden');
      else if (self.direction === -1 || y <= 500) header.classList.remove('is-hidden');
    },
  });

  // link ativo no menu
  const navLinks = $$('.nav a');
  ['home', 'sobre', 'servicos', 'como-funciona', 'depoimentos', 'contato'].forEach((id) => {
    const sec = document.getElementById(id);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 45%',
      end: id === 'sobre' ? () => `+=${sec.offsetHeight + $('#fundadora').offsetHeight + $('#valores').offsetHeight}` : 'bottom 45%',
      onToggle: (self) => {
        if (!self.isActive) return;
        navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
      },
    });
  });

  // botão flutuante do WhatsApp aparece depois do hero
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'bottom 70%',
    onEnter: () => $('.wa-float').classList.add('is-visible'),
    onLeaveBack: () => $('.wa-float').classList.remove('is-visible'),
  });

  /* ---------- botões magnéticos ---------- */
  if (finePointer) {
    $$('.magnetic').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.45)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.45)' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.28);
        yTo((e.clientY - r.top - r.height / 2) * 0.38);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- marquee de destinos (reage à velocidade da rolagem) ---------- */
  const track = $('.marquee__track');
  if (track) {
    track.appendChild(track.firstElementChild.cloneNode(true)).setAttribute('aria-hidden', 'true');
    const setX = gsap.quickSetter(track, 'xPercent');
    const wrap = gsap.utils.wrap(-50, 0);
    let xp = 0;
    let dir = 1;
    let boost = 0;
    gsap.ticker.add((_, dt) => {
      boost *= 0.92;
      xp = wrap(xp - (dir * (1 + boost) * dt) * 0.0016);
      setX(xp);
    });
    ScrollTrigger.create({
      onUpdate: (self) => {
        dir = self.direction;
        boost = Math.min(Math.abs(self.getVelocity()) / 220, 7);
      },
    });
  }

  /* ---------- títulos: revelação por linha ---------- */
  const splitReveal = (el, opts = {}) => {
    if (!window.SplitText) return;
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 115,
        duration: 1.25,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: opts.start || 'top 86%', once: true },
      }),
    });
  };

  /* ---------- elementos que surgem ---------- */
  const setupReveals = () => {
    $$('.split').forEach((el) => splitReveal(el));

    gsap.set('[data-reveal]', { y: 36, autoAlpha: 0 });
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 1.2, ease: 'expo.out', stagger: 0.1, overwrite: true }),
    });

    // imagens com cortina
    $$('[data-clip]').forEach((el) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
        .fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' });
      // palcos com troca de imagem já animam a imagem via CSS
      if (!el.querySelector('.swap-img')) tl.from($('img', el), { scale: 1.35, duration: 2, ease: 'expo.out' }, '<0.15');
    });

    // parallax suave
    $$('[data-parallax]').forEach((img) => {
      const amt = parseFloat(img.dataset.parallax) || 8;
      gsap.fromTo(img, { yPercent: -amt }, {
        yPercent: amt,
        ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  };

  /* ---------- história ---------- */
  const setupStory = () => {
    const lead = $('.story__lead');
    if (lead && window.SplitText) {
      SplitText.create(lead, {
        type: 'words',
        autoSplit: true,
        onSplit: (self) => gsap.fromTo(self.words, { opacity: 0.16 }, {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: lead, start: 'top 82%', end: 'bottom 48%', scrub: true },
        }),
      });
    }
    gsap.fromTo('.stamp', { rotate: -40, scale: 0.6, autoAlpha: 0 }, {
      rotate: 0, scale: 1, autoAlpha: 1, duration: 1.6, ease: 'expo.out',
      scrollTrigger: { trigger: '.story__media', start: 'top 70%', once: true },
    });
    gsap.to('.stamp', {
      rotate: 90,
      ease: 'none',
      scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  };

  /* ---------- fundadora: persiana da janela ---------- */
  const setupFounder = () => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.window', start: 'top 72%', once: true } });
    tl.from('.window', { y: 60, autoAlpha: 0, duration: 1.2, ease: 'expo.out' })
      .to('.window__shade', { yPercent: -101, duration: 1.7, ease: 'power3.inOut' }, '-=0.6')
      .from('.window__pane img', { scale: 1.25, duration: 2.2, ease: 'expo.out' }, '<0.2');
    gsap.to('.founder__badge', {
      yPercent: -40,
      ease: 'none',
      scrollTrigger: { trigger: '.founder', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  };

  /* ---------- valores ---------- */
  const setupValues = () => {
    $$('.value').forEach((v) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: v, start: 'top 85%', once: true } });
      tl.from($('.value__line', v), { scaleX: 0, duration: 1.4, ease: 'expo.inOut' })
        .from($('.value__word span', v), { yPercent: 110, duration: 1.2, ease: 'expo.out' }, '-=0.9')
        .from([$('.value__num', v), $('.value__desc', v)], { y: 20, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, '<0.1')
        .from($('.value__icon', v), { scale: 0.4, rotate: -90, autoAlpha: 0, duration: 1.1, ease: 'expo.out' }, '<');
    });
  };

  /* ---------- serviços: galeria horizontal ---------- */
  const setupServices = () => {
    const pin = $('.services__pin');
    const viewport = $('.services__viewport');
    const trackEl = $('.services__track');
    const bar = $('.services__bar i');
    const count = $('.services__count b');
    const cards = $$('.service:not(.service--cta)');
    const total = cards.length;
    const setCount = (p) => { count.textContent = String(Math.min(total, Math.floor(p * total) + 1)).padStart(2, '0'); };

    mm.add('(min-width: 1024px)', () => {
      const dist = () => Math.max(0, trackEl.scrollWidth - viewport.clientWidth);
      const tween = gsap.to(trackEl, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => { gsap.set(bar, { scaleX: self.progress }); setCount(self.progress); },
        },
      });
      $$('.service__media img').forEach((img) => {
        gsap.fromTo(img, { xPercent: -6 }, {
          xPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: img.closest('.service'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        });
      });
      gsap.from('.service', {
        y: 80, autoAlpha: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: pin, start: 'top 75%', once: true },
      });
    });

    mm.add('(max-width: 1023px)', () => {
      const onScroll = () => {
        const max = viewport.scrollWidth - viewport.clientWidth;
        const p = max > 0 ? viewport.scrollLeft / max : 0;
        gsap.set(bar, { scaleX: p });
        setCount(p);
      };
      viewport.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => viewport.removeEventListener('scroll', onScroll);
    });
  };

  /* ---------- como funciona: rota de voo ---------- */
  const setupSteps = () => {
    const steps = $$('.step');
    const wps = $$('.wp');
    const setOn = (p) => {
      steps.forEach((s, i) => s.classList.toggle('is-on', p >= i / (steps.length - 1) - 0.02));
      wps.forEach((w, i) => w.classList.toggle('is-on', p >= i / (wps.length - 1) - 0.02));
    };

    mm.add('(min-width: 1024px)', () => {
      const path = $('#stepsPath');
      const len = path.getTotalLength();
      path.style.setProperty('--len', len);
      const plane = $('.route-plane');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.steps__route',
          start: 'top 78%',
          end: 'bottom 45%',
          scrub: 1,
          onUpdate: (self) => setOn(self.progress),
        },
      });
      tl.fromTo(path, { strokeDashoffset: len }, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0);
      if (window.MotionPathPlugin) {
        tl.to(plane, {
          motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true },
          ease: 'none',
          duration: 1,
        }, 0);
      }
      setOn(0);
    });

    mm.add('(max-width: 1023px)', () => {
      gsap.fromTo('.steps__rail i', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.steps__list',
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: true,
          onUpdate: (self) => setOn(self.progress),
        },
      });
      setOn(0);
    });
  };

  /* ---------- contato + rodapé ---------- */
  const setupContact = () => {
    gsap.from('.footer__word span', {
      yPercent: 60,
      autoAlpha: 0,
      duration: 1.6,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.footer__word', start: 'top 95%', once: true },
    });
  };

  /* ---------- hero + abertura ---------- */
  const heroImg = $('.hero__img');
  const title = $('.hero__title');
  let heroLines = [title];
  if (window.SplitText) {
    SplitText.create(title, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) => { heroLines = self.lines; },
    });
  }

  const intro = () => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // abertura: círculo da logo se desenha, a asa aparece
    // (na mesma sessão, a abertura é abreviada)
    let seen = false;
    try { seen = sessionStorage.getItem('apm-intro') === '1'; sessionStorage.setItem('apm-intro', '1'); } catch (e) { /* sem storage */ }
    if (seen) {
      tl.to(loader, { autoAlpha: 0, duration: 1.2, ease: 'power2.out' });
    } else {
      tl.to('.loader__ring circle', { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
        .fromTo('.loader__wing', { autoAlpha: 0, scale: 0.82 }, { autoAlpha: 1, scale: 1, duration: 0.9 }, '-=0.55')
        .fromTo('.loader__word', { autoAlpha: 0, letterSpacing: '0.9em' }, { autoAlpha: 1, letterSpacing: '0.55em', duration: 1.1 }, '<')
        .to('.loader__mark', { scale: 0.9, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, '+=0.2')
        .to('.loader__word', { autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, '<')
        .to(loader, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.15');
    }
    tl.set(loader, { display: 'none' })
      .add(() => { lenis && lenis.start(); });

    // hero
    tl.fromTo(heroImg, { scale: 1.56 }, { scale: 1.34, duration: 2.6, ease: 'expo.out' }, '-=1.05')
      .from('.hero__eyebrow', { y: 20, autoAlpha: 0, duration: 1 }, '-=2.1')
      .from(heroLines, { yPercent: 115, duration: 1.3, stagger: 0.09 }, '-=2')
      .from('.hero__lead', { y: 24, autoAlpha: 0, duration: 1.1 }, '-=1.2')
      .from('.hero__actions > *', { y: 24, autoAlpha: 0, duration: 1.1, stagger: 0.1 }, '-=1')
      .from('.hero__stats', { autoAlpha: 0, duration: 1 }, '-=1')
      .from('.stat', { y: 26, autoAlpha: 0, duration: 1.1, stagger: 0.08 }, '<')
      .from('.hero__badge', { scale: 0.5, autoAlpha: 0, rotate: -90, duration: 1.6 }, '-=1.2');

    // contagem dos números
    $$('[data-count]').forEach((el) => {
      const end = parseFloat(el.dataset.count);
      const o = { v: 0 };
      tl.to(o, { v: end, duration: 2.2, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } }, '-=1.9');
    });

    // rota do avião (desktop)
    const heroPath = $('#heroRoute');
    const reveal = $('.hero__route-reveal');
    if (heroPath && getComputedStyle($('.hero__route')).display !== 'none') {
      const len = reveal.getTotalLength();
      gsap.set(reveal, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(reveal, { strokeDashoffset: 0, duration: 3.2, ease: 'power1.inOut' }, '-=2.2');
      if (window.MotionPathPlugin) {
        tl.set('.hero__plane', { autoAlpha: 1 }, '<')
          .to('.hero__plane', {
            motionPath: { path: heroPath, align: heroPath, alignOrigin: [0.5, 0.5], autoRotate: true },
            duration: 3.2,
            ease: 'power1.inOut',
          }, '<');
      }
    }
    return tl;
  };

  // hero ao rolar: imagem desce devagar, conteúdo sobe e esmaece
  const setupHeroScroll = () => {
    const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero__media', { yPercent: 18, ease: 'none', scrollTrigger: st });
    gsap.to('.hero__content', { yPercent: -18, autoAlpha: 0.2, ease: 'none', scrollTrigger: st });
    gsap.to('.hero__route', { yPercent: -10, ease: 'none', scrollTrigger: st });
  };

  /* ---------- inicialização ---------- */
  const imgReady = new Promise((res) => {
    if (heroImg.complete) res();
    else { heroImg.addEventListener('load', res, { once: true }); heroImg.addEventListener('error', res, { once: true }); }
  });
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  const timeout = new Promise((res) => setTimeout(res, 2500));

  Promise.race([Promise.all([imgReady, fontsReady]), timeout]).then(() => {
    loader.style.animation = 'none';
    setupReveals();
    setupStory();
    setupFounder();
    setupValues();
    setupServices();
    setupSteps();
    setupContact();
    setupHeroScroll();
    intro();
    runTestiTimer();
    ScrollTrigger.refresh();
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
