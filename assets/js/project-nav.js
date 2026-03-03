(function () {
  let soonToastTimer = null;
  let soonContentTimer = null;
  const caseStudiesFrPath = window.location.pathname.includes('/projects/')
    ? '../case-studies-fr.html'
    : './case-studies-fr.html';
  const redirectToCaseStudiesFr = () => {
    window.location.href = caseStudiesFrPath;
  };
  const syncPageContentMinHeight = () => {
    const sidebar = document.querySelector('.project-sidebar');
    const pageContent = document.querySelector('.page-content');
    if (!sidebar || !pageContent) return;

    if (window.matchMedia('(max-width: 980px)').matches) {
      pageContent.style.minHeight = '';
      return;
    }

    const sidebarHeight = Math.ceil(sidebar.getBoundingClientRect().height);
    pageContent.style.minHeight = sidebarHeight > 0 ? `${sidebarHeight}px` : '';
  };

  const showComingSoonToast = (message) => {
    if (!message) return;

    let toast = document.querySelector('.coming-soon-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'coming-soon-toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('is-visible');

    if (soonToastTimer) {
      clearTimeout(soonToastTimer);
    }
    soonToastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
      redirectToCaseStudiesFr();
    }, 3000);
  };

  const showComingSoonInContent = (message) => {
    const pageContent = document.querySelector('.page-content');
    if (!pageContent) return false;
    const sidebar = document.querySelector('.project-sidebar');

    let canvas = pageContent.querySelector('.coming-soon-canvas');
    if (!canvas) {
      canvas = document.createElement('div');
      canvas.className = 'coming-soon-canvas';
      pageContent.appendChild(canvas);
    }

    const sidebarHeight = sidebar
      ? Math.ceil(sidebar.getBoundingClientRect().height)
      : 0;
    canvas.style.minHeight = window.matchMedia('(max-width: 980px)').matches
      ? '260px'
      : `${Math.max(420, sidebarHeight)}px`;

    const pill = document.createElement('p');
    pill.className = 'media-status-pill';
    pill.textContent = message;
    canvas.replaceChildren(pill);

    pageContent.classList.add('is-coming-soon-mode');

    if (soonContentTimer) {
      clearTimeout(soonContentTimer);
    }
    soonContentTimer = window.setTimeout(() => {
      redirectToCaseStudiesFr();
    }, 3000);

    return true;
  };

  const soonLinks = document.querySelectorAll('a.uc-coming-soon');
  soonLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const fallback =
        document.documentElement.lang === 'fr'
          ? 'En cours de réalisation'
          : 'In progress';
      const message = link.dataset.soonText || fallback;
      if (!showComingSoonInContent(message)) {
        showComingSoonToast(message);
      }
    });
  });

  syncPageContentMinHeight();
  window.addEventListener('load', syncPageContentMinHeight);
  window.addEventListener('resize', syncPageContentMinHeight);

  const menus = document.querySelectorAll('.uc-menu');
  menus.forEach((menu) => {
    const toggle = menu.querySelector('.uc-toggle');
    const list = menu.querySelector('.uc-list');
    if (!toggle || !list) return;

    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    const listId = 'uc-list-' + Math.random().toString(36).slice(2, 10);
    list.id = listId;
    toggle.setAttribute('aria-controls', listId);

    const setOpen = (open) => {
      const wasOpen = menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (wasOpen !== open) {
        window.requestAnimationFrame(syncPageContentMinHeight);
      }
    };

    const isProjectPage = window.location.pathname.includes('/projects/');
    setOpen(isProjectPage);

    const toggleMenu = () => {
      setOpen(!menu.classList.contains('is-open'));
    };

    toggle.addEventListener('click', (event) => {
      if (event.target.closest('.uc-parent-link')) return;
      toggleMenu();
    });
    toggle.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleMenu();
      }
    });

  });
})();
