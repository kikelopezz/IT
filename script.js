/* ══════════════════════════════════════════════════════
   script.js — IT & Soluciones
   ════════════════════════════════════════════════════

   CONFIGURACIÓN EMAILJS
   ─────────────────────
   1. Crea una cuenta en https://www.emailjs.com (plan gratuito: 200 emails/mes)
   2. En tu dashboard de EmailJS:
      a) Añade un Email Service (Gmail, Outlook, etc.) → copia el SERVICE_ID
      b) Crea un Email Template → copia el TEMPLATE_ID
         Variables que usa este formulario (ponlas en tu template):
           {{from_name}}   — Nombre del remitente
           {{empresa}}     — Empresa
           {{reply_to}}    — Email del remitente
           {{telefono}}    — Teléfono
           {{servicio}}    — Servicio seleccionado
           {{mensaje}}     — Descripción del problema
      c) Ve a Account → API Keys → copia tu PUBLIC_KEY
   3. Sustituye los tres valores en EMAILJS_CONFIG más abajo
   ══════════════════════════════════════════════════════ */

const EMAILJS_CONFIG = {
  PUBLIC_KEY:  'TU_PUBLIC_KEY_AQUI',   // ← pega aquí tu Public Key
  SERVICE_ID:  'TU_SERVICE_ID_AQUI',   // ← pega aquí tu Service ID
  TEMPLATE_ID: 'TU_TEMPLATE_ID_AQUI',  // ← pega aquí tu Template ID
};

/* ══════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initEmailJS();
  initNavbar();
  initMobileMenu();
  initRevealAnimations();
  initTerminalAnimation();
  initContactForm();
  initBackToTop();
  initLucideIcons();
  setFooterYear();
});

/* ══════════════════════════════════════════════════════
   EMAILJS INIT
══════════════════════════════════════════════════════ */
function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }
}

/* ══════════════════════════════════════════════════════
   LUCIDE ICONS
══════════════════════════════════════════════════════ */
function initLucideIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/* ══════════════════════════════════════════════════════
   NAVBAR — scroll effect
══════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ══════════════════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ══════════════════════════════════════════════════════
   REVEAL ANIMATIONS (IntersectionObserver)
══════════════════════════════════════════════════════ */
function initRevealAnimations() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════
   TERMINAL ANIMATION
══════════════════════════════════════════════════════ */
function initTerminalAnimation() {
  const cmdEl    = document.getElementById('terminalText');
  const outputEl = document.getElementById('terminalOutput');
  if (!cmdEl || !outputEl) return;

  const sequences = [
    {
      cmd: 'diagnostico --sistema',
      lines: [
        { text: '✓ Conectividad de red: OK',         cls: 't-output-ok' },
        { text: '✓ Copias de seguridad: Activas',     cls: 't-output-ok' },
        { text: '⚠ Actualizaciones pendientes: 3',    cls: 't-output-warn' },
        { text: '✓ Antivirus: Actualizado',           cls: 't-output-ok' },
        { text: '',                                   cls: 't-output-info' },
        { text: '→ Iniciando resolución automática…', cls: 't-output-info' },
      ],
    },
    {
      cmd: 'backup --verificar --ultimo',
      lines: [
        { text: '✓ Último backup: hace 6 horas',       cls: 't-output-ok' },
        { text: '✓ Integridad de datos: 100%',          cls: 't-output-ok' },
        { text: '✓ Almacenamiento en nube: Sincronizado', cls: 't-output-ok' },
        { text: '',                                    cls: 't-output-info' },
        { text: '→ Tus datos están protegidos.',       cls: 't-output-info' },
      ],
    },
    {
      cmd: 'seguridad --escanear',
      lines: [
        { text: '✓ Puertos abiertos: 80, 443 (OK)',    cls: 't-output-ok' },
        { text: '✓ Firewall activo: Configurado',       cls: 't-output-ok' },
        { text: '⚠ Contraseñas débiles detectadas: 2', cls: 't-output-warn' },
        { text: '',                                    cls: 't-output-info' },
        { text: '→ Recomendando actualización…',       cls: 't-output-info' },
      ],
    },
  ];

  let seqIndex = 0;

  async function runSequence() {
    const seq = sequences[seqIndex % sequences.length];
    seqIndex++;

    // Clear
    cmdEl.textContent = '';
    outputEl.innerHTML = '';

    // Type command
    await typeText(cmdEl, seq.cmd, 55);
    await sleep(400);

    // Print output lines
    for (const line of seq.lines) {
      await sleep(250);
      const div = document.createElement('div');
      div.className = `t-output-line ${line.cls}`;
      div.textContent = line.text;
      outputEl.appendChild(div);
    }

    await sleep(3000);

    // Erase
    await eraseText(cmdEl);
    await sleep(400);
    outputEl.innerHTML = '';
    await sleep(500);

    runSequence();
  }

  runSequence();
}

