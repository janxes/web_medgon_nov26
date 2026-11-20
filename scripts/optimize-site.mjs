import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const SITE_URL = 'https://medgon.com';

const ORG_ENTITY = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Medgón Passivhaus S.L.',
  legalName: 'Medgón Passivhaus S.L.',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/assets/imagenes/generales/logo_medgon.webp`,
    width: 341,
    height: 148,
  },
  telephone: '+34 979 88 10 10',
  email: 'informacion@medgon.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Polígono Industrial, nave 50',
    addressLocality: 'Carrión de los Condes',
    addressRegion: 'Palencia',
    postalCode: '34120',
    addressCountry: 'ES',
  },
};

const HOME_BUSINESS_LD = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  '@id': `${SITE_URL}/#business`,
  name: 'Medgón Passivhaus S.L.',
  url: SITE_URL,
  telephone: '+34 979 88 10 10',
  email: 'informacion@medgon.com',
  description:
    'Fabricante líder en España de viviendas Passivhaus industrializadas de estructura de madera técnica. Modelos de 87 a 165 m² y viviendas modulares a medida (+200 m²) con precio cerrado.',
  image: `${SITE_URL}/assets/imagenes/generales/Frontal_HeroCasa_Mediterranea.webp`,
  logo: `${SITE_URL}/assets/imagenes/generales/logo_medgon.webp`,
  priceRange: '1.700 – 1.900 €/m² + IVA',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Polígono Industrial, nave 50',
    postalCode: '34120',
    addressLocality: 'Carrión de los Condes',
    addressRegion: 'Palencia',
    addressCountry: 'ES',
  },
};

const HOME_FAQ_ITEMS = [
  {
    q: '¿Puedo modificar la distribución interior y la posición de las ventanas?',
    a: 'Sí, totalmente. La distribución de tabiques interiores puede adaptarse a tus necesidades familiares sin coste adicional de rediseño estructural. En cuanto a las ventanas, las aperturas principales han sido calculadas para maximizar las ganancias solares en invierno y evitar sombras, pero podemos ajustar huecos o añadir porches y protecciones solares respetando siempre los requisitos del estándar Passivhaus.',
  },
  {
    q: '¿Puedo añadir un porche a mi casa de catálogo?',
    a: 'Sí. Casi todos nuestros clientes añaden un porche o terraza apergolada en madera técnica. Podemos industrializarlo como una extensión directa de la cubierta o como un módulo exterior acoplado, garantizando que no se generen puentes térmicos en la unión con la fachada principal.',
  },
  {
    q: '¿El tejado y las tejas cerámicas entran en el precio?',
    a: 'En las modalidades de envolvente completa (Modalidad 03 y Llave en mano), la cubierta se entrega 100% aislada e impermeabilizada. Si la normativa urbanística de tu municipio exige teja cerámica curva o mixta, la incluimos directamente en la partida de acabados para cumplir con las ordenanzas locales.',
  },
  {
    q: '¿Qué es la VMC y cómo funciona con la aerotermia?',
    a: 'La VMC (Ventilación Mecánica Controlada) es el pulmón de la casa Passivhaus: renueva el aire las 24 horas del día a través de filtros de alta eficiencia (F7/G4) que retienen polen, polvo y partículas, recuperando más del 90% del calor del aire expulsado. La aerotermia se combina con este sistema para aportar el pequeño apoyo de climatización necesario y el agua caliente sanitaria (ACS) con un consumo eléctrico mínimo.',
  },
  {
    q: '¿Cuáles son los plazos habituales de entrega?',
    a: 'El plazo global suele situarse entre 6 meses y 1 año, marcado principalmente por los tiempos de concesión de licencia en cada ayuntamiento. La fabricación en taller de todos los paneles y estructura requiere de 4 a 6 semanas, y el montaje hermético en parcela se realiza en tan solo 3 a 5 días con grúa, evitando meses de obra expuesta a la intemperie.',
  },
  {
    q: '¿Cómo se gestionan los pagos?',
    a: 'El proceso es 100% transparente y estructurado por hitos de entrega verificables: un primer anticipo para el proyecto de ejecución y cálculo digital BIM, un segundo hito al comenzar la fabricación robotizada en taller, un tercero al expedir los paneles hacia la parcela, y el resto tras el montaje y el test Blower Door.',
  },
  {
    q: '¿Cuánto cuesta el metro cuadrado de una vivienda de catálogo?',
    a: 'El rango de fase técnica garantizado para una vivienda terminada con acabados de alta calidad se sitúa entre 1.700 y 1.900 €/m² + IVA (con opciones de suministro estructural y montaje desde ~1.100 €/m² + IVA). Este precio incluye la ingeniería Passivhaus completa, carpinterías de triple vidrio y preinstalaciones de alta eficiencia.',
  },
];

const HOME_FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: HOME_FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

