/**
 * Sayed Mohamed - Personal Portfolio Website
 * Business Process Automation & Analytics Consultant
 * Core JavaScript: Multilingual (EN/AR), Themes (Dark/Light), Typing Effect,
 * Modals, ROI Calculator, and Interactions.
 */

// Global state
let currentLang = localStorage.getItem('sayed_portfolio_lang') || 'en';
let currentTheme = localStorage.getItem('sayed_portfolio_theme') || 'dark';
let typingTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  initScrollProgressBar();
  initHeaderScroll();
  initMobileMenu();
  initActiveNav();
  initTypingEffect();
  initScrollReveal();
  initStatCounters();
  initSkillFilters();
  initProjectModals();
  initProjectCategoryFilters();
  initRoiCalculator();
  initContactForm();
  initClipboardUtils();
  initBackToTop();
  initCvModal();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Dark & Light)
   -------------------------------------------------------------------------- */
function initTheme() {
  setTheme(currentTheme);

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    });
  });
}

function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('sayed_portfolio_theme', theme);

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    if (theme === 'light') {
      btn.innerHTML = '<i class="far fa-sun" style="color: #F59E0B;"></i>';
      btn.setAttribute('title', currentLang === 'ar' ? 'التحويل للمظهر الليلي' : 'Switch to Dark Mode');
      btn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      btn.innerHTML = '<i class="far fa-moon" style="color: #38BDF8;"></i>';
      btn.setAttribute('title', currentLang === 'ar' ? 'التحويل للمظهر النهاري' : 'Switch to Light Mode');
      btn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  });
}

/* --------------------------------------------------------------------------
   2. Multilingual System (EN / AR) & RTL Support
   -------------------------------------------------------------------------- */
function initLanguage() {
  applyLanguage(currentLang);

  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      if (selectedLang && selectedLang !== currentLang) {
        applyLanguage(selectedLang);
      }
    });
  });
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('sayed_portfolio_lang', lang);

  // Set HTML attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Update switcher buttons UI
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Translate all text nodes with data-i18n
  if (typeof translations !== 'undefined' && translations[lang]) {
    const dict = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        // Support HTML markup if needed (e.g. bold or line breaks)
        if (dict[key].includes('<') && dict[key].includes('>')) {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // Translate input placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Update tooltips and ARIA labels
    const waFloat = document.getElementById('whatsappFloatBtn');
    if (waFloat) waFloat.setAttribute('title', dict.waTooltip || 'Chat on WhatsApp');

    const liFloat = document.getElementById('linkedinFloatBtn');
    if (liFloat) liFloat.setAttribute('title', dict.liTooltip || 'LinkedIn');
  }

  // Restart typing effect with new language strings
  initTypingEffect();

  // Re-run ROI calculator display
  if (typeof updateRoiDisplay === 'function') {
    updateRoiDisplay();
  }
}

/* --------------------------------------------------------------------------
   3. Scroll Progress Indicator
   -------------------------------------------------------------------------- */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* --------------------------------------------------------------------------
   4. Hero Typing Animation (Language-Aware)
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const textElement = document.getElementById('heroTyping');
  if (!textElement) return;

  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }

  const phrasesEn = [
    "AI Automation Architect",
    "n8n Workflow Specialist",
    "Autonomous AI Agents Developer",
    "Power BI & HR Analytics Expert",
    "Business Process Optimization Consultant"
  ];

  const phrasesAr = [
    "مهندس أتمتة العمليات بالذكاء الاصطناعي",
    "خبير تصميم مسارات العمل على n8n",
    "مطور وكلاء الذكاء الاصطناعي",
    "استشاري تحليلات الموارد البشرية وPower BI",
    "استشاري تطوير وتحسين العمليات التشغيلية"
  ];

  const phrases = currentLang === 'ar' ? phrasesAr : phrasesEn;
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      textElement.textContent = currentPhrase.substring(0, charIndex);
    } else {
      charIndex++;
      textElement.textContent = currentPhrase.substring(0, charIndex);
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2200; // Pause at end of sentence
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400; // Pause before new sentence
    }

    typingTimeout = setTimeout(type, typeSpeed);
  }

  textElement.textContent = "";
  type();
}