function typeText(el, text, speed = 60) {
  return new Promise(resolve => {
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

function eraseText(el, speed = 30) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      el.textContent = el.textContent.slice(0, -1);
      if (!el.textContent) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ══════════════════════════════════════════════════════
   CONTACT FORM — validación + envío EmailJS
══════════════════════════════════════════════════════ */
function initContactForm() {
  const form       = document.getElementById('contactForm');
  const successEl  = document.getElementById('formSuccess');
  const resetBtn   = document.getElementById('resetForm');
  const submitBtn  = document.getElementById('submitBtn');
  if (!form) return;

  // Live validation — limpia error al escribir
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => clearFieldError(el));
    el.addEventListener('change', () => clearFieldError(el));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(form)) return;

    setLoading(submitBtn, true);

    const data = {
      from_name: form.nombre.value.trim(),
      empresa:   form.empresa.value.trim() || '—',
      reply_to:  form.email.value.trim(),
      telefono:  form.telefono.value.trim() || '—',
      servicio:  form.servicio.options[form.servicio.selectedIndex].text,
      mensaje:   form.descripcion.value.trim(),
    };

    try {
      if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY !== 'TU_PUBLIC_KEY_AQUI') {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          data
        );
      } else {
        // MODO DEMO: EmailJS no configurado → simula envío
        console.log('📧 [DEMO] Datos del formulario:', data);
        await sleep(1200); // simula latencia de red
      }

      // Éxito
      form.hidden      = true;
      successEl.hidden = false;

    } catch (err) {
      console.error('Error al enviar:', err);
      showGlobalError(submitBtn, 'Hubo un error al enviar. Prueba por WhatsApp o email directo.');
    } finally {
      setLoading(submitBtn, false);
    }
  });

  resetBtn?.addEventListener('click', () => {
    form.reset();
    form.hidden      = false;
    successEl.hidden = true;
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  });
}

/* Validación */
function validateForm(form) {
  let valid = true;

  const nombre = form.nombre.value.trim();
  if (!nombre) {
    setFieldError('nombre', 'El nombre es obligatorio.');
    valid = false;
  }

  const email = form.email.value.trim();
  if (!email) {
    setFieldError('email', 'El email es obligatorio.');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError('email', 'Introduce un email válido.');
    valid = false;
  }

  const servicio = form.servicio.value;
  if (!servicio) {
    setFieldError('servicio', 'Selecciona un servicio.');
    valid = false;
  }

  const descripcion = form.descripcion.value.trim();
  if (!descripcion || descripcion.length < 10) {
    setFieldError('descripcion', 'Describe brevemente tu situación (mín. 10 caracteres).');
    valid = false;
  }

  return valid;
}

function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(`err-${fieldId}`);
  if (field) field.classList.add('error');
  if (err)   err.textContent = message;
}

function clearFieldError(el) {
  el.classList.remove('error');
  const err = document.getElementById(`err-${el.id}`);
  if (err) err.textContent = '';
}

function setLoading(btn, loading) {
  const textEl    = btn.querySelector('.btn-text');
  const loadingEl = btn.querySelector('.btn-loading');
  btn.disabled    = loading;

  if (textEl)    textEl.hidden    = loading;
  if (loadingEl) loadingEl.hidden = !loading;
}

function showGlobalError(btn, message) {
  let el = btn.parentElement.querySelector('.global-form-error');
  if (!el) {
    el = document.createElement('p');
    el.className = 'form-error global-form-error';
    el.style.textAlign = 'center';
    btn.parentElement.insertBefore(el, btn.nextSibling);
  }
  el.textContent = message;
}

/* ══════════════════════════════════════════════════════
   BACK TO TOP
══════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════════════════
   FOOTER YEAR
══════════════════════════════════════════════════════ */
function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
