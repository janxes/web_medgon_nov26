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
 * Regla de cálculo orientativa aplicada a los modelos con tarifa publicada:
 *   - MG 87  (87 m²):     desde 156.600 € (orientativo)
 *   - MG 89  (89,01 m²):  Precio por confirmar
 *   - MG 100 (100 m²):    desde 180.000 € (orientativo)
 *   - MG 105 (105 m²):    desde 189.000 € (orientativo)
 *   - MG 128 (128 m²):    desde 230.400 € (orientativo)
 *   - MG 130 (130 m²):    Precio por confirmar
 *   - MG 148 (148 m²):    desde 266.400 € (orientativo)
 *   - MG 165 (165 m²):    desde 297.000 € (orientativo)
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. TABLA CENTRALIZADA DE PRECIOS (MODIFICAR AQUÍ AL ACTUALIZAR TARIFAS)
  // ==========================================================================
  var TEXTO_PRECIO_PENDIENTE = 'Precio por confirmar';

  var PRECIOS_VIVIENDAS = {
    'mg-87': {
      codigo: 'MG 87',
      superficieM2: 87,
      precioBase: 156600,   // Referencia orientativa (87 m² x 1.800 €)
      precioM2: 1800,
      rangoMax: 174000,
      orientativo: true
    },
    'mg-89': {
      codigo: 'MG 89',
      superficieM2: 89.01,
      precioBase: null,
      precioM2: null,
      rangoMax: null,
      orientativo: true,
      textoPendiente: TEXTO_PRECIO_PENDIENTE
    },
    'mg-100': {
      codigo: 'MG 100',
      superficieM2: 100,
      precioBase: 180000,   // Referencia orientativa (100 m² x 1.800 €)
      precioM2: 1800,
      rangoMax: 200000,
      orientativo: true
    },
    'mg-105': {
      codigo: 'MG 105',
      superficieM2: 105,
      precioBase: 189000,   // Referencia orientativa (105 m² x 1.800 €)
      precioM2: 1800,
      rangoMax: 210000,
      orientativo: true
    },
    'mg-128': {
      codigo: 'MG 128',
      superficieM2: 128,
      precioBase: 230400,   // Referencia orientativa (128 m² x 1.800 €)
      precioM2: 1800,
      rangoMax: 256000,
      orientativo: true
    },
    'mg-130': {
      codigo: 'MG 130',
      superficieM2: 130,
      precioBase: null,
      precioM2: null,
      rangoMax: null,
      orientativo: true,
      textoPendiente: TEXTO_PRECIO_PENDIENTE
    },
    'mg-148': {
      codigo: 'MG 148',
      superficieM2: 148,
      precioBase: 266400,   // Referencia orientativa (148 m² x 1.800 €)
      precioM2: 1800,
      rangoMax: 296000,
      orientativo: true
    },
    'mg-165': {
      codigo: 'MG 165',
      superficieM2: 165,
      precioBase: 297000,   // Referencia orientativa (165 m² x 1.800 €)
      precioM2: 1800,
      rangoMax: 330000,
      orientativo: true
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

      if (typeof modelo.precioBase !== 'number' || isNaN(modelo.precioBase)) {
        el.textContent = modelo.textoPendiente || TEXTO_PRECIO_PENDIENTE;
        el.removeAttribute('data-precio-numerico');
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
          texto = typeof modelo.precioM2 === 'number'
            ? formatearEuros(modelo.precioM2) + '/m²'
            : (modelo.textoPendiente || TEXTO_PRECIO_PENDIENTE);
          break;
        case 'rango':
          texto = typeof modelo.rangoMax === 'number'
            ? precioFmt + ' – ' + formatearEuros(modelo.rangoMax)
            : 'desde ' + precioFmt;
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
        var supFmt = String(modelo.superficieM2).replace('.', ',');
        el.textContent = supFmt + ' m²';
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
