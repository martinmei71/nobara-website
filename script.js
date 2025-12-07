// Dark mode, navigation drawer, lightbox, download dialog and reactive gradient
(function () {
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  const navMenuButton = document.querySelector('.nav-menu-button');
  const navDrawer = document.querySelector('.nav-drawer');
  const navDrawerClose = document.querySelector('.nav-drawer__close');
  const navDrawerBackdrop = document.querySelector('.nav-drawer__backdrop');

  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox__img');
  const lightboxBackdrop = document.querySelector('.lightbox__backdrop');

  const downloadDialog = document.querySelector('.download-dialog');
  const downloadDialogBackdrop = document.querySelector('.download-dialog__backdrop');
  const downloadDialogIso = document.querySelector('.download-dialog__iso-value[data-field="iso"]');
  const downloadDialogSha = document.querySelector('.download-dialog__checksum[data-field="sha"]');
  const downloadDialogCopy = document.querySelector('.download-dialog__copy');
  const downloadDialogConfirm = document.querySelector('.download-dialog__confirm');

  // Theme: default is light. Only apply dark if stored explicitly.
  const storedTheme = window.localStorage.getItem('nobara-theme');
  if (storedTheme === 'dark') {
    body.classList.add('dark');
  } else if (storedTheme === 'light') {
    body.classList.remove('dark');
  }

  function toggleTheme() {
    const isDark = body.classList.toggle('dark');
    window.localStorage.setItem('nobara-theme', isDark ? 'dark' : 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Nav drawer
  function openDrawer() {
    if (!navDrawer || !navDrawerBackdrop) return;
    navDrawer.classList.add('open');
    navDrawerBackdrop.classList.add('open');
  }

  function closeDrawer() {
    if (!navDrawer || !navDrawerBackdrop) return;
    navDrawer.classList.remove('open');
    navDrawerBackdrop.classList.remove('open');
  }

  if (navMenuButton) {
    navMenuButton.addEventListener('click', openDrawer);
  }

  if (navDrawerClose) {
    navDrawerClose.addEventListener('click', closeDrawer);
  }

  if (navDrawerBackdrop) {
    navDrawerBackdrop.addEventListener('click', closeDrawer);
  }

  document.querySelectorAll('.nav-drawer__link').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // Lightbox for edition images
  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.querySelectorAll('.lightbox-trigger').forEach((img) => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  // Download dialog with checksum
  let pendingDownloadUrl = null;

  function openDownloadDialog(iso, sha, url) {
    if (!downloadDialog) return;
    pendingDownloadUrl = url;
    if (downloadDialogIso) downloadDialogIso.textContent = iso || '';
    if (downloadDialogSha) downloadDialogSha.textContent = sha || '';
    downloadDialog.classList.add('open');
    downloadDialog.setAttribute('aria-hidden', 'false');
  }

  function closeDownloadDialog() {
    if (!downloadDialog) return;
    downloadDialog.classList.remove('open');
    downloadDialog.setAttribute('aria-hidden', 'true');
    pendingDownloadUrl = null;
  }

  document.querySelectorAll('.download-btn').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      const iso = btn.getAttribute('data-iso');
      const sha = btn.getAttribute('data-sha');
      const url = btn.getAttribute('data-url');
      openDownloadDialog(iso, sha, url);
    });
  });

  if (downloadDialogBackdrop) {
    downloadDialogBackdrop.addEventListener('click', closeDownloadDialog);
  }

  if (downloadDialogCopy && downloadDialogSha) {
    downloadDialogCopy.addEventListener('click', () => {
      const text = downloadDialogSha.textContent || '';
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(text.trim()).catch(() => {});
    });
  }

  if (downloadDialogConfirm) {
    downloadDialogConfirm.addEventListener('click', () => {
      if (pendingDownloadUrl) {
        window.open(pendingDownloadUrl, '_blank', 'noopener');
      }
      closeDownloadDialog();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
      closeDownloadDialog();
      closeDrawer();
    }
  });

  // Subtle reactive background gradient
  const rootEl = document.documentElement;
  let bgMoveRaf = null;

  function updateBgPosition(evt) {
    const x = (evt.clientX / window.innerWidth) * 100;
    const y = (evt.clientY / window.innerHeight) * 100;
    rootEl.style.setProperty('--bg-grad-x', x.toFixed(1) + '%');
    rootEl.style.setProperty('--bg-grad-y', y.toFixed(1) + '%');
  }

  window.addEventListener('pointermove', (evt) => {
    if (bgMoveRaf) return;
    bgMoveRaf = window.requestAnimationFrame(() => {
      updateBgPosition(evt);
      bgMoveRaf = null;
    });
  });

  window.addEventListener('pointerleave', () => {
    rootEl.style.setProperty('--bg-grad-x', '18%');
    rootEl.style.setProperty('--bg-grad-y', '0%');
  });
})();
