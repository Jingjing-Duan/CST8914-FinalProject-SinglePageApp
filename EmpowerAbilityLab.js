// ======================================================
// Person 1: SPA navigation, page title, focus, history
// ======================================================

function initSPA() {
  const pageLinks = document.querySelectorAll('[data-page]');
  const sections = document.querySelectorAll('.page-section');
  const navLinks = document.querySelectorAll('.nav-link');
  const navToggleBtn = document.getElementById('navToggleBtn');
  const navWrapper = document.getElementById('primary-nav');
  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.getElementById('main-content');
  const validPages = ['home', 'services', 'contact'];

  function getPageTitle(pageId) {
    const titles = {
      home: 'Empower Ability Labs – Community Events & Booking',
      services: 'Services - Empower Ability Labs',
      contact: 'Schedule a Call - Empower Ability Labs'
    };
    return titles[pageId] || 'Empower Ability Labs';
  }

  if (skipLink && mainContent) {
    skipLink.addEventListener('click', event => {
      event.preventDefault();
      mainContent.focus();
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  function updateCurrentNav(pageId) {
    navLinks.forEach(link => {
      if (link.dataset.page === pageId) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function showPage(pageId, shouldPushState = true) {
    const targetSection = document.getElementById(pageId);

    if (!targetSection) {
      return;
    }

    sections.forEach(section => {
      section.hidden = true;
    });

    targetSection.hidden = false;
    document.title = getPageTitle(pageId);
    updateCurrentNav(pageId);

    if (shouldPushState) {
      history.pushState({ page: pageId }, '', `#${pageId}`);
    }

    window.scrollTo({ top: 0, behavior: "auto" });
    targetSection.focus({ preventScroll: true });

    if (navWrapper && window.innerWidth < 768) {
      navWrapper.classList.remove('nav-open');
      if (navToggleBtn) {
        navToggleBtn.setAttribute('aria-expanded', 'false');
      }
    }
  }

  pageLinks.forEach(link => {
    link.addEventListener('click', event => {
      const pageId = link.dataset.page;

      if (!pageId) {
        return;
      }

      event.preventDefault();
      showPage(pageId, true);
    });
  });

  window.addEventListener('popstate', event => {
    const pageId = event.state?.page || window.location.hash.replace('#', '') || 'home';
    showPage(pageId, false);
  });

  if (navToggleBtn && navWrapper) {
    navToggleBtn.addEventListener('click', () => {
      const expanded = navToggleBtn.getAttribute('aria-expanded') === 'true';
      navToggleBtn.setAttribute('aria-expanded', String(!expanded));
      navWrapper.classList.toggle('nav-open');
    });
  }

  let initialPage = window.location.hash.replace('#', '') || 'home';

  if (!validPages.includes(initialPage)) {
    initialPage = 'home';
  }

  history.replaceState({ page: initialPage }, '', `#${initialPage}`);
  showPage(initialPage, false);
}

// ======================================================
// Person 3: Show / Hide details
// ======================================================

function initShowHide() {
  const toggleButtons = document.querySelectorAll('.toggle-btn');

  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const contentId = button.getAttribute('aria-controls');
      const content = document.getElementById(contentId);

      button.setAttribute('aria-expanded', String(!expanded));

      if (content) {
        content.hidden = expanded;
      }

      button.textContent = expanded ? 'Show details' : 'Hide details';
    });
  });
}

// ======================================================
// Person 3: Switch
// ======================================================

function initSwitch() {
  const switchBtn = document.getElementById('emailUpdatesSwitch');

  if (!switchBtn) {
    return;
  }

  function updateSwitchState(isOn) {
    switchBtn.setAttribute('aria-checked', String(isOn));
    switchBtn.classList.toggle('switch-on', isOn);

    const switchText = switchBtn.querySelector('.switch-text');
    if (switchText) {
      switchText.textContent = isOn ? 'On' : 'Off';
    }
  }

  switchBtn.addEventListener('click', () => {
    const isOn = switchBtn.getAttribute('aria-checked') === 'true';
    updateSwitchState(!isOn);
  });

  switchBtn.addEventListener('keydown', event => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      const isOn = switchBtn.getAttribute('aria-checked') === 'true';
      updateSwitchState(!isOn);
    }
  });
}

// ======================================================
// Person 3: Modal
// ======================================================

function initModal() {
  const openButtons = document.querySelectorAll('[data-modal]');
  const closeButtons = document.querySelectorAll('.close-modal-btn');
  const overlay = document.getElementById('modalOverlay');
  let activeModal = null;
  let lastFocusedElement = null;

  function openModal(modal) {
    if (!modal) {
      return;
    }

    lastFocusedElement = document.activeElement;
    activeModal = modal;

    if (overlay) {
      overlay.hidden = false;
    }

    modal.hidden = false;

    const closeBtn = modal.querySelector('.close-modal-btn');
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  function closeModal() {
    if (!activeModal) {
      return;
    }

    activeModal.hidden = true;

    if (overlay) {
      overlay.hidden = true;
    }

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }

    activeModal = null;
  }

  openButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      openModal(modal);
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });

  if (overlay) {
    overlay.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && activeModal) {
      closeModal();
    }
  });
}

// ======================================================
// Person 4: Form validation and messages
// ======================================================

function initForm() {
  const form = document.getElementById('bookingForm');
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const formMessage = document.getElementById('formMessage');

  if (!form || !emailInput || !emailError || !formMessage) {
    return;
  }

  function clearErrors() {
    emailError.textContent = '';
    emailInput.classList.remove('input-error');
    formMessage.textContent = '';
    formMessage.classList.remove('message-success', 'message-error');
  }

  function showEmailError(message) {
    emailError.textContent = message;
    emailInput.classList.add('input-error');
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    clearErrors();

    const emailValue = emailInput.value.trim();

    if (!emailValue) {
      showEmailError('Email is required.');
      formMessage.textContent = 'Please fix the errors in the form.';
      formMessage.classList.add('message-error');
      emailInput.focus();
      return;
    }

    if (!emailInput.checkValidity()) {
      showEmailError('Please enter a valid email address.');
      formMessage.textContent = 'Please fix the errors in the form.';
      formMessage.classList.add('message-error');
      emailInput.focus();
      return;
    }

    formMessage.textContent = 'Thank you! Your request has been submitted.';
    formMessage.classList.add('message-success');
    form.reset();

    const switchBtn = document.getElementById('emailUpdatesSwitch');
    if (switchBtn) {
      switchBtn.setAttribute('aria-checked', 'false');
      switchBtn.classList.remove('switch-on');
      const switchText = switchBtn.querySelector('.switch-text');
      if (switchText) {
        switchText.textContent = 'Off';
      }
    }
  });
}

// ======================================================
// Main entry
// ======================================================

function knowledgeRunner() {
  initSPA();        // Person 1
  initShowHide();   // Person 3
  initSwitch();     // Person 3
  initModal();      // Person 3
  initForm();       // Person 4
}

knowledgeRunner();