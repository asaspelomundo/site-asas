/* ==========================================================================
   Asas Pelo Mundo — interações e animações
   Conteúdo e links funcionam sem as bibliotecas; GSAP/Lenis só acrescentam
   movimento, e tudo respeita "reduzir movimento" do sistema.
   ========================================================================== */
(() => {
  'use strict';

  /* ---------- CONFIGURAÇÃO ---------- */
  // WhatsApp comercial (Maria Fernanda)
  const WA_NUMBER = '5511915978283';
  // Página da curadoria de milhas da Fran. Trocar aqui quando o endereço específico for definido;
  // todos os botões "Conheça a curadoria da Fran" usam este mesmo valor.
  const CURADORIA_URL = 'https://www.francarrillo.com.br/';

  // Mensagem inicial de cada botão (identifica o interesse de origem para a Maria)
  const WA_MESSAGES = {
    planejar: 'Olá, Maria! Vim pelo site da Asas e quero planejar uma viagem.',
    'sob-medida': 'Olá, Maria! Vim pelo site da Asas e tenho interesse em uma viagem sob medida.',
    hospedagem: 'Olá, Maria! Vim pelo site da Asas e quero ajuda para encontrar uma hospedagem.',
    passagens: 'Olá, Maria! Vim pelo site da Asas e quero planejar meus voos (passagens aéreas).',
    cruzeiro: 'Olá, Maria! Vim pelo site da Asas e tenho interesse em um cruzeiro.',
    grupos: 'Olá, Maria! Vim pelo site da Asas e quero conhecer as experiências em grupo da Asas.',
    planejamento: 'Olá, Maria! Vim pelo site da Asas e quero conhecer os serviços de planejamento.',
    equipe: 'Olá, Maria! Vim pelo site da Asas e quero conversar com a equipe sobre a minha próxima viagem.',
  };

  const html = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  $$('[data-wa]').forEach((a) => { a.href = waLink(WA_MESSAGES[a.dataset.wa] || WA_MESSAGES.planejar); });
  $$('[data-curadoria]').forEach((a) => { a.href = CURADORIA_URL; });
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- horário (São Paulo) — "aberto agora" vale para o presencial ---------- */
  const statusEl = $('[data-status]');
  if (statusEl) {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t)?.value;
    const day = get('weekday');
    const mins = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
    const weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day);
    const open = (weekday && mins >= 480 && mins < 1020) || (day === 'Sat' && mins >= 540 && mins < 780);
    let label;
    if (open) label = 'Atendimento presencial aberto agora';
    else if (weekday && mins < 480) label = 'Presencial fechado agora · abre hoje às 8h';
    else if (day === 'Sat' && mins < 540) label = 'Presencial fechado agora · abre hoje às 9h';
    else if (day === 'Fri') label = 'Presencial fechado agora · abre sábado às 9h';
    else if (day === 'Sat' || day === 'Sun') label = 'Presencial fechado agora · abre segunda às 8h';
    else label = 'Presencial fechado agora · abre amanhã às 8h';
    statusEl.classList.toggle('is-open', open);
    $('span', statusEl).textContent = label;
  }

  /* ---------- menu mobile ---------- */
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
  };
  burger.addEventListener('click', () => setMenu(!html.classList.contains('menu-open')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && html.classList.contains('menu-open')) { setMenu(false); burger.focus(); } });

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id.length > 1 && document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      if (lenis) lenis.scrollTo(target, { offset: id === '#inicio' ? 0 : -70, duration: 1.3 });
      else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- perfis: abas acessíveis (clique, foco e setas do teclado), sem troca automática ---------- */
  const tabs = $$('.aud');
  const panels = $$('.audience__stage .swap-img');
  let current = 0;
  const swapTo = (from, to) => {
    if (from === to) return;
    panels.forEach((p) => p.classList.remove('is-prev'));
    panels[from].classList.remove('is-active');
    panels[from].classList.add('is-prev');
    void panels[to].offsetWidth;
    panels[to].classList.add('is-active');
  };
  const selectTab = (i, focus = false) => {
    if (i === current) return;
    swapTo(current, i);
    tabs.forEach((t, k) => {
      const on = k === i;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    current = i;
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(i));
    if (finePointer) t.addEventListener('mouseenter', () => selectTab(i));
    t.addEventListener('keydown', (e) => {
      const next = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (next) { e.preventDefault(); selectTab((current + next + tabs.length) % tabs.length, true); }
      if (e.key === 'Home') { e.preventDefault(); selectTab(0, true); }
      if (e.key === 'End') { e.preventDefault(); selectTab(tabs.length - 1, true); }
    });
  });

  /* ---------- planejamento: escolher um serviço preenche a mensagem do WhatsApp ---------- */
  const plans = $$('.plan');
  const planCta = $('[data-plan-cta]');
  plans.forEach((p) => {
    p.addEventListener('click', () => {
      const wasOn = p.getAttribute('aria-pressed') === 'true';
      plans.forEach((o) => o.setAttribute('aria-pressed', 'false'));
      p.setAttribute('aria-pressed', String(!wasOn));
      planCta.href = waLink(wasOn ? WA_MESSAGES.planejamento : `Olá, Maria! Vim pelo site da Asas e tenho interesse no serviço: ${p.dataset.plan}.`);
    });
  });

  /* ---------- abertura suave de <details> (condições e FAQ) ---------- */
  $$('details').forEach((d) => {
    const summary = $('summary', d);
    const body = summary.nextElementSibling;
    summary.addEventListener('click', (e) => {
      if (reduceMotion || !body) return;
      e.preventDefault();
      if (d.open) {
        const h = body.offsetHeight;
        body.animate([{ height: `${h}px` }, { height: '0px' }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = () => { d.open = false; };
      } else {
        d.open = true;
        const h = body.offsetHeight;
        body.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
    });
  });

  /* ---------- brilho que segue o cursor nos cartões de contato ---------- */
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
     Movimento (GSAP + Lenis). Sem as bibliotecas ou com "reduzir movimento",
     a página fica completa e estática.
     ========================================================================== */
  const waFloat = $('.wa-float');
  const waBar = $('.wa-bar');
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (!hasGSAP || reduceMotion) {
    html.classList.remove('js');
    waFloat.classList.add('is-visible');
    waBar.classList.add('is-visible');
    $$('.wp').forEach((w) => w.classList.add('is-on'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  if (window.MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin);

  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const mm = gsap.matchMedia();

  // header: fundo ao rolar; some ao descer e volta ao subir
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
  ['servicos', 'planejamento', 'equipe', 'contato'].forEach((id) => {
    const sec = document.getElementById(id);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: (self) => navLinks.forEach((a) => a.classList.toggle('is-active', self.isActive && a.getAttribute('href') === `#${id}`)),
    });
  });

  // WhatsApp flutuante aparece depois da abertura
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'bottom 75%',
    onEnter: () => { waFloat.classList.add('is-visible'); waBar.classList.add('is-visible'); },
    onLeaveBack: () => { waFloat.classList.remove('is-visible'); waBar.classList.remove('is-visible'); },
  });

  // botões magnéticos (desktop)
  if (finePointer) {
    $$('.magnetic').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.45)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.45)' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.22);
        yTo((e.clientY - r.top - r.height / 2) * 0.3);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  // títulos por linha (rápido, dispara cedo)
  if (window.SplitText) {
    $$('.split').forEach((el) => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, {
          yPercent: 110,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        }),
      });
    });
  }

  // elementos que surgem
  gsap.set('[data-reveal]', { y: 26, autoAlpha: 0 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 94%',
    once: true,
    onEnter: (b) => gsap.to(b, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', stagger: 0.06, overwrite: true }),
  });

  // imagens com cortina
  $$('[data-clip]').forEach((el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      .fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' });
    if (!el.querySelector('.swap-img')) tl.from($('img', el), { scale: 1.25, duration: 1.6, ease: 'expo.out' }, '<0.1');
  });

  // parallax suave
  $$('[data-parallax]').forEach((img) => {
    const amt = parseFloat(img.dataset.parallax) || 8;
    gsap.fromTo(img, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // abertura: só um leve movimento de entrada (sem tela de carregamento)
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.hero__img', { scale: 1.12, duration: 2.2 }, 0)
    .from(['.hero__eyebrow', '.hero__title', '.hero__lead', '.hero__actions'], { y: 28, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.1);
  gsap.to('.hero__media', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // valores
  $$('.value').forEach((v) => {
    gsap.timeline({ scrollTrigger: { trigger: v, start: 'top 90%', once: true } })
      .from($('.value__line', v), { scaleX: 0, duration: 1.2, ease: 'expo.inOut' })
      .from($('.value__word > span', v), { yPercent: 110, duration: 1, ease: 'expo.out' }, '-=0.8')
      .from($('.value__icon', v), { scale: 0.5, autoAlpha: 0, duration: 0.9, ease: 'expo.out' }, '<');
  });

  // carimbo da história
  gsap.to('.stamp', { rotate: 90, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } });

  // Fran: persiana da janela abre a foto
  gsap.timeline({ scrollTrigger: { trigger: '.person--fran .window', start: 'top 80%', once: true } })
    .to('.window__shade', { yPercent: -101, duration: 1.4, ease: 'power3.inOut' })
    .from('.window__pane img', { scale: 1.2, duration: 1.8, ease: 'expo.out' }, '<0.2');

  // como funciona: rota de voo (desktop) / trilho vertical (celular). O texto dos passos fica sempre visível.
  const wps = $$('.wp');
  const setWp = (p) => wps.forEach((w, i) => w.classList.toggle('is-on', p >= i / (wps.length - 1) - 0.02));
  mm.add('(min-width: 1024px)', () => {
    const path = $('#stepsPath');
    const len = path.getTotalLength();
    path.style.setProperty('--len', len);
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.steps__route', start: 'top 80%', end: 'bottom 55%', scrub: 1, onUpdate: (s) => setWp(s.progress) } });
    tl.fromTo(path, { strokeDashoffset: len }, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0);
    if (window.MotionPathPlugin) tl.to('.route-plane', { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true }, ease: 'none', duration: 1 }, 0);
  });
  mm.add('(max-width: 1023px)', () => {
    gsap.fromTo('.steps__rail i', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.steps__list', start: 'top 75%', end: 'bottom 65%', scrub: true } });
  });

  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  fontsReady.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
