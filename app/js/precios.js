/**
 * ============================================================================
 * MEDGÓN PASSIVHAUS - SISTEMA CENTRALIZADO DE PRECIOS DE VIVIENDAS
 * Archivo: js/precios.js
 *
 * Centraliza los precios del catálogo en un único punto. Modifica las cifras
 * de este archivo varias veces al año y se actualizarán automáticamente en
 * todas las páginas y componentes del sitio web que utilicen el atributo:
 * [data-precio-vivienda="identificador-del-modelo"]
 *
 * Regla de cálculo aplicada: Superficie construida (m²) x 1.800 €/m²
 *   - MG 87  (87 m²):  176.600 €
 *   - MG 100 (100 m²): 189.000 € (desde 180.000 euros)
 *   - MG 105 (105 m²): 195.000 €
 *   - MG 128 (128 m²): 230.400 €
 *   - MG 148 (148 m²): 266.400 €
 *   - MG 165 (165 m²): 297.000 €
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. TABLA CENTRALIZADA DE PRECIOS (MODIFICAR AQUÍ AL ACTUALIZAR TARIFAS)
  // ==========================================================================
  var PRECIOS_VIVIENDAS = {
    'mg-87': {
      codigo: 'MG 87',
      superficieM2: 87,
      precioBase: 176600,   // 87 m² x 1.800 €
      precioM2: 1800,
      rangoMax: 174000
    },
    'mg-100': {
      codigo: 'MG 100',
      superficieM2: 100,
      precioBase: 195000,   // 100 m² x 1.800 €
      precioM2: 1800,
      rangoMax: 200000
    },
    'mg-105': {
      codigo: 'MG 105',
      superficieM2: 105,
      precioBase: 189000,   // 105 m² x 1.800 €
      precioM2: 1800,
      rangoMax: 210000
    },
    'mg-128': {
      codigo: 'MG 128',
      superficieM2: 128,
      precioBase: 230400,   // 128 m² x 1.800 €
      precioM2: 1800,
      rangoMax: 256000
    },
    'mg-148': {
      codigo: 'MG 148',
      superficieM2: 148,
      precioBase: 266400,   // 148 m² x 1.800 €
      precioM2: 1800,
      rangoMax: 296000
    },
    'mg-165': {
      codigo: 'MG 165',
      superficieM2: 165,
      precioBase: 297000,   // 165 m² x 1.800 €
      precioM2: 1800,
      rangoMax: 330000
    }
  };

  // ==========================================================================
  // 2. FORMATEADOR MONETARIO EN EUROS (Ejemplo: 180.000 €)
  // ==========================================================================
  function formatearEuros(valor) {
    if (typeof valor !== 'number' || isNaN(valor)) {
      return '';
    }
    try {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
      }).format(valor);
    } catch (e) {
      var str = Math.round(valor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return str + ' €';
    }
  }

  // Normaliza el identificador del modelo (admite 'mg-100', 'mg100', 'MG 100', '100')
  function normalizarClave(clave) {
    if (!clave) return '';
    var s = String(clave).trim().toLowerCase().replace(/\s+/g, '-');
    if (/^\d+$/.test(s)) {
      s = 'mg-' + s;
    } else if (/^mg\d+$/.test(s)) {
      s = s.replace(/^mg/, 'mg-');
    }
    return s;
  }

  function obtenerModelo(clave) {
    var k = normalizarClave(clave);
    return PRECIOS_VIVIENDAS[k] || null;
  }

  // ==========================================================================
  // 3. INYECCIÓN AUTOMÁTICA EN ELEMENTOS [data-precio-vivienda]
  // ==========================================================================
  function aplicarPrecios() {
    var elementos = document.querySelectorAll('[data-precio-vivienda]');
    if (!elementos || elementos.length === 0) return;

    elementos.forEach(function (el) {
      var id = el.getAttribute('data-precio-vivienda');
      var modelo = obtenerModelo(id);
      if (!modelo) {
        return;
      }

      var formato = (el.getAttribute('data-precio-formato') || 'desde').toLowerCase();
      var precioFmt = formatearEuros(modelo.precioBase);
      var texto = '';

      switch (formato) {
        case 'solo-numero':
        case 'numero':
          texto = precioFmt;
          break;
        case 'm2':
        case 'metro':
          texto = formatearEuros(modelo.precioM2) + '/m²';
          break;
        case 'rango':
          texto = precioFmt + ' – ' + formatearEuros(modelo.rangoMax);
          break;
        case 'iva':
          texto = 'desde ' + precioFmt + ' + IVA';
          break;
        case 'desde':
        default:
          texto = 'desde ' + precioFmt;
          break;
      }

      el.textContent = texto;
      el.setAttribute('data-precio-numerico', modelo.precioBase);
    });

    // Inyección opcional de superficie en [data-superficie-vivienda]
    var elemsSup = document.querySelectorAll('[data-superficie-vivienda]');
    elemsSup.forEach(function (el) {
      var id = el.getAttribute('data-superficie-vivienda');
      var modelo = obtenerModelo(id);
      if (modelo) {
        el.textContent = modelo.superficieM2 + ' m²';
      }
    });
  }

  // ==========================================================================
  // 4. AUTO-EJECUCIÓN
  // ==========================================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aplicarPrecios);
  } else {
    aplicarPrecios();
  }
  window.addEventListener('load', aplicarPrecios);

  // Exposición global
  window.MEDGON_PRECIOS = {
    tarifas: PRECIOS_VIVIENDAS,
    formatearEuros: formatearEuros,
    actualizar: aplicarPrecios,
    obtenerModelo: obtenerModelo
  };
})();