const MODEL_SPECS = {
  87: {
    code: 'MG 87',
    builtM2: 87,
    usefulM2: 74.5,
    floors: 1,
    rooms: '2 - 3',
    baths: '1 - 2',
    lowPrice: 156600,
    highPrice: 174000,
    image: `${SITE_URL}/assets/imagenes/mg87/castilian_wheat_house.webp`,
    desc: 'Vivienda unifamiliar Passivhaus de 87 m² construidos (74,5 m² útiles) en una planta con 2-3 dormitorios, estructura en madera técnica industrializada y precio cerrado.',
  },
  100: {
    code: 'MG 100',
    builtM2: 100,
    usefulM2: 86.2,
    floors: 1,
    rooms: '3',
    baths: '2',
    lowPrice: 180000,
    highPrice: 200000,
    image: `${SITE_URL}/assets/imagenes/mg100/MG_100_Exterior.webp`,
    desc: 'Casa industrializada Passivhaus MG 100 de 100 m² construidos (86,2 m² útiles) en planta única con 3 dormitorios, 2 baños, ventilación VMC y envolvente hermética n50 ≤ 0,6.',
  },
  105: {
    code: 'MG 105',
    builtM2: 105,
    usefulM2: 105,
    floors: 1,
    rooms: '3',
    baths: '2',
    lowPrice: 189000,
    highPrice: 210000,
    image: `${SITE_URL}/assets/imagenes/mg105/industrial_luminous_house_exterior.webp`,
    desc: 'Vivienda Passivhaus MG 105 de 105 m² con espacios fluidos orientados a radiación solar pasiva, triple acristalamiento y estructura de madera CNC.',
  },
  128: {
    code: 'MG 128',
    builtM2: 128,
    usefulM2: 128,
    floors: 1,
    rooms: '3 - 4',
    baths: '2',
    lowPrice: 230400,
    highPrice: 256000,
    image: `${SITE_URL}/assets/imagenes/mg128/boho_autumn_exterior.webp`,
    desc: 'Modelo de referencia Medgón MG 128 de 128 m² en madera técnica con patio bioclimático, 3-4 dormitorios y certificación Passivhaus Classic.',
  },
  148: {
    code: 'MG 148',
    builtM2: 148,
    usefulM2: 148,
    floors: 2,
    rooms: '4',
    baths: '3',
    lowPrice: 266400,
    highPrice: 296000,
    image: `${SITE_URL}/assets/imagenes/mg148/l_shaped_farmhouse_golden_hour.webp`,
    desc: 'Casa Passivhaus en L modelo MG 148 de 148 m² con suite en planta baja, 4 dormitorios, 3 baños y ensayo Blower Door n50 ≤ 0,5.',
  },
  165: {
    code: 'MG 165',
    builtM2: 165,
    usefulM2: 148,
    floors: 2,
    rooms: '4 - 5',
    baths: '3',
    lowPrice: 297000,
    highPrice: 330000,
    image: `${SITE_URL}/assets/imagenes/mg165/coastal_l_shaped_home.webp`,
    desc: 'Vivienda unifamiliar contemporánea MG 165 de 165 m² construidos (148 m² útiles) en dos plantas, 4-5 dormitorios, porches bioclimáticos integrados y eficiencia ECCN.',
  },
};

function buildModelProductLd(num) {
  const m = MODEL_SPECS[num];
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/mg${num}#product`,
    name: `Modelo ${m.code} · Casa Passivhaus ${m.builtM2} m²`,
    description: m.desc,
    image: m.image,
    url: `${SITE_URL}/mg${num}`,
    sku: `MEDGON-${m.code.replace(/\s+/g, '')}`,
    size: `${m.builtM2} m²`,
    brand: {
      '@type': 'Brand',
      name: 'Medgón Passivhaus S.L.',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Medgón Passivhaus S.L.',
      url: SITE_URL,
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Superficie construida',
        value: m.builtM2,
        unitCode: 'MTK',
        unitText: 'm²',
      },
      {
        '@type': 'PropertyValue',
        name: 'Superficie útil',
        value: m.usefulM2,
        unitCode: 'MTK',
        unitText: 'm²',
      },
      {
        '@type': 'PropertyValue',
        name: 'Plantas',
        value: m.floors,
      },
      {
        '@type': 'PropertyValue',
        name: 'Dormitorios',
        value: m.rooms,
      },
      {
        '@type': 'PropertyValue',
        name: 'Estándar energético',
        value: 'Passivhaus · Hermeticidad n50 ≤ 0,6 ren/h',
      },
    ],
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: m.lowPrice,
      priceValidUntil: '2026-12-31',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/mg${num}`,
      seller: {
        '@type': 'Organization',
        name: 'Medgón Passivhaus S.L.',
      },
    },
  };
}

function getWebpSize(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    if (buf.toString('ascii', 0, 4) !== 'RIFF') return null;
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') {
      return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    }
    if (chunk === 'VP8L') {
      const b0 = buf[21], b1 = buf[22], b2 = buf[23], b3 = buf[24];
      return {
        w: 1 + (((b1 & 0x3f) << 8) | b0),
        h: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
      };
    }
    if (chunk === 'VP8X') {
      return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) };
    }
  } catch {}
  return null;
}

const IMAGE_SIZES = {};
function indexImages(dir, basePrefix = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = basePrefix ? `${basePrefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      indexImages(full, rel);
    } else if (entry.name.endsWith('.webp')) {
      const sz = getWebpSize(full);
      if (sz) IMAGE_SIZES[`assets/imagenes/${rel}`] = sz;
    }
  }
}
indexImages(path.join(rootDir, 'public/assets/imagenes'));

const EXTERNAL_IMAGE_SIZES = {
  'unicef-siria-turquia-300x220.webp': { w: 300, h: 220 },
  'contra-el-cancer.webp': { w: 320, h: 120 },
  'manos-unidas-logo.webp': { w: 320, h: 120 },
  'logo-ministerio-1.webp': { w: 360, h: 80 },
  'iges-banner-web.webp': { w: 960, h: 280 },
  'iges-banner-medgon.webp': { w: 960, h: 280 },
};