/* --------------------------------------------------------------------------
   5. Header Scroll Effect & Mobile Drawer
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggleBtn || !navLinks) return;

  const toggleMenu = () => {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      navLinks.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
      document.body.style.overflow = '';
    } else {
      navLinks.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
      document.body.style.overflow = 'hidden';
    }
  };

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   6. Active Nav Link on Scroll
   -------------------------------------------------------------------------- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '-80px 0px -40% 0px'
  });

  sections.forEach(sec => observer.observe(sec));
}

/* --------------------------------------------------------------------------
   7. Scroll Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   8. Animated Stat Counters
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const counterElements = document.querySelectorAll('[data-counter-target]');
  if (!counterElements.length) return;

  const runCounter = (el) => {
    const target = parseInt(el.getAttribute('data-counter-target'), 10);
    const duration = 1600;
    const startTimestamp = performance.now();

    const step = (now) => {
      const elapsed = now - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * target);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   9. Skill Category Filter Chips
   -------------------------------------------------------------------------- */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   10. Case Study & Architecture Modal (Multilingual Support)
   -------------------------------------------------------------------------- */
function initProjectModals() {
  const modalOverlay = document.getElementById('projectModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const detailButtons = document.querySelectorAll('[data-project-id]');
  if (!modalOverlay || !closeBtn) return;

  const openModal = (projectId) => {
    if (typeof projectDetailsData === 'undefined' || !projectDetailsData[projectId]) return;

    const dataObj = projectDetailsData[projectId];
    const data = dataObj[currentLang] || dataObj['en'];
    if (!data) return;

    document.getElementById('modalCategory').textContent = data.category;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalProblem').textContent = data.problem;
    document.getElementById('modalSolution').textContent = data.solution;
    document.getElementById('modalImpact').textContent = data.impact;

    const techContainer = document.getElementById('modalTechList');
    techContainer.innerHTML = data.technologies
      .map(t => `<span class="tech-tag" style="color: var(--accent-cyan); border-color: var(--border-accent);">${t}</span>`)
      .join('');

    const stepsContainer = document.getElementById('modalStepsList');
    stepsContainer.innerHTML = data.flowSteps
      .map(s => `
        <div class="modal-step-item">
          <span class="step-num">${s.step}</span>
          <div class="step-content">
            <strong>${s.title}</strong>
            <p>${s.desc}</p>
          </div>
        </div>
      `).join('');

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-project-id');
      openModal(id);
    });
  });

  closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

function initProjectCategoryFilters() {
  // Can be expanded if project filter buttons are added
}

/* --------------------------------------------------------------------------
   11. Interactive HR Automation ROI Calculator
   -------------------------------------------------------------------------- */
let updateRoiDisplay = null;

function initRoiCalculator() {
  const teamSizeSlider = document.getElementById('teamSizeSlider');
  const hoursSlider = document.getElementById('hoursSlider');
  const teamSizeVal = document.getElementById('teamSizeVal');
  const hoursVal = document.getElementById('hoursVal');
  const hoursSavedResult = document.getElementById('hoursSavedResult');
  const costSavingsResult = document.getElementById('costSavingsResult');
  const efficiencyGainResult = document.getElementById('efficiencyGainResult');

  if (!teamSizeSlider || !hoursSlider) return;

  updateRoiDisplay = () => {
    const teamSize = parseInt(teamSizeSlider.value, 10);
    const weeklyHours = parseInt(hoursSlider.value, 10);

    teamSizeVal.textContent = teamSize;
    hoursVal.textContent = currentLang === 'ar' ? `${weeklyHours} ساعة/أسبوع` : `${weeklyHours} hrs/week`;

    const automatedFraction = 0.65;
    const weeklyHoursSaved = Math.round(weeklyHours * automatedFraction);
    const yearlyHoursSaved = weeklyHoursSaved * 50;
    const estimatedYearlySavings = yearlyHoursSaved * 30;
    const efficiencyRate = Math.min(85, Math.round(45 + (teamSize / 40)));

    hoursSavedResult.textContent = currentLang === 'ar' ? `${yearlyHoursSaved.toLocaleString()} ساعة` : `${yearlyHoursSaved.toLocaleString()} hrs`;
    costSavingsResult.textContent = `$${estimatedYearlySavings.toLocaleString()}`;
    efficiencyGainResult.textContent = currentLang === 'ar' ? `+${efficiencyRate}% تسريع` : `+${efficiencyRate}% Faster`;
  };

  teamSizeSlider.addEventListener('input', updateRoiDisplay);
  hoursSlider.addEventListener('input', updateRoiDisplay);

  updateRoiDisplay();
}

