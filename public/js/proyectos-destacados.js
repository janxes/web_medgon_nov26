(function () {
  var INITIAL_VISIBLE = 12;
  var PAGE_STEP = 12;

  function normalizeText(value) {
    return (value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function bindImageFade(img) {
    if (!img) return;
    function reveal() {
      img.classList.remove('opacity-0');
      img.classList.add('opacity-100');
    }

    if (img.complete && img.naturalWidth > 0) {
      reveal();
      return;
    }

    if (!img.dataset.fadeBound) {
      img.dataset.fadeBound = '1';
      img.addEventListener('load', reveal);
      img.addEventListener('error', reveal);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('projects-grid');
    if (!grid) return;

    var cards = Array.from(grid.querySelectorAll('.project-card'));
    var filterButtons = Array.from(document.querySelectorAll('[data-region-filter]'));
    var searchInput = document.getElementById('project-search-input');
    var clearSearchBtn = document.getElementById('project-search-clear');
    var visibleCountEl = document.getElementById('projects-visible-count');
    var matchingTotalEl = document.getElementById('projects-matching-total');
    var emptyStateEl = document.getElementById('projects-empty-state');
    var resetBtn = document.getElementById('projects-reset-btn');
    var loadMoreWrap = document.getElementById('load-more-projects-wrap');
    var loadMoreBtn = document.getElementById('load-more-projects-btn');
    var loadMoreRemaining = document.getElementById('load-more-remaining');

    // Lightbox elements
    var modal = document.getElementById('project-lightbox-modal');
    var modalImg = document.getElementById('lightbox-image');
    var modalTitle = document.getElementById('lightbox-title');
    var modalLocation = document.getElementById('lightbox-location');
    var modalCounter = document.getElementById('lightbox-counter');
    var modalCloseBtn = document.getElementById('lightbox-close-btn');
    var modalPrevBtn = document.getElementById('lightbox-prev-btn');
    var modalNextBtn = document.getElementById('lightbox-next-btn');

    var activeRegion = 'todos';
    var searchQuery = '';
    var visibleLimit = INITIAL_VISIBLE;
    var currentModalIndex = -1;
    var lastFocusedCard = null;

    // Bind fade-in transitions for hero & initial visible images
    document.querySelectorAll('img.fade-on-load').forEach(bindImageFade);

    function getVisibleCards() {
      return cards.filter(function (card) {
        return !card.classList.contains('hidden');
      });
    }

    function updateFilterButtonsUI() {
      filterButtons.forEach(function (btn) {
        var isActive = btn.getAttribute('data-region-filter') === activeRegion;
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        if (isActive) {
          btn.classList.remove('bg-white', 'text-[#16181B]', 'border-slate-200', 'hover:border-[#23bd00]', 'hover:text-[#23bd00]');
          btn.classList.add('bg-[#16181B]', 'text-white', 'border-[#16181B]');
        } else {
          btn.classList.remove('bg-[#16181B]', 'text-white', 'border-[#16181B]');
          btn.classList.add('bg-white', 'text-[#16181B]', 'border-slate-200', 'hover:border-[#23bd00]', 'hover:text-[#23bd00]');
        }
      });
    }

    function applyFilters() {
      var normQuery = normalizeText(searchQuery);
      var matchingCount = 0;
      var shownCount = 0;

      cards.forEach(function (card) {
        var region = card.getAttribute('data-region') || '';
        var name = normalizeText(card.getAttribute('data-name'));
        var location = normalizeText(card.getAttribute('data-location'));

        var matchesRegion = activeRegion === 'todos' || region === activeRegion;
        var matchesQuery = !normQuery || name.includes(normQuery) || location.includes(normQuery);

        if (matchesRegion && matchesQuery) {
          matchingCount += 1;
          if (shownCount < visibleLimit) {
            card.classList.remove('hidden');
            shownCount += 1;
            var img = card.querySelector('img');
            bindImageFade(img);
          } else {
            card.classList.add('hidden');
          }
        } else {
          card.classList.add('hidden');
        }
      });

      if (visibleCountEl) {
        visibleCountEl.textContent = String(shownCount);
      }
      if (matchingTotalEl) {
        matchingTotalEl.textContent = String(matchingCount);
      }

      if (emptyStateEl) {
        if (matchingCount === 0) {
          emptyStateEl.classList.remove('hidden');
        } else {
          emptyStateEl.classList.add('hidden');
        }
      }

      var remaining = Math.max(0, matchingCount - shownCount);
      if (loadMoreWrap) {
        if (remaining > 0) {
          loadMoreWrap.classList.remove('hidden');
          if (loadMoreRemaining) {
            loadMoreRemaining.textContent = String(remaining);
          }
        } else {
          loadMoreWrap.classList.add('hidden');
        }
      }

      if (clearSearchBtn) {
        if (searchQuery.length > 0) {
          clearSearchBtn.classList.remove('hidden');
        } else {
          clearSearchBtn.classList.add('hidden');
        }
      }
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeRegion = btn.getAttribute('data-region-filter') || 'todos';
        visibleLimit = INITIAL_VISIBLE;
        updateFilterButtonsUI();
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchQuery = searchInput.value || '';
        visibleLimit = INITIAL_VISIBLE;
        applyFilters();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', function () {
        searchQuery = '';
        visibleLimit = INITIAL_VISIBLE;
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        applyFilters();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        activeRegion = 'todos';
        searchQuery = '';
        visibleLimit = INITIAL_VISIBLE;
        if (searchInput) searchInput.value = '';
        updateFilterButtonsUI();
        applyFilters();
      });
    }

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function () {
        visibleLimit += PAGE_STEP;
        applyFilters();
      });
    }

    function renderModalByVisibleIndex(index) {
      var visible = getVisibleCards();
      if (!visible.length || !modal) return;
      var safeIndex = ((index % visible.length) + visible.length) % visible.length;
      currentModalIndex = safeIndex;
      var card = visible[safeIndex];

      var imgSrc = card.getAttribute('data-image') || '';
      var title = card.getAttribute('data-name') || '';
      var location = card.getAttribute('data-location') || '';
      var width = card.getAttribute('data-width') || '1600';
      var height = card.getAttribute('data-height') || '1200';

      if (modalImg) {
        modalImg.classList.remove('opacity-100');
        modalImg.classList.add('opacity-0');
        modalImg.src = imgSrc;
        modalImg.alt = title + ' en ' + location + ' · Medgón Passivhaus';
        modalImg.setAttribute('width', width);
        modalImg.setAttribute('height', height);
        bindImageFade(modalImg);
      }
      if (modalTitle) modalTitle.textContent = title;
      if (modalLocation) modalLocation.textContent = location;
      if (modalCounter) modalCounter.textContent = (safeIndex + 1) + ' / ' + visible.length;
    }

    function openModalForCard(card) {
      if (!modal) return;
      var visible = getVisibleCards();
      var idx = visible.indexOf(card);
      if (idx === -1) return;

      lastFocusedCard = card;
      renderModalByVisibleIndex(idx);
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      if (modalCloseBtn) modalCloseBtn.focus();
    }

    function closeModal() {
      if (!modal || modal.classList.contains('hidden')) return;
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      if (lastFocusedCard && typeof lastFocusedCard.focus === 'function') {
        lastFocusedCard.focus();
      }
    }

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        openModalForCard(card);
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalPrevBtn) {
      modalPrevBtn.addEventListener('click', function () {
        renderModalByVisibleIndex(currentModalIndex - 1);
      });
    }

    if (modalNextBtn) {
      modalNextBtn.addEventListener('click', function () {
        renderModalByVisibleIndex(currentModalIndex + 1);
      });
    }

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          closeModal();
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (!modal || modal.classList.contains('hidden')) return;
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        renderModalByVisibleIndex(currentModalIndex - 1);
      } else if (e.key === 'ArrowRight') {
        renderModalByVisibleIndex(currentModalIndex + 1);
      }
    });

    updateFilterButtonsUI();
    applyFilters();
  });
})();
