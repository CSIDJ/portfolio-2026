(function () {
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
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
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

    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target)) {
        setOpen(false);
      }
    });
  });
})();