/* --------------------------------------------------------------------------
   12. Contact Form Handling, Draft Persistence & Feedback
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const companyInput = document.getElementById('contactCompany');
  const messageInput = document.getElementById('contactMessage');
  const submitBtn = document.getElementById('contactSubmitBtn');

  const savedDraft = localStorage.getItem('sayed_contact_draft');
  if (savedDraft) {
    try {
      const parsed = JSON.parse(savedDraft);
      if (parsed.name) nameInput.value = parsed.name;
      if (parsed.email) emailInput.value = parsed.email;
      if (parsed.company) companyInput.value = parsed.company;
      if (parsed.message) messageInput.value = parsed.message;
    } catch (e) {}
  }

  const saveDraft = () => {
    const draft = {
      name: nameInput.value,
      email: emailInput.value,
      company: companyInput.value,
      message: messageInput.value
    };
    localStorage.setItem('sayed_contact_draft', JSON.stringify(draft));
  };

  [nameInput, emailInput, companyInput, messageInput].forEach(inp => {
    inp.addEventListener('input', saveDraft);
  });

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    document.querySelectorAll('.form-error-msg').forEach(el => el.classList.remove('visible'));
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));

    if (!nameInput.value.trim()) {
      showError(nameInput, currentLang === 'ar' ? 'يرجى كتابة الاسم' : 'Please enter your name');
      hasError = true;
    }

    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      showError(emailInput, currentLang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
      hasError = true;
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showError(messageInput, currentLang === 'ar' ? 'يرجى كتابة تفاصيل مشروعك (10 أحرف على الأقل)' : 'Please enter a message (at least 10 characters)');
      hasError = true;
    }

    if (hasError) return;

    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = currentLang === 'ar' ?
      '<i class="fas fa-circle-notch fa-spin"></i> جاري إرسال الرسالة...' :
      '<i class="fas fa-circle-notch fa-spin"></i> Sending Inquiry...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      form.reset();
      localStorage.removeItem('sayed_contact_draft');

      const successMsg = currentLang === 'ar' ?
        'تم إرسال رسالتك بنجاح! سيقوم الأستاذ سيد محمد بالرد عليك قريباً.' :
        'Message sent successfully! Sayed Mohamed will get back to you promptly.';

      showToast(successMsg);
    }, 1200);
  });

  function showError(inputEl, msg) {
    inputEl.classList.add('error');
    const errEl = inputEl.parentElement.querySelector('.form-error-msg');
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.add('visible');
    }
  }
}

/* --------------------------------------------------------------------------
   13. Clipboard Utility & Toast System
   -------------------------------------------------------------------------- */
function initClipboardUtils() {
  const copyButtons = document.querySelectorAll('[data-copy-target]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy-target');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const msg = currentLang === 'ar' ? `تم النسخ للحافظة: ${textToCopy}` : `Copied to clipboard: ${textToCopy}`;
        showToast(msg);
      }).catch(() => {
        showToast(textToCopy);
      });
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-notification';
    toast.innerHTML = `<i class="fas fa-check-circle toast-icon"></i> <span id="toastMsgText"></span>`;
    document.body.appendChild(toast);
  }

  const textEl = document.getElementById('toastMsgText');
  if (textEl) textEl.textContent = message;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* --------------------------------------------------------------------------
   14. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const bttBtn = document.getElementById('backToTopBtn');
  if (!bttBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      bttBtn.classList.add('visible');
    } else {
      bttBtn.classList.remove('visible');
    }
  }, { passive: true });

  bttBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   15. Executive CV Preview Modal
   -------------------------------------------------------------------------- */
function initCvModal() {
  const cvButtons = document.querySelectorAll('.cv-trigger-btn');
  const cvModal = document.getElementById('cvModal');
  const closeCvBtn = document.getElementById('closeCvModalBtn');
  const printCvBtn = document.getElementById('printCvBtn');

  if (!cvModal || !cvButtons.length) return;

  cvButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      cvModal.classList.add('active');
      cvModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeCv = () => {
    cvModal.classList.remove('active');
    cvModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeCvBtn) closeCvBtn.addEventListener('click', closeCv);

  cvModal.addEventListener('click', (e) => {
    if (e.target === cvModal) closeCv();
  });

  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModal.classList.contains('active')) {
      closeCv();
    }
  });
}
