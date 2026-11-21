/**
 * MEDGÓN PASSIVHAUS - SCRIPT PRINCIPAL
 * Interactividad: menú móvil, pestañas de planos, preselección de modelos,
 * filtros de dormitorios, menús desplegables e integración unificada con Web3Forms (https://api.web3forms.com/submit).
 */
(function () {
  var WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
  var DEFAULT_ACCESS_KEY = 'd8dae1e9-317b-4fbe-949e-38557cedda05';
  var initialized = false;

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function initWeb3FormsAndPage() {
    if (initialized) return;
    initialized = true;

    // 1. Preseleccionar modelo en formulario de contacto desde parámetro URL (?modelo=MG100)
    var params = new URLSearchParams(window.location.search);
    var modeloParam = params.get('modelo');
    var selectEl = document.getElementById('select-modelo');
    if (modeloParam && selectEl) {
      for (var i = 0; i < selectEl.options.length; i++) {
        if (selectEl.options[i].value.toLowerCase().includes(modeloParam.toLowerCase())) {
          selectEl.selectedIndex = i;
          break;
        }
      }
    }

    // 2. Detección automática y unificada de todos los formularios Web3Forms / de lead de la web
    var selector = [
      'form[action="https://api.web3forms.com/submit"]',
      'form[action*="api.web3forms.com/submit"]',
      'form[action*="web3forms.com"]',
      'form#contact-form',
      'form[data-web3forms]',
      'form[data-formsubmit]'
    ].join(', ');

    var candidateForms = document.querySelectorAll(selector);
    var forms = [];
    candidateForms.forEach(function (f) {
      if (forms.indexOf(f) === -1) {
        forms.push(f);
      }
    });

    var successModal = document.getElementById('contact-success-modal');
    var modalCloseBtn = document.getElementById('modal-close-btn');
    var modalClientName = document.getElementById('modal-client-name');

    function showModal(nombre) {
      if (modalClientName) {
        modalClientName.textContent = nombre ? nombre.trim() : '';
      }
      if (successModal) {
        successModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeModal() {
      if (successModal) {
        successModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }
    if (successModal) {
      successModal.addEventListener('click', function (e) {
        if (e.target === successModal) {
          closeModal();
        }
      });
      document.addEventListener('keydown', function (e) {
        if ((e.key === 'Escape' || e.key === 'Esc') && !successModal.classList.contains('hidden')) {
          closeModal();
        }
      });
    }

    // Si la página se cargó con ?enviado=1 (fallback tradicional)
    if (params.get('enviado') === '1' && successModal) {
      showModal('Estimado/a cliente');
    }

    // Manejador genérico único para el evento submit de todos los formularios detectados
    forms.forEach(function (form) {
      if (form.dataset.web3formsBound === 'true') return;
      form.dataset.web3formsBound = 'true';

      var submitBtn = form.querySelector('button[type="submit"], input[type="submit"], #submit-btn');
      var btnText = form.querySelector('#btn-text, .btn-text-content') ||
        (submitBtn ? submitBtn.querySelector('#btn-text, .btn-text-content') : null);
      var btnLoading = form.querySelector('#btn-loading, .btn-loading-content') ||
        (submitBtn ? submitBtn.querySelector('#btn-loading, .btn-loading-content') : null);
      var originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
      var originalBtnValue = (submitBtn && submitBtn.tagName === 'INPUT') ? submitBtn.value : '';

      var errorAlert = form.querySelector('#form-error-alert') ||
        (form.parentElement ? form.parentElement.querySelector('#form-error-alert') : null) ||
        document.getElementById('form-error-alert');

      function getOrCreateInlineAlert(type) {
        var id = type === 'success' ? 'form-success-inline' : 'form-error-alert-inline';
        var existing = form.querySelector('#' + id) || (form.parentElement ? form.parentElement.querySelector('#' + id) : null);
        if (existing) return existing;

        var box = document.createElement('div');
        box.id = id;
        box.setAttribute('role', type === 'success' ? 'status' : 'alert');
        if (type === 'success') {
          box.className = 'hidden p-4 rounded-xl bg-emerald-50 border border-[#23bd00]/40 text-[#16181B] text-sm';
        } else {
          box.className = 'hidden p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs';
        }
        form.insertBefore(box, form.firstChild);
        return box;
      }

      function hideAlerts() {
        if (errorAlert) {
          errorAlert.classList.add('hidden');
        }
        var inlineErr = form.querySelector('#form-error-alert-inline');
        if (inlineErr) {
          inlineErr.classList.add('hidden');
        }
        var inlineOk = form.querySelector('#form-success-inline');
        if (inlineOk) {
          inlineOk.classList.add('hidden');
        }
      }

      function showError() {
        var target = errorAlert || getOrCreateInlineAlert('error');
        if (!errorAlert) {
          target.innerHTML =
            '<div class="font-bold mb-1">No se ha podido enviar la solicitud en este momento</div>' +
            '<p>Por favor, comprueba tu conexión o escríbenos a <a href="mailto:informacion@medgon.com" class="underline font-bold">informacion@medgon.com</a> o llámanos al <a href="tel:+34979881010" class="underline font-bold">+34 979 88 10 10</a>.</p>';
        }
        target.classList.remove('hidden');
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      function showSuccess(nombre) {
        if (successModal) {
          showModal(nombre);
          return;
        }
        var okBox = getOrCreateInlineAlert('success');
        var saludo = nombre && nombre.trim() ? 'Muchas gracias, ' + nombre.trim() + '. ' : 'Muchas gracias. ';
        okBox.innerHTML =
          '<p class="font-extrabold text-[#16181B] mb-1">¡Solicitud recibida con éxito!</p>' +
          '<p class="text-xs text-[#2C313A]">' + saludo + 'Tu consulta ha sido enviada correctamente a la oficina técnica de Medgón Passivhaus.</p>';
        okBox.classList.remove('hidden');
        okBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      function setLoading(isLoading) {
        if (isLoading) {
          form.dataset.submitting = 'true';
        } else {
          delete form.dataset.submitting;
        }
        if (!submitBtn) return;

        submitBtn.disabled = isLoading;
        if (isLoading) {
          submitBtn.setAttribute('aria-busy', 'true');
          submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
          submitBtn.removeAttribute('aria-busy');
          submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }

        if (btnText && btnLoading) {
          if (isLoading) {
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');
          } else {
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
          }
        } else if (submitBtn.tagName === 'INPUT') {
          submitBtn.value = isLoading ? 'Enviando solicitud...' : originalBtnValue;
        } else {
          submitBtn.innerHTML = isLoading ? 'Enviando solicitud...' : originalBtnHTML;
        }
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (form.dataset.submitting === 'true') {
          return;
        }

        if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
          if (typeof form.reportValidity === 'function') {
            form.reportValidity();
          }
          return;
        }

        hideAlerts();
        setLoading(true);

        var formData = new FormData(form);
        var payload = {};
        formData.forEach(function (value, key) {
          if (Object.prototype.hasOwnProperty.call(payload, key)) {
            if (Array.isArray(payload[key])) {
              payload[key].push(value);
            } else {
              payload[key] = [payload[key], value];
            }
          } else {
            payload[key] = value;
          }
        });

        // Asegurar configuración válida de Web3Forms y limpiar restos antiguos de FormSubmit
        payload['access_key'] = (payload['access_key'] && String(payload['access_key']).trim()) || DEFAULT_ACCESS_KEY;
        if (!payload['subject'] && payload['_subject']) {
          payload['subject'] = payload['_subject'];
        }
        if (!payload['subject']) {
          payload['subject'] = document.title || 'Nueva solicitud desde Web Medgón Passivhaus';
        }
        if (!payload['from_name']) {
          payload['from_name'] = 'Web Medgón Passivhaus';
        }

        // Control antispam nativo botcheck
        var botcheckInput = form.querySelector('input[name="botcheck"]');
        if (botcheckInput && botcheckInput.checked) {
          payload['botcheck'] = true;
        } else {
          delete payload['botcheck'];
        }

        delete payload['_captcha'];
        delete payload['_template'];
        delete payload['_honey'];
        delete payload['_subject'];
        delete payload['_next'];

        fetch(WEB3FORMS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(function (response) {
          return response.text().then(function (rawText) {
            var parsedData = null;
            try {
              parsedData = rawText ? JSON.parse(rawText) : null;
            } catch (parseError) {
              parsedData = null;
            }
            return {
              ok: response.ok,
              status: response.status,
              statusText: response.statusText,
              data: parsedData,
              rawText: rawText
            };
          });
        })
        .then(function (result) {
          var isSuccess = Boolean(
            result.ok &&
            result.data &&
            (result.data.success === true || result.data.success === 'true')
          );

          if (!isSuccess) {
            console.error('Error Web3Forms (respuesta exacta):', {
              status: result.status,
              statusText: result.statusText,
              data: result.data,
              rawText: result.rawText
            });
            var errorMessage = (result.data && result.data.message)
              ? result.data.message
              : ('HTTP ' + result.status + (result.statusText ? ' ' + result.statusText : ''));
            throw new Error(errorMessage);
          }

          setLoading(false);
          var nombre = payload['nombre'] || payload['name'] || '';
          showSuccess(typeof nombre === 'string' ? nombre : '');
          form.reset();

          // Restaurar modelo preseleccionado si existía en la URL
          if (modeloParam && selectEl && form.contains(selectEl)) {
            for (var j = 0; j < selectEl.options.length; j++) {
              if (selectEl.options[j].value.toLowerCase().includes(modeloParam.toLowerCase())) {
                selectEl.selectedIndex = j;
                break;
              }
            }
          }
        })
        .catch(function (error) {
          console.error('Error al enviar formulario a Web3Forms:', error);
          setLoading(false);
          showError();
        });
      });
    });

    initDesktopNavDropdowns();
    initBedroomFilters();
  }

  onReady(initWeb3FormsAndPage);
})();

// 3. Control de acordeón interactivo para FAQ
window.toggleFaqAccordion = function (btn) {
  if (!btn) return;
  var answer = btn.nextElementSibling;
  var svg = btn.querySelector('svg');
  if (!answer) return;
  var isHidden = answer.classList.contains('hidden');
  if (isHidden) {
    answer.classList.remove('hidden');
    if (svg) svg.classList.add('rotate-180');
    btn.setAttribute('aria-expanded', 'true');
  } else {
    answer.classList.add('hidden');
    if (svg) svg.classList.remove('rotate-180');
    btn.setAttribute('aria-expanded', 'false');
  }
};

// 4. Estabilizador de interacción para los submenús de navegación desktop
function initDesktopNavDropdowns() {
  // Inyectar estilos globales de estabilidad para puente de hover y estados abiertos
  if (!document.getElementById('nav-dropdown-stabilizer-styles')) {
    var style = document.createElement('style');
    style.id = 'nav-dropdown-stabilizer-styles';
    style.textContent = [
      'header nav .relative.group > div.absolute::before,',
      'header nav .nav-dropdown-panel::before {',
      '  content: "";',
      '  position: absolute;',
      '  top: -16px;',
      '  left: 0;',
      '  right: 0;',
      '  height: 16px;',
      '  pointer-events: auto;',
      '}',
      'header nav .relative.group.is-open > div.absolute,',
      'header nav .nav-dropdown-item.is-open > .nav-dropdown-panel,',
      'header nav .relative.group:hover > div.absolute,',
      'header nav .nav-dropdown-item:hover > .nav-dropdown-panel,',
      'header nav .relative.group:focus-within > div.absolute,',
      'header nav .nav-dropdown-item:focus-within > .nav-dropdown-panel {',
      '  opacity: 1 !important;',
      '  transform: translateY(0) !important;',
      '  pointer-events: auto !important;',
      '  visibility: visible !important;',
      '}',
      'header nav .relative.group.is-open button svg,',
      'header nav .nav-dropdown-item.is-open button svg {',
      '  transform: rotate(180deg) !important;',
      '  color: #23bd00 !important;',
      '}',
      'header nav .relative.group.is-open button,',
      'header nav .nav-dropdown-item.is-open button {',
      '  color: #23bd00 !important;',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  var dropdownContainers = document.querySelectorAll('header nav .nav-dropdown-item, header nav .relative.group');
  if (!dropdownContainers.length) return;

  dropdownContainers.forEach(function (container) {
    var trigger = container.querySelector('button');
    var panel = container.querySelector('.nav-dropdown-panel, div.absolute');
    if (!trigger || !panel) return;

    var graceTimeout = null;

    function openMenu() {
      if (graceTimeout) {
        clearTimeout(graceTimeout);
        graceTimeout = null;
      }
      dropdownContainers.forEach(function (other) {
        if (other !== container && !other.dataset.pinned) {
          other.classList.remove('is-open');
          var otherTrigger = other.querySelector('button');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });
      container.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu(immediate) {
      if (graceTimeout) {
        clearTimeout(graceTimeout);
        graceTimeout = null;
      }
      if (immediate) {
        delete container.dataset.pinned;
        container.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        graceTimeout = setTimeout(function () {
          if (!container.dataset.pinned) {
            container.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
          }
        }, 180);
      }
    }

    // Hover con período de gracia para evitar parpadeo o cierre accidental
    container.addEventListener('mouseenter', openMenu);
    container.addEventListener('mouseleave', function () {
      closeMenu(false);
    });

    // Soporte táctil y de clic (fijar / alternar)
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isPinned = container.dataset.pinned === 'true';
      if (isPinned) {
        delete container.dataset.pinned;
        closeMenu(true);
      } else {
        // Desfijar otros
        dropdownContainers.forEach(function (other) {
          delete other.dataset.pinned;
          other.classList.remove('is-open');
          var otherTrigger = other.querySelector('button');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        });
        container.dataset.pinned = 'true';
        openMenu();
      }
    });

    // Navegación por teclado en el botón disparador
    trigger.addEventListener('keydown', function (e) {
      var links = Array.from(panel.querySelectorAll('a[href]'));
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        container.dataset.pinned = 'true';
        openMenu();
        if (links.length) links[0].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        container.dataset.pinned = 'true';
        openMenu();
        if (links.length) links[links.length - 1].focus();
      } else if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        closeMenu(true);
        trigger.focus();
      }
    });

    // Navegación por teclado dentro del desplegable
    panel.addEventListener('keydown', function (e) {
      var links = Array.from(panel.querySelectorAll('a[href]'));
      if (!links.length) return;
      var currentIdx = links.indexOf(document.activeElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        links[(currentIdx + 1) % links.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        links[(currentIdx - 1 + links.length) % links.length].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        links[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        links[links.length - 1].focus();
      } else if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        closeMenu(true);
        trigger.focus();
      }
    });

    // Cerrar al salir del contenedor mediante Tab
    container.addEventListener('focusout', function (e) {
      if (!container.contains(e.relatedTarget)) {
        closeMenu(true);
      }
    });

    // Cierre inmediato al seleccionar una opción de navegación
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        closeMenu(true);
      }
    });
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', function (e) {
    dropdownContainers.forEach(function (container) {
      if (!container.contains(e.target)) {
        delete container.dataset.pinned;
        container.classList.remove('is-open');
        var trigger = container.querySelector('button');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Cerrar desplegables y menú móvil con Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      dropdownContainers.forEach(function (container) {
        if (container.classList.contains('is-open')) {
          delete container.dataset.pinned;
          container.classList.remove('is-open');
          var trigger = container.querySelector('button');
          if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
            trigger.focus();
          }
        }
      });

      var mobileDrawer = document.getElementById('mobile-menu-drawer');
      if (mobileDrawer && !mobileDrawer.classList.contains('hidden')) {
        if (typeof window.toggleMobileMenu === 'function') {
          window.toggleMobileMenu();
        } else {
          mobileDrawer.classList.add('hidden');
        }
        var mobileBtn = document.getElementById('btn-mobile-menu');
        if (mobileBtn) mobileBtn.focus();
      }
    }
  });
}

// 5. Filtro dinámico por dormitorios (2, 3, 4 y más) para modelos Passivhaus
function initBedroomFilters() {
  var filterContainer = document.getElementById('filtros-dormitorios');
  if (!filterContainer) return;

  var filterButtons = filterContainer.querySelectorAll('[data-filter-dorm]');
  var galleryContainer = document.getElementById('galeria-modelos-scroll');
  var feedbackContainer = document.getElementById('filter-feedback');
  var counterDisplay = document.getElementById('filter-counter-display');

  function applyFilter(targetDorm, smoothScroll) {
    var matchCount = 0;

    // Actualizar estado activo en los botones de filtro
    filterButtons.forEach(function (btn) {
      var isCurrent = btn.getAttribute('data-filter-dorm') === targetDorm;
      btn.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
      if (isCurrent) {
        btn.classList.add('bg-[#16181B]', 'text-white', 'shadow-xs', 'active');
        btn.classList.remove('bg-white', 'text-[#16181B]', 'hover:text-[#23bd00]', 'border-transparent');
      } else {
        btn.classList.remove('bg-[#16181B]', 'text-white', 'shadow-xs', 'active');
        btn.classList.add('bg-white', 'text-[#16181B]', 'border-transparent');
      }
    });

    // Filtrar tarjetas en carrusel horizontal y cuadrícula de catálogo
    var allCards = document.querySelectorAll('article[data-dorm]');
    allCards.forEach(function (card) {
      var dormAttr = card.getAttribute('data-dorm') || '';
      var cardDorms = dormAttr.split(',').map(function (s) { return s.trim(); });
      var matches = false;

      if (targetDorm === 'todos') {
        matches = true;
      } else if (targetDorm === '2') {
        matches = cardDorms.includes('2');
      } else if (targetDorm === '3') {
        matches = cardDorms.includes('3');
      } else if (targetDorm === '4') {
        matches = cardDorms.some(function (d) { return parseInt(d, 10) >= 4; });
      }

      if (matches) {
        card.style.display = '';
        card.classList.remove('hidden');
        matchCount++;
      } else {
        card.style.display = 'none';
        card.classList.add('hidden');
      }
    });

    // Actualizar indicador de recuento
    if (feedbackContainer && counterDisplay) {
      feedbackContainer.classList.remove('hidden');
      if (targetDorm === 'todos') {
        counterDisplay.textContent = 'Mostrando todos los modelos (' + matchCount + ')';
      } else {
        var label = targetDorm === '4' ? '4 o más' : targetDorm;
        counterDisplay.textContent = 'Mostrando ' + matchCount + ' modelo' + (matchCount === 1 ? '' : 's') + ' de ' + label + ' dormitorios';
      }
    }

    // Desplazamiento suave al inicio de la galería horizontal si aplica
    if (galleryContainer) {
      galleryContainer.scrollTo({ left: 0, behavior: 'smooth' });
      if (smoothScroll) {
        galleryContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dorm = btn.getAttribute('data-filter-dorm');
      applyFilter(dorm, false);

      // Sincronizar parámetro en la URL (?dorm=3) para compartir o recargar
      try {
        var url = new URL(window.location.href);
        if (dorm === 'todos') {
          url.searchParams.delete('dorm');
        } else {
          url.searchParams.set('dorm', dorm);
        }
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}
    });
  });

  // Leer parámetro inicial si viene de enlace externo
  try {
    var initialDorm = new URLSearchParams(window.location.search).get('dorm');
    if (initialDorm && ['2', '3', '4', 'todos'].includes(initialDorm)) {
      applyFilter(initialDorm, false);
    }
  } catch (e) {}
}
