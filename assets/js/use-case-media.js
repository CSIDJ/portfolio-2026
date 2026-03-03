(function () {
  const disclaimerText =
    'Les données affichées (prix, indicateurs et informations) sont fournies à titre d’illustration et peuvent différer des données réelles.';

  const mediaBlocks = document.querySelectorAll('.demo-shot-block, .demo-video-block');
  mediaBlocks.forEach((block) => {
    const legacyInlineNote = block.querySelector('.media-legal-note');
    if (legacyInlineNote) legacyInlineNote.remove();

    const existingBelow = block.nextElementSibling;
    if (existingBelow && existingBelow.classList.contains('media-legal-note')) return;

    const note = document.createElement('p');
    note.className = 'media-legal-note';
    note.textContent = disclaimerText;
    block.insertAdjacentElement('afterend', note);
  });

  const sliders = document.querySelectorAll('[data-shot-slider]');
  const pageLang = (document.documentElement.lang || 'en').toLowerCase();
  const dotLabelPrefix = pageLang.startsWith('fr') ? 'Afficher la capture' : 'Show screenshot';

  const useCaseVideos = document.querySelectorAll('.demo-video-block video, video.use-case-video');
  useCaseVideos.forEach((video) => {
    // Enforce loop + autoplay behavior consistently across browsers/players.
    video.setAttribute('autoplay', '');
    video.autoplay = true;
    video.muted = true;
    video.defaultMuted = true;
    if (!video.hasAttribute('playsinline')) video.setAttribute('playsinline', '');

    video.setAttribute('loop', '');
    video.loop = true;

    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Ignore autoplay restrictions; manual play remains available.
        });
      }
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener('loadeddata', tryPlay, { once: true });
    }

    video.addEventListener('ended', () => {
      video.currentTime = 0;
      tryPlay();
    });
  });

  sliders.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.shot-slide'));
    const prevButton = slider.querySelector('[data-slide-prev]');
    const nextButton = slider.querySelector('[data-slide-next]');
    const dotsHost = slider.querySelector('[data-slide-dots]');

    if (!slides.length) return;

    let currentIndex = 0;
    const dots = [];

    const setActiveSlide = (targetIndex) => {
      currentIndex = (targetIndex + slides.length) % slides.length;

      slides.forEach((slide, index) => {
        slide.classList.toggle('is-active', index === currentIndex);
      });

      dots.forEach((dot, index) => {
        const active = index === currentIndex;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
    };

    if (dotsHost) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `${dotLabelPrefix} ${index + 1}`);
        dot.addEventListener('click', () => setActiveSlide(index));
        dotsHost.appendChild(dot);
        dots.push(dot);
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        setActiveSlide(currentIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        setActiveSlide(currentIndex + 1);
      });
    }

    setActiveSlide(0);
  });
})();