function getPageSeo(filename, existingLdList) {
  const ogDefault = `${SITE_URL}/assets/imagenes/generales/Frontal_HeroCasa_Mediterranea.webp`;

  const mPrimary = filename.match(/^mg(\d+)\.html$/);
  if (mPrimary) {
    const num = Number(mPrimary[1]);
    const m = MODEL_SPECS[num];
    return {
      title: `${m.code} (${m.builtM2} m²) · Casa Passivhaus Industrializada | Medgón`,
      description: m.desc,
      canonical: `${SITE_URL}/mg${num}`,
      ogImage: m.image,
      heroPreload: m.image.replace(`${SITE_URL}/`, ''),
      inSitemap: true,
      priority: '0.9',
      changefreq: 'monthly',
      ldBlocks: [buildModelProductLd(num)],
    };
  }

  const mAlias = filename.match(/^modelo-mg-(\d+)\.html$/);
  if (mAlias) {
    const num = Number(mAlias[1]);
    const m = MODEL_SPECS[num];
    return {
      title: `Modelo ${m.code} Passivhaus · Plano, Memoria y Precio Cerrado | Medgón`,
      description: `Consulta la ficha arquitectónica completa del modelo ${m.code} (${m.builtM2} m² construidos, ${m.usefulM2} m² útiles), planos y sistema constructivo Medgón.`,
      canonical: `${SITE_URL}/mg${num}`,
      ogImage: m.image,
      heroPreload: m.image.replace(`${SITE_URL}/`, ''),
      inSitemap: false,
      ldBlocks: [buildModelProductLd(num)],
    };
  }

  const staticMeta = {
    'index.html': {
      title: 'Medgón Passivhaus · Casas Industrializadas de Madera Técnica',
      description:
        'Fabricante líder en España de viviendas Passivhaus industrializadas en Carrión de los Condes (Palencia). Modelos cerrados de 87 a 165 m² y a medida.',
      canonical: `${SITE_URL}/`,
      ogImage: ogDefault,
      heroPreload: 'assets/imagenes/generales/Frontal_HeroCasa_Mediterranea.webp',
      inSitemap: true,
      priority: '1.0',
      changefreq: 'weekly',
      ldBlocks: [HOME_BUSINESS_LD, HOME_FAQ_LD],
    },
    'catalogo.html': {
      title: 'Catálogo de Viviendas Passivhaus 2026 (87–165 m²) · Medgón',
      description:
        'Explora todos los modelos de casas industrializadas Passivhaus Medgón de 87 a 165 m², planos técnicos, precios cerrados y viviendas modulares a medida.',
      canonical: `${SITE_URL}/catalogo`,
      ogImage: ogDefault,
      inSitemap: true,
      priority: '0.9',
      changefreq: 'weekly',
      preserveLdGraph: true,
    },
    'passivhaus.html': {
      title: 'Qué es Passivhaus: Casas Pasivas Explicadas Claro | Medgón',
      description:
        'Descubre qué es Passivhaus sin tecnicismos: ahorra hasta un 85 % en climatización, respira aire filtrado y disfruta de 21 °C constantes todo el año.',
      canonical: `${SITE_URL}/passivhaus`,
      ogImage: ogDefault,
      heroPreload: 'assets/imagenes/generales/Frontal_HeroCasa_Mediterranea.webp',
      inSitemap: true,
      priority: '0.9',
      changefreq: 'monthly',
      preserveLdGraph: true,
    },
    'viviendas-a-medida.html': {
      title: 'Viviendas Modulares a Medida (+200 m²) · Sistema MÓDULO | Medgón',
      description:
        'Arquitectura modular Passivhaus de autor a partir de 200 m². Sistema industrializado MÓDULO junto a Marcos Martínez Parga Estudio en madera técnica.',
      canonical: `${SITE_URL}/viviendas-a-medida`,
      ogImage: `${SITE_URL}/assets/imagenes/medida/vivienda_medida_gran_formato_exterior.webp`,
      heroPreload: 'assets/imagenes/medida/vivienda_medida_gran_formato_exterior.webp',
      inSitemap: true,
      priority: '0.85',
      changefreq: 'monthly',
      ldBlocks: [
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          '@id': `${SITE_URL}/viviendas-a-medida#product`,
          name: 'Viviendas Modulares Passivhaus a Medida (+200 m²) · Sistema MÓDULO',
          description:
            'Viviendas de autor de diseño libre a partir de 200 m² con estructura industrializada en madera técnica y certificación Passivhaus.',
          image: `${SITE_URL}/assets/imagenes/medida/vivienda_medida_gran_formato_exterior.webp`,
          url: `${SITE_URL}/viviendas-a-medida`,
          size: '+200 m²',
          brand: { '@type': 'Brand', name: 'Medgón Passivhaus S.L.' },
          manufacturer: ORG_ENTITY,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: 360000,
            availability: 'https://schema.org/InStock',
            url: `${SITE_URL}/viviendas-a-medida`,
          },
        },
      ],
    },
    'como-funciona.html': {
      title: 'Cómo Funciona el Proceso y Precios Passivhaus · Medgón',
      description:
        'Conoce las fases de diseño, fabricación robotizada CNC en 4 a 6 meses, montaje en parcela y las modalidades de precio cerrado Medgón Passivhaus.',
      canonical: `${SITE_URL}/como-funciona`,
      ogImage: ogDefault,
      inSitemap: true,
      priority: '0.85',
      changefreq: 'monthly',
      preserveLdGraph: true,
    },
    'contacto.html': {
      title: 'Contacto y Estudio Gratuito de Parcela · Medgón Passivhaus',
      description:
        'Solicita un estudio técnico gratuito de tu parcela en menos de 48 horas. Sede central y fábrica industrializada en Carrión de los Condes (Palencia).',
      canonical: `${SITE_URL}/contacto`,
      ogImage: `${SITE_URL}/assets/imagenes/generales/medgon_fachada_corregida.webp`,
      inSitemap: true,
      priority: '0.85',
      changefreq: 'monthly',
      ldBlocks: [
        {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_ENTITY,
            {
              '@type': 'ContactPage',
              '@id': `${SITE_URL}/contacto#webpage`,
              url: `${SITE_URL}/contacto`,
              name: 'Contacto y Estudio Técnico de Parcela · Medgón Passivhaus',
              about: { '@id': `${SITE_URL}/#organization` },
            },
          ],
        },
      ],
    },
    'blog.html': {
      title: 'Blog Técnico de Construcción Passivhaus y Madera · Medgón',
      description:
        'Artículos y guías prácticas sobre arquitectura pasiva Passivhaus, ventilación mecánica VMC de doble flujo, costes por m² y ensayos Blower Door.',
      canonical: `${SITE_URL}/blog`,
      ogImage: ogDefault,
      inSitemap: true,
      priority: '0.8',
      changefreq: 'weekly',
      ldBlocks: [
        {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_ENTITY,
            {
              '@type': 'Blog',
              '@id': `${SITE_URL}/blog#blog`,
              url: `${SITE_URL}/blog`,
              name: 'Blog Técnico de Construcción Passivhaus y Madera · Medgón',
              publisher: { '@id': `${SITE_URL}/#organization` },
            },
          ],
        },
      ],
    },
    'post.html': {
      title: 'Artículo Técnico Passivhaus · Blog Oficial Medgón',
      description:
        'Guía divulgativa y técnica sobre construcción industrializada en madera técnica, eficiencia energética casi nula y confort térmico Passivhaus.',
      canonical: `${SITE_URL}/post`,
      ogImage: ogDefault,
      inSitemap: false,
      ldBlocks: [
        {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_ENTITY,
            {
              '@type': 'Article',
              '@id': `${SITE_URL}/post#article`,
              headline: 'Divulgación Técnica Medgón Passivhaus',
              publisher: { '@id': `${SITE_URL}/#organization` },
              mainEntityOfPage: `${SITE_URL}/post`,
            },
          ],
        },
      ],
    },
    'nuestro-sistema.html': {
      title: 'Sistema Constructivo: Entramado Ligero y Forjados Kerto Ripa · Medgón',
      description:
        'Cómo construimos tu casa Passivhaus en madera técnica: muros de entramado ligero con fibra de madera insuflada, forjados Kerto Ripa con Marcado CE y hermeticidad certificada.',
      canonical: `${SITE_URL}/nuestro-sistema`,
      ogImage: `${SITE_URL}/assets/imagenes/sistema/sistema-forjado-estructuras.webp`,
      inSitemap: true,
      priority: '0.8',
      changefreq: 'monthly',
      preserveLdGraph: true,
    },
    'proyectos-destacados.html': {
      title: 'Proyectos Destacados Passivhaus (48 Obras) · Medgón',
      description:
        'Explora nuestra galería de 48 proyectos destacados en España: viviendas unifamiliares, plurifamiliares, colegios y edificios terciarios Passivhaus en madera técnica.',
      canonical: `${SITE_URL}/proyectos-destacados`,
      ogImage: `${SITE_URL}/assets/imagenes/proyectos/oficinas-medgon.webp`,
      heroPreload: 'assets/imagenes/proyectos/oficinas-medgon.webp',
      inSitemap: true,
      priority: '0.85',
      changefreq: 'monthly',
      preserveLdGraph: true,
    },
    'rsc.html': {
      title: 'RSC, Sostenibilidad, ODS y Huella de Carbono · Medgón',
      description:
        'Compromiso corporativo Medgón con los Objetivos de Desarrollo Sostenible (ODS), certificación ISO 14064-1 de huella de carbono, igualdad y Medgón Solidario.',
      canonical: `${SITE_URL}/rsc`,
      ogImage: ogDefault,
      inSitemap: true,
      priority: '0.6',
      changefreq: 'yearly',
      ldBlocks: [
        {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_ENTITY,
            {
              '@type': 'WebPage',
              '@id': `${SITE_URL}/rsc#webpage`,
              url: `${SITE_URL}/rsc`,
              name: 'Responsabilidad Social Corporativa y Sostenibilidad · Medgón',
              about: { '@id': `${SITE_URL}/#organization` },
            },
          ],
        },
      ],
    },
    'i-d.html': {
      title: 'I+D+i en Construcción Industrializada y Madera · Medgón',
      description:
        'Proyectos de investigación y desarrollo tecnológico (IND-KIT, INDUCE, CLIC, SOCAI, IGES) cofinanciados por FEDER e ICE para automatización en madera.',
      canonical: `${SITE_URL}/i-d`,
      ogImage: ogDefault,
      inSitemap: true,
      priority: '0.65',
      changefreq: 'yearly',
      ldBlocks: [
        {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_ENTITY,
            {
              '@type': 'WebPage',
              '@id': `${SITE_URL}/i-d#webpage`,
              url: `${SITE_URL}/i-d`,
              name: 'Proyectos I+D+i y Tecnología Constructiva · Medgón',
              about: { '@id': `${SITE_URL}/#organization` },
            },
          ],
        },
      ],
    },
    'inversion.html': {
      title: 'Inversión Productiva y Alianzas Industriales · Medgón',
      description:
        'Modernización industrial, líneas robotizadas de ensamblaje y programas de inversión PYMES apoyados por fondos europeos FEDER y Junta de Castilla y León.',
      canonical: `${SITE_URL}/inversion`,
      ogImage: ogDefault,
      inSitemap: true,
      priority: '0.6',
      changefreq: 'yearly',
      ldBlocks: [
        {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_ENTITY,
            {
              '@type': 'WebPage',
              '@id': `${SITE_URL}/inversion#webpage`,
              url: `${SITE_URL}/inversion`,
              name: 'Inversión y Desarrollo Industrial · Medgón',
              about: { '@id': `${SITE_URL}/#organization` },
            },
          ],
        },
      ],
    },
    'productos-cubiertas.html': {
      title: 'Cubiertas de Madera de Alta Precisión y Escaneado 3D · Medgón',
      description:
        'Cálculo, diseño y fabricación robotizada CNC de cubiertas ligeras de madera con escaneado 3D Leica Geosystems para obra nueva y rehabilitación.',
      canonical: `${SITE_URL}/productos-cubiertas`,
      ogImage: `${SITE_URL}/assets/imagenes/generales/productos_medgon_cubiertas_fachadas_Remontas_596a0995.webp`,
      inSitemap: true,
      priority: '0.8',
      changefreq: 'monthly',
      preserveLdGraph: true,
    },
    'productos-derecho-vuelo.html': {
      title: 'Remontas y Derecho de Vuelo en Madera Técnica · Medgón',
      description:
        'Ampliación en altura sobre edificios existentes mediante derecho de vuelo y estructuras ligeras industrializadas Passivhaus sin sobrecargar cimentación.',
      canonical: `${SITE_URL}/productos-derecho-vuelo`,
      ogImage: `${SITE_URL}/assets/imagenes/generales/productos_medgon_cubiertas_fachadas_Remontas_596a0995.webp`,
      inSitemap: true,
      priority: '0.8',
      changefreq: 'monthly',
      preserveLdGraph: true,
    },
    'productos-fachadas.html': {
      title: 'Fachadas Industrializadas 2D y Construcción Híbrida · Medgón',
      description:
        'Módulos de fachada industrializada 2D en madera técnica con aislamiento continuo y carpinterías instaladas en fábrica para acelerar promociones.',
      canonical: `${SITE_URL}/productos-fachadas`,
      ogImage: `${SITE_URL}/assets/imagenes/generales/productos_medgon_cubiertas_fachadas_Remontas_596a0995.webp`,
      inSitemap: true,
      priority: '0.8',
      changefreq: 'monthly',
      preserveLdGraph: true,
    },
    'productos-plurifamiliares.html': {
      title: 'Edificios Residenciales Plurifamiliares en Madera · Medgón',
      description:
        'Promociones residenciales colectivas, build-to-rent y vivienda pública en altura con envolventes Passivhaus industrializadas de madera técnica.',
      canonical: `${SITE_URL}/productos-plurifamiliares`,
      ogImage: ogDefault,
      inSitemap: true,
      priority: '0.8',
      changefreq: 'monthly',
      ldBlocks: [
        {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_ENTITY,
            {
              '@type': 'Service',
              '@id': `${SITE_URL}/productos-plurifamiliares#service`,
              name: 'Construcción Industrializada de Edificios Plurifamiliares en Madera',
              serviceType: 'Edificación Plurifamiliar Passivhaus',
              provider: { '@id': `${SITE_URL}/#organization` },
              areaServed: 'ES',
              url: `${SITE_URL}/productos-plurifamiliares`,
            },
          ],
        },
      ],
    },
    'productos-terciario.html': {
      title: 'Edificios Terciarios, Docentes y Dotacionales Passivhaus · Medgón',
      description:
        'Grandes luces con forjados Kerto-Ripa, confort acústico y eficiencia energética casi nula para colegios, oficinas, clínicas y dotaciones públicas.',
      canonical: `${SITE_URL}/productos-terciario`,
      ogImage: ogDefault,
      inSitemap: true,
      priority: '0.8',
      changefreq: 'monthly',
      ldBlocks: [
        {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_ENTITY,
            {
              '@type': 'Service',
              '@id': `${SITE_URL}/productos-terciario#service`,
              name: 'Edificación Industrializada Terciaria y Dotacional en Madera',
              serviceType: 'Edificación Terciaria Passivhaus',
              provider: { '@id': `${SITE_URL}/#organization` },
              areaServed: 'ES',
              url: `${SITE_URL}/productos-terciario`,
            },
          ],
        },
      ],
    },
    'productos-unifamiliares.html': {
      title: 'Viviendas Unifamiliares Passivhaus para Arquitectos · Medgón',
      description:
        'Industrializamos el proyecto redactado por tu arquitecto con precisión de taller robotizado CNC, trazabilidad CE y hermeticidad Passivhaus garantizada.',
      canonical: `${SITE_URL}/productos-unifamiliares`,
      ogImage: ogDefault,
      heroPreload: 'assets/imagenes/generales/Frontal_HeroCasa_Mediterranea.webp',
      inSitemap: true,
      priority: '0.8',
      changefreq: 'monthly',
      ldBlocks: [
        {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_ENTITY,
            {
              '@type': 'Service',
              '@id': `${SITE_URL}/productos-unifamiliares#service`,
              name: 'Industrialización de Viviendas Unifamiliares a Medida Passivhaus',
              serviceType: 'Vivienda Unifamiliar Passivhaus B2B/Autopromotor',
              provider: { '@id': `${SITE_URL}/#organization` },
              areaServed: 'ES',
              url: `${SITE_URL}/productos-unifamiliares`,
            },
          ],
        },
      ],
    },
  };

  const info = staticMeta[filename];
  if (!info) throw new Error(`Falta definición SEO para ${filename}`);

  if (info.preserveLdGraph && existingLdList.length > 0) {
    try {
      const parsed = JSON.parse(existingLdList[0]);
      if (parsed['@graph']) {
        info.ldBlocks = [parsed];
      } else {
        const cleanEntity = { ...parsed };
        delete cleanEntity['@context'];
        info.ldBlocks = [{ '@context': 'https://schema.org', '@graph': [ORG_ENTITY, cleanEntity] }];
      }
    } catch {
      info.ldBlocks = [{ '@context': 'https://schema.org', '@graph': [ORG_ENTITY] }];
    }
  }

  return info;
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inferImageDimensions(src, attrs) {
  const cleanSrc = src.split('?')[0];
  if (IMAGE_SIZES[cleanSrc]) {
    const sz = IMAGE_SIZES[cleanSrc];
    if (/w-24\s+h-16/.test(attrs)) return { w: 200, h: 130 };
    if (cleanSrc === 'assets/imagenes/generales/logo_medgon.webp') {
      if (/w-\[200px\]|width=["']200["']/i.test(attrs)) return { w: 200, h: 87 };
      if (/h-8/.test(attrs)) return { w: 140, h: 61 };
      return { w: 180, h: 78 };
    }
    if (cleanSrc === 'assets/imagenes/generales/medgon20a.webp') {
      if (/w-\[300px\]|width=["']300["']/i.test(attrs)) return { w: 300, h: 101 };
      return { w: sz.w, h: sz.h };
    }
    return { w: sz.w, h: sz.h };
  }

  for (const [needle, dim] of Object.entries(EXTERNAL_IMAGE_SIZES)) {
    if (cleanSrc.includes(needle)) return dim;
  }
  if (/https:\/\/www\.medgon\.com\/wp-content/.test(cleanSrc)) {
    if (/max-h-12|h-8/.test(attrs)) return { w: 240, h: 80 };
    if (/max-h-28/.test(attrs)) return { w: 800, h: 220 };
    if (/max-h-44/.test(attrs)) return { w: 800, h: 360 };
    return { w: 800, h: 480 };
  }
  return { w: 1280, h: 720 };
}

function optimizeImgTags(bodyHtml, filename) {
  let primaryHeroAssigned = false;
  const isModelPage = /^(mg|modelo-mg-)\d+\.html$/.test(filename);
  const pagesWithHero = new Set([
    'index.html',
    'passivhaus.html',
    'viviendas-a-medida.html',
    'post.html',
    'productos-cubiertas.html',
    'productos-derecho-vuelo.html',
    'productos-fachadas.html',
    'productos-plurifamiliares.html',
    'productos-terciario.html',
    'productos-unifamiliares.html',
    'proyectos-destacados.html',
  ]);

  return bodyHtml.replace(/<img\b([^>]*)>/gi, (fullMatch, rawAttrs) => {
    let attrs = rawAttrs;
    const isSelfClosing = /\/\s*$/.test(attrs);
    if (isSelfClosing) attrs = attrs.replace(/\/\s*$/, '').trim();

    attrs = attrs.replace(
      /src=(["'])assets\/imagenes\/generales\/hero\.webp\1/gi,
      'src="assets/imagenes/generales/Frontal_HeroCasa_Mediterranea.webp"'
    );

    const srcMatch = attrs.match(/\bsrc=(["'])([^"']*)\1/i);
    const src = srcMatch ? srcMatch[2] : '';
    const idMatch = attrs.match(/\bid=(["'])([^"']*)\1/i);
    const idVal = idMatch ? idMatch[2] : '';
    const isLogo = src.includes('logo_medgon.webp') || src.includes('medgon20a.webp');
    const isHeaderLogo = isLogo && (/\bh-10\b/.test(attrs) || /\bw-\[300px\]/.test(attrs)) && !/\bw-\[200px\]/.test(attrs);
    const isHeroCandidate =
      !isLogo &&
      !primaryHeroAssigned &&
      (idVal === 'gallery-main-image' ||
        idVal === 'post-featured-image' ||
        (!isModelPage && pagesWithHero.has(filename)));

    attrs = attrs
      .replace(/\s+\bloading=(["']?)[a-zA-Z]+\1/gi, '')
      .replace(/\s+\bfetchpriority=(["']?)[a-zA-Z]+\1/gi, '')
      .replace(/\s+\bdecoding=(["']?)[a-zA-Z]+\1/gi, '')
      .replace(/\s+\bwidth=(["']?)\d+\1/gi, '')
      .replace(/\s+\bheight=(["']?)\d+\1/gi, '')
      .trim();

    const dim = inferImageDimensions(src, attrs);
    const extraAttrs = [`width="${dim.w}"`, `height="${dim.h}"`];

    if (isHeroCandidate) {
      primaryHeroAssigned = true;
      extraAttrs.push('loading="eager"');
      extraAttrs.push('fetchpriority="high"');
      extraAttrs.push('decoding="async"');
    } else if (isHeaderLogo) {
      extraAttrs.push('decoding="async"');
    } else {
      extraAttrs.push('loading="lazy"');
      extraAttrs.push('decoding="async"');
    }

    const closing = isSelfClosing ? ' />' : '>';
    return `<img ${attrs} ${extraAttrs.join(' ')}${closing}`;
  });
}

function optimizeHtmlFile(filePath, filename) {
  let html = fs.readFileSync(filePath, 'utf8');

  const existingLdList = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(
    (m) => m[1].trim()
  );

  const seo = getPageSeo(filename, existingLdList);
  const isPostPage = filename === 'post.html';
  const titleIdAttr = isPostPage ? ' id="meta-page-title"' : '';
  const descIdAttr = isPostPage ? ' id="meta-page-desc"' : '';
  const ogTitleIdAttr = isPostPage ? ' id="og-page-title"' : '';
  const ogDescIdAttr = isPostPage ? ' id="og-page-desc"' : '';
  const ogType = isPostPage ? 'article' : 'website';

  const heroPreloadTag = seo.heroPreload
    ? `\n  <link rel="preload" as="image" href="${seo.heroPreload}" fetchpriority="high">`
    : '';

  const blogPreconnectTags =
    filename === 'index.html' || filename === 'blog.html' || filename === 'post.html'
      ? `\n  <link rel="preconnect" href="https://medgon.com" crossorigin>\n  <link rel="dns-prefetch" href="https://medgon.com">`
      : '';

  const ldScripts = seo.ldBlocks
    .map(
      (block) =>
        `  <script type="application/ld+json">\n${JSON.stringify(block, null, 2)}\n  </script>`
    )
    .join('\n');

  const existingMsValidate = html.match(/<meta\s+name=["']msvalidate\.01["'][^>]*>/i);
  const msValidateTag = existingMsValidate ? `\n  ${existingMsValidate[0]}` : '';

  const newHead = `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title${titleIdAttr}>${escapeAttr(seo.title)}</title>
  <meta${descIdAttr} name="description" content="${escapeAttr(seo.description)}">
  <link rel="canonical" href="${seo.canonical}">${msValidateTag}
  <!-- <meta name="google-site-verification" content="AyMUI8PZh_H7WgF7qFUwALmmrcUis2_cl477-OSAdWg" /> -->
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="Medgón Passivhaus">
  <meta property="og:type" content="${ogType}">
  <meta property="og:url" content="${seo.canonical}">
  <meta property="og:title"${ogTitleIdAttr} content="${escapeAttr(seo.title)}">
  <meta property="og:description"${ogDescIdAttr} content="${escapeAttr(seo.description)}">
  <meta property="og:image" content="${seo.ogImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(seo.title)}">
  <meta name="twitter:description" content="${escapeAttr(seo.description)}">
  <meta name="twitter:image" content="${seo.ogImage}">
  <link rel="icon" type="image/webp" href="assets/iconos/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>${blogPreconnectTags}${heroPreloadTag}
  <link rel="preload" as="style" href="assets/css/styles.min.css">
  <link rel="stylesheet" href="assets/css/styles.min.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap"></noscript>
${ldScripts}
</head>`;

  html = html.replace(/<head\b[^>]*>[\s\S]*?<\/head>/i, newHead);

  const bodyIdx = html.search(/<body\b/i);
  if (bodyIdx !== -1) {
    const headPart = html.slice(0, bodyIdx);
    let bodyPart = html.slice(bodyIdx);

    bodyPart = bodyPart.replace(
      /<script\b([^>]*\bsrc=["'](js\/[^"']+)["'][^>]*)><\/script>/gi,
      (m, attrs) => {
        if (/\bdefer\b/i.test(attrs)) return m;
        return `<script ${attrs.trim()} defer></script>`;
      }
    );

    if (filename === 'index.html' || filename === 'blog.html') {
      bodyPart = bodyPart.replace(
        /assets\/imagenes\/generales\/hero\.webp/g,
        'assets/imagenes/generales/Frontal_HeroCasa_Mediterranea.webp'
      );
    }

    bodyPart = optimizeImgTags(bodyPart, filename);
    html = headPart + bodyPart;
  }

  fs.writeFileSync(filePath, html, 'utf8');
  return seo;
}

const rootHtmlFiles = fs
  .readdirSync(rootDir)
  .filter((f) => f.endsWith('.html'))
  .sort();

const sitemapEntries = [];

for (const file of rootHtmlFiles) {
  const seoRoot = optimizeHtmlFile(path.join(rootDir, file), file);
  const appFile = path.join(rootDir, 'app', file);
  if (fs.existsSync(appFile)) {
    optimizeHtmlFile(appFile, file);
  }
  if (seoRoot.inSitemap) {
    sitemapEntries.push({
      loc: seoRoot.canonical,
      changefreq: seoRoot.changefreq || 'monthly',
      priority: seoRoot.priority || '0.7',
    });
  }
}

sitemapEntries.sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority));

const today = new Date().toISOString().slice(0, 10);
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const robotsTxt = `# Medgón Passivhaus S.L. · Configuración de rastreo SEO
User-agent: *
Allow: /

# Evitar indexación de plantillas dinámicas y parámetros de filtrado
Disallow: /post
Disallow: /*?modelo=
Disallow: /*?dorm=
Disallow: /*?enviado=

Host: ${SITE_URL}
Sitemap: ${SITE_URL}/sitemap.xml
`;

const llmsTxt = `# Medgón Passivhaus S.L.

> Fabricante líder en España de viviendas Passivhaus industrializadas de estructura de madera técnica con precio y plazo cerrados, desde Carrión de los Condes (Palencia).

## Propuesta de valor

Medgón Passivhaus S.L. diseña, fabrica mediante control numérico CNC e instala envolventes herméticas y viviendas completas de consumo energético casi nulo bajo estándar Passivhaus (hermeticidad garantizada por contrato mediante ensayo Blower Door \`n50 ≤ 0,6 ren/h\`). Su sistema industrializado en madera técnica (entramado ligero y CLT de bosques certificados) elimina la incertidumbre de la obra tradicional, garantiza confort térmico continuo a 21 °C durante todo el año, calidad del aire interior filtrada 24 horas mediante VMC de doble flujo y ahorro energético de hasta el 85 %.

## Precios y plazos garantizados

- **Rango de precio terminado**: **1.700 – 1.900 €/m² + IVA** (opciones de suministro estructural y montaje desde ~1.100 €/m² + IVA según modalidad y alcance).
- **Plazo global de entrega**: **6 meses a 1 año** (incluyendo tramitación de licencias municipales).
- **Fabricación en taller (Palencia)**: 4 a 6 semanas mediante mecanizado robotizado CNC.
- **Montaje hermético en parcela**: 3 a 5 días con grúa.

## Catálogo de modelos industrializados (87 a 165 m²) y viviendas a medida

- **[MG 87](${SITE_URL}/mg87)**: 87 m² construidos (74,5 m² útiles) · 1 planta · 2–3 dormitorios · 1–2 baños · desde **156.600 €** (+ IVA).
- **[MG 100](${SITE_URL}/mg100)**: 100 m² construidos (86,2 m² útiles) · 1 planta · 3 dormitorios · 2 baños · desde **180.000 €** (+ IVA).
- **[MG 105](${SITE_URL}/mg105)**: 105 m² construidos y útiles · 1 planta · 3 dormitorios · 2 baños · desde **189.000 €** (+ IVA).
- **[MG 128](${SITE_URL}/mg128)**: 128 m² construidos y útiles · 1 planta con patio bioclimático · 3–4 dormitorios · 2 baños · desde **230.400 €** (+ IVA). Modelo de referencia Medgón.
- **[MG 148](${SITE_URL}/mg148)**: 148 m² construidos y útiles · 2 plantas en L con suite en planta baja · 4 dormitorios · 3 baños · desde **266.400 €** (+ IVA).
- **[MG 165](${SITE_URL}/mg165)**: 165 m² construidos (148 m² útiles) · 2 plantas con porches bioclimáticos · 4–5 dormitorios · 3 baños · desde **297.000 €** (+ IVA).
- **[Viviendas Modulares a Medida (+200 m²)](${SITE_URL}/viviendas-a-medida)**: Diseño arquitectónico libre de autor a partir de 200 m² basado en el sistema modular MÓDULO (junto a Marcos Martínez Parga Estudio).

## Modalidades de contratación

1. **Modalidad 01 · Suministro de Estructura**: Fabricación CNC de estructura técnica de madera y forjados en Carrión de los Condes, suministrada para constructoras o montadores homologados.
2. **Modalidad 02 · Suministro + Montaje**: Transporte y montaje oficial en parcela por equipos de Medgón, dejando la envolvente hermética y carpinterías de alta gama instaladas en días.
3. **Modalidad 03 · Suministro + Montaje + Instalaciones (Recomendada)**: Envolvente técnica completa con estructura, montaje, preinstalaciones en cámaras técnicas, cubierta aislada/impermeabilizada y fachada arquitectónica industrializada.
4. **Modalidad 04 · Llave en Mano**: Servicio integral desde cimentación hasta entrega de llaves en un único contrato (radio operativo habitual de 150 km desde Palencia y cobertura con asociados en Cataluña).

## Soluciones especializadas B2B y edificación singular

- **[¿Qué es Passivhaus? Guía clara](${SITE_URL}/passivhaus)**: Explicación práctica y calculadora de ahorro energético frente al CTE.
- **[Fachadas industrializadas 2D](${SITE_URL}/productos-fachadas)**: Módulos de cerramiento híbrido con aislamiento continuo y carpinterías montadas en taller.
- **[Cubiertas de madera Leica 3D](${SITE_URL}/productos-cubiertas)**: Escaneado láser 3D y mecanizado CNC para obra nueva y rehabilitación.
- **[Derecho de vuelo y remontas](${SITE_URL}/productos-derecho-vuelo)**: Ampliación en altura sobre edificios existentes con estructura ultraligera.
- **[Edificios plurifamiliares](${SITE_URL}/productos-plurifamiliares)**, **[Edificios terciarios y dotacionales](${SITE_URL}/productos-terciario)** y **[Viviendas unifamiliares para arquitectos](${SITE_URL}/productos-unifamiliares)**.

## Enlaces clave del sitio

- Inicio: ${SITE_URL}/
- Catálogo completo: ${SITE_URL}/catalogo
- Cómo funciona y precios: ${SITE_URL}/como-funciona
- Nuestro sistema constructivo: ${SITE_URL}/nuestro-sistema
- Proyectos destacados (48 obras): ${SITE_URL}/proyectos-destacados
- Blog técnico: ${SITE_URL}/blog
- Contacto y estudio de parcela gratuito: ${SITE_URL}/contacto

## Datos de contacto de fábrica y oficina técnica

- **Razón social**: Medgón Passivhaus S.L.
- **Dirección**: Polígono Industrial, nave 50 · 34120 Carrión de los Condes (Palencia, España)
- **Teléfono**: +34 979 88 10 10
- **Correo electrónico**: informacion@medgon.com
- **Web oficial**: ${SITE_URL}
`;

// Guardar robots.txt, sitemap.xml y llms.txt en raíz, /public/ y /app/
for (const targetDir of [rootDir, path.join(rootDir, 'public'), path.join(rootDir, 'app')]) {
  fs.writeFileSync(path.join(targetDir, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(targetDir, 'robots.txt'), robotsTxt, 'utf8');
  fs.writeFileSync(path.join(targetDir, 'llms.txt'), llmsTxt, 'utf8');
}

console.log(
  `[optimize-site] Actualizados ${rootHtmlFiles.length} HTML en raíz y /app/. Generados robots.txt, sitemap.xml (${sitemapEntries.length} URLs) y llms.txt en raíz, /public/ y /app/.`
);
