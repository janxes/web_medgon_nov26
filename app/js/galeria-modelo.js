/**
 * Galería Interactiva de Presentación para Modelos Medgón Passivhaus
 * Permite navegación fluida entre fotos de taller, renders y planos técnicos,
 * con soporte de miniaturas, botones prev/next, teclado, presentación automática y visor a pantalla completa.
 */

(function () {
  'use strict';

  window.initModeloGallery = function (options) {
    var images = options.images || [];
    if (!images.length) return;

    var currentIndex = 0;
    var autoPlayInterval = null;
    var isPlaying = false;

    // DOM Elements
    var mainImg = document.getElementById('gallery-main-image');
    var captionTitle = document.getElementById('gallery-caption-title');
    var captionDesc = document.getElementById('gallery-caption-desc');
    var counterEl = document.getElementById('gallery-counter');
    var btnPrev = document.getElementById('gallery-btn-prev');
    var btnNext = document.getElementById('gallery-btn-next');
    var btnPlay = document.getElementById('gallery-btn-play');
    var btnFullscreen = document.getElementById('gallery-btn-fullscreen');
    var thumbsContainer = document.getElementById('gallery-thumbnails');
    var lightbox = document.getElementById('gallery-lightbox');
    var lightboxImg = document.getElementById('lightbox-image');
    var lightboxTitle = document.getElementById('lightbox-title');
    var lightboxDesc = document.getElementById('lightbox-desc');
    var lightboxClose = document.getElementById('lightbox-close');
    var lightboxPrev = document.getElementById('lightbox-prev');
    var lightboxNext = document.getElementById('lightbox-next');

    function updateView(index, smooth) {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      currentIndex = index;

      var current = images[currentIndex];
      if (!current) return;

      // Update main viewer with smooth transition
      if (mainImg) {
        mainImg.style.opacity = '0.4';
        setTimeout(function () {
          mainImg.src = current.src;
          mainImg.alt = current.title + ' · Medgón Passivhaus';
          mainImg.style.opacity = '1';
        }, 120);
      }

      if (captionTitle) captionTitle.textContent = current.title;
      if (captionDesc) captionDesc.textContent = current.desc;
      if (counterEl) counterEl.textContent = (currentIndex + 1) + ' / ' + images.length;

      // Update lightbox if open
      if (lightbox && !lightbox.classList.contains('hidden')) {
        if (lightboxImg) lightboxImg.src = current.src;
        if (lightboxTitle) lightboxTitle.textContent = current.title;
        if (lightboxDesc) lightboxDesc.textContent = current.desc;
      }

      // Update active thumbnail
      if (thumbsContainer) {
        var thumbs = thumbsContainer.querySelectorAll('[data-gallery-index]');
        thumbs.forEach(function (thumb) {
          var tIdx = parseInt(thumb.getAttribute('data-gallery-index'), 10);
          if (tIdx === currentIndex) {
            thumb.classList.add('ring-3', 'ring-[#23bd00]', 'border-transparent', 'opacity-100');
            thumb.classList.remove('opacity-60', 'border-[#16181B]/15');
            // Scroll thumbnail into view smoothly
            try {
              thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } catch (e) {}
          } else {
            thumb.classList.remove('ring-3', 'ring-[#23bd00]', 'border-transparent', 'opacity-100');
            thumb.classList.add('opacity-60', 'border-[#16181B]/15');
          }
        });
      }
    }

    // Attach event handlers
    if (btnPrev) {
      btnPrev.addEventListener('click', function (e) {
        e.preventDefault();
        stopAutoPlay();
        updateView(currentIndex - 1);
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', function (e) {
        e.preventDefault();
        stopAutoPlay();
        updateView(currentIndex + 1);
      });
    }

    // Thumbnails click
    if (thumbsContainer) {
      var thumbs = thumbsContainer.querySelectorAll('[data-gallery-index]');
      thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          var idx = parseInt(this.getAttribute('data-gallery-index'), 10);
          stopAutoPlay();
          updateView(idx);
        });
      });
    }

    // Auto Play Slideshow
    function startAutoPlay() {
      isPlaying = true;
      if (btnPlay) {
        btnPlay.innerHTML = '<svg class="w-4 h-4 text-[#23bd00]" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span class="text-xs font-bold text-[#23bd00]">Pausar</span>';
        btnPlay.classList.add('bg-[#23bd00]/10', 'border-[#23bd00]/40');
      }
      autoPlayInterval = setInterval(function () {
        updateView(currentIndex + 1);
      }, 4000);
    }

    function stopAutoPlay() {
      if (!isPlaying) return;
      isPlaying = false;
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
      if (btnPlay) {
        btnPlay.innerHTML = '<svg class="w-4 h-4 text-[#16181B]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><span class="text-xs font-bold text-[#16181B]">Presentación</span>';
        btnPlay.classList.remove('bg-[#23bd00]/10', 'border-[#23bd00]/40');
      }
    }

    if (btnPlay) {
      btnPlay.addEventListener('click', function () {
        if (isPlaying) {
          stopAutoPlay();
        } else {
          startAutoPlay();
        }
      });
    }

    // Lightbox modal logic
    function openLightbox() {
      if (!lightbox) return;
      var cur = images[currentIndex];
      if (lightboxImg) lightboxImg.src = cur.src;
      if (lightboxTitle) lightboxTitle.textContent = cur.title;
      if (lightboxDesc) lightboxDesc.textContent = cur.desc;
      lightbox.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    if (mainImg) {
      mainImg.style.cursor = 'zoom-in';
      mainImg.addEventListener('click', openLightbox);
    }

    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', openLightbox);
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', function (e) {
        e.stopPropagation();
        updateView(currentIndex - 1);
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', function (e) {
        e.stopPropagation();
        updateView(currentIndex + 1);
      });
    }

    if (lightbox) {
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target.id === 'lightbox-backdrop') {
          closeLightbox();
        }
      });
    }

    // Keyboard navigation
    window.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        updateView(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateView(currentIndex + 1);
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    });

    // Initialize first image
    updateView(0);
  };
})();
