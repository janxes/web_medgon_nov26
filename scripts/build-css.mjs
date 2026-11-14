import fs from 'node:fs';
import path from 'node:path';
import { compile } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';
import { transform } from 'esbuild';

const rootDir = process.cwd();

const tailwindInput = `
@import "tailwindcss";

@theme {
  --font-sans: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif;
  --font-display: "Space Grotesk", sans-serif;
  --color-brand-fern: #23bd00;
  --color-brand-emerald: #23bd00;
  --color-brand-depths: #285943;
  --color-brand-mint: #d2f5d6;
  --color-brand-terracotta: #e25338;
  --color-brand-wheat: #f5ddb7;
  --color-brand-dark: #16181B;
  --color-brand-bg: #FAF8F5;
}
`;

const customCss = `
/* ==========================================================================
   MEDGÓN PASSIVHAUS - CRITICAL CSS & LAYOUT STABILITY (CLS 0.0 PREVENT)
   ========================================================================== */
header {
  min-height: 80px;
  background-color: #FAF8F5;
  display: block;
}
#mobile-menu-drawer {
  background-color: #FAF8F5 !important;
  background: #FAF8F5 !important;
}
header .max-w-7xl,
header > div,
header .flex {
  min-height: 80px;
}
main section:first-of-type {
  min-height: 520px;
}
@media (min-width: 640px) {
  main section:first-of-type {
    min-height: 720px;
  }
}
.hero-visual-critical {
  min-height: 380px;
  background-color: #16181B;
}
@media (min-width: 640px) {
  .hero-visual-critical {
    min-height: 500px;
  }
}
@media (min-width: 1024px) {
  .hero-visual-critical {
    min-height: 620px;
  }
}

/* ==========================================================================
   MEDGÓN PASSIVHAUS - PALETA CORPORATIVA OFICIAL
   ========================================================================== */
:root {
  --fiery-terracotta: #e25338;
  --wheat: #f5ddb7;
  --bright-fern: #23bd00;
  --emerald-depths: #285943;
  --frosted-mint: #d2f5d6;

  --logo-black: #16181B;
  --logo-white: #ffffff;
  --logo-gray: #2C313A;
  --logo-gray-light: #4A5160;
  --color-brand-bg: #FAF8F5;

  --color-brand-primary: var(--bright-fern);
  --color-brand-emerald: var(--bright-fern);
  --color-brand-emerald-dark: var(--emerald-depths);
  --color-brand-dark: var(--logo-black);
  --color-brand-slate: var(--logo-gray);
  --color-brand-muted: var(--logo-gray-light);
}

html {
  scroll-behavior: smooth;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  background-color: var(--color-brand-bg);
  color: var(--color-brand-dark);
}

::selection {
  background-color: rgba(35, 189, 0, 0.2);
  color: var(--color-brand-dark);
}

/* ==========================================================================
   MEDGÓN PASSIVHAUS - COMPONENTES REUTILIZABLES
   ========================================================================== */
.btn-cta-emerald,
.btn-cta-fern {
  background-color: var(--bright-fern, #23bd00);
  color: #ffffff;
  font-weight: 700;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}
.btn-cta-emerald:hover,
.btn-cta-fern:hover {
  background-color: var(--emerald-depths, #285943);
}

.badge-frosted-mint {
  background-color: var(--frosted-mint, #d2f5d6);
  color: var(--emerald-depths, #285943);
}

.badge-terracotta {
  background-color: var(--fiery-terracotta, #e25338);
  color: #ffffff;
}

.badge-wheat {
  background-color: var(--wheat, #f5ddb7);
  color: var(--logo-black, #16181B);
}

.card-shadow-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-shadow-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
}

/* ==========================================================================
   NAVEGACIÓN DESKTOP ROBUSTA Y ESTABLE (SIN PARPADEO NI PÉRDIDA DE HOVER)
   ========================================================================== */
header nav .nav-dropdown-item {
  position: relative;
}
header nav .nav-dropdown-panel {
  position: absolute;
  top: 100%;
  padding-top: 0.375rem;
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s;
  will-change: opacity, transform;
}
header nav .nav-dropdown-item:hover > .nav-dropdown-panel,
header nav .nav-dropdown-item.is-open > .nav-dropdown-panel,
header nav .nav-dropdown-item:focus-within > .nav-dropdown-panel {
  opacity: 1 !important;
  transform: translateY(0) !important;
  pointer-events: auto !important;
  visibility: visible !important;
}
header nav .nav-dropdown-item:hover button svg,
header nav .nav-dropdown-item.is-open button svg,
header nav .nav-dropdown-item:focus-within button svg {
  transform: rotate(180deg);
  color: #23bd00;
}
header nav .nav-dropdown-item.is-open button {
  color: #23bd00;
}
header nav .nav-hover-bridge {
  position: absolute;
  top: -0.875rem;
  left: 0;
  right: 0;
  height: 0.875rem;
  pointer-events: auto;
}

/* ==========================================================================
   MEJORA DE ACCESIBILIDAD Y LEGIBILIDAD (SENIORS & WCAG AAA)
   ========================================================================== */
p,
article p,
.card p,
section p,
.faq-answer,
.text-desc {
  font-size: 1.125rem !important;
  line-height: 1.7 !important;
  color: #2C313A;
}

ul:not([role="menubar"]):not(.nav-menu):not(nav ul):not(#mobile-menu-drawer ul) > li,
ol > li,
.modalidad-list li,
.specs-list li {
  font-size: 1.125rem !important;
  line-height: 1.65 !important;
  color: #2C313A;
}

.uppercase,
[class*="uppercase"],
.badge,
[class*="badge-"],
span.tracking-wider,
span.tracking-widest,
.tracking-wider,
.tracking-widest {
  font-size: max(0.95rem, 15px) !important;
  line-height: 1.45 !important;
  letter-spacing: 0.04em !important;
}

.text-\\[\\#5A606A\\],
.text-slate-600,
.text-slate-500 {
  color: #2C313A !important;
}

.text-\\[\\#8E95A2\\],
.text-slate-400 {
  color: #4A5160 !important;
}

footer,
footer p,
footer li,
footer a {
  font-size: 1.05rem !important;
  line-height: 1.6 !important;
}
footer a {
  color: #E2E8F0 !important;
  text-decoration: none;
  transition: color 0.15s ease;
}
footer a:hover,
footer a:focus {
  color: #ffffff !important;
}
footer ul li a {
  color: #E2E8F0 !important;
  display: inline-block;
  transition: color 0.15s ease;
}
footer ul li a:hover,
footer ul li a:focus {
  color: #23bd00 !important;
}
footer .text-slate-400,
footer .text-slate-500 {
  color: #CBD5E1 !important;
}
footer .text-slate-300 {
  color: #E2E8F0 !important;
}
footer .text-slate-200 {
  color: #F8FAFC !important;
}
footer .pt-8 a,
footer .pt-8 p {
  color: #CBD5E1 !important;
}
footer .pt-8 a:hover {
  color: #ffffff !important;
}

.bg-gradient-to-br p,
.bg-gradient-to-t p,
.bg-black\\/60 p,
.bg-\\[\\#16181B\\] p,
.text-white p,
.dark-card p {
  color: #F1F5F9 !important;
}

header nav a,
header nav button,
#mobile-menu-drawer a,
#mobile-menu-drawer button {
  font-size: 1rem !important;
  line-height: 1.4 !important;
}

/* Barra de desplazamiento personalizada para menú móvil */
#mobile-menu-drawer::-webkit-scrollbar {
  width: 6px;
}
#mobile-menu-drawer::-webkit-scrollbar-track {
  background: #FAF8F5;
  border-radius: 9999px;
}
#mobile-menu-drawer::-webkit-scrollbar-thumb {
  background: #23bd00;
  border-radius: 9999px;
}
#mobile-menu-drawer::-webkit-scrollbar-thumb:hover {
  background: #285943;
}

/* Compatibilidad utilidades galería sin barra */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* ==========================================================================
   ESTILOS TIPOGRÁFICOS DE ARTÍCULOS WP SOBRE FONDO BLANCO (POST.HTML)
   ========================================================================== */
.wp-article-content {
  color: #1E293B;
  font-size: 1.125rem;
  line-height: 1.9;
  word-break: break-word;
}
.wp-article-content > * + * {
  margin-top: 1.5rem;
}
.wp-article-content p {
  margin-bottom: 1.6rem;
  color: #334155 !important;
  font-size: 1.125rem !important;
  line-height: 1.9 !important;
}
.wp-article-content p strong,
.wp-article-content p b {
  color: #0F172A;
  font-weight: 700;
}
.wp-article-content h2 {
  color: #0F172A;
  font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
  font-size: 1.875rem;
  font-weight: 800;
  line-height: 1.3;
  margin-top: 3rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(13, 168, 54, 0.3);
  letter-spacing: -0.02em;
}
.wp-article-content h3 {
  color: #1E293B;
  font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
  font-size: 1.45rem;
  font-weight: 700;
  line-height: 1.35;
  margin-top: 2.25rem;
  margin-bottom: 1rem;
  letter-spacing: -0.01em;
}
.wp-article-content h4 {
  color: #1E293B;
  font-size: 1.2rem;
  font-weight: 700;
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
}
.wp-article-content a {
  color: #23bd00;
  text-decoration: underline;
  text-underline-offset: 4px;
  font-weight: 600;
  transition: color 0.2s ease;
}
.wp-article-content a:hover {
  color: #285943;
}
.wp-article-content ul {
  list-style-type: disc;
  padding-left: 1.75rem;
  margin-bottom: 1.6rem;
  color: #334155;
}
.wp-article-content ol {
  list-style-type: decimal;
  padding-left: 1.75rem;
  margin-bottom: 1.6rem;
  color: #334155;
}
.wp-article-content li {
  margin-bottom: 0.65rem;
  line-height: 1.8;
  padding-left: 0.35rem;
}
.wp-article-content li::marker {
  color: #23bd00;
  font-weight: bold;
}
.wp-article-content blockquote {
  position: relative;
  border-left: 4px solid #23bd00;
  background: #F0FDF4;
  border-top: 1px solid #DCFCE7;
  border-right: 1px solid #DCFCE7;
  border-bottom: 1px solid #DCFCE7;
  padding: 1.25rem 1.75rem;
  margin: 2rem 0;
  border-radius: 0 1rem 1rem 0;
  color: #166534;
  font-style: italic;
  font-size: 1.125rem;
  line-height: 1.75;
}
.wp-article-content img {
  max-width: 100%;
  height: auto;
  border-radius: 1rem;
  margin: 2.5rem auto;
  display: block;
  border: 1px solid #E2E8F0;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
  object-fit: cover;
  object-position: top;
}
.wp-article-content figure {
  margin: 2.5rem 0;
  text-align: center;
}
.wp-article-content figcaption {
  font-size: 0.85rem;
  color: #64748B;
  margin-top: 0.6rem;
  font-style: italic;
}
.wp-article-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  font-size: 0.95rem;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #E2E8F0;
}
.wp-article-content th {
  background: #F8FAFC;
  color: #0F172A;
  font-weight: 700;
  padding: 0.85rem 1rem;
  text-align: left;
  border-bottom: 2px solid #E2E8F0;
}
.wp-article-content td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #F1F5F9;
  color: #334155;
}
.wp-article-content tr:last-child td {
  border-bottom: none;
}
.wp-article-content pre,
.wp-article-content code {
  background: #F1F5F9;
  color: #0F172A;
  border-radius: 0.5rem;
  font-family: monospace;
  font-size: 0.9rem;
}
.wp-article-content pre {
  padding: 1rem 1.25rem;
  margin: 1.75rem 0;
  overflow-x: auto;
  border: 1px solid #E2E8F0;
}
.wp-article-content hr {
  border: 0;
  border-top: 1px solid #E2E8F0;
  margin: 3rem 0;
}
`;

async function buildCss() {
  const scanner = new Scanner({
    sources: [
      { base: rootDir, pattern: '*.html', negated: false },
      { base: rootDir, pattern: 'app/*.html', negated: false },
      { base: rootDir, pattern: 'public/js/*.js', negated: false },
      { base: rootDir, pattern: 'app/js/*.js', negated: false },
    ],
  });

  const candidates = scanner.scan();
  // Asegurar clases dinámicas utilizadas en JS y galerías
  const extraCandidates = [
    'ring-3', 'ring-[#23bd00]', 'opacity-100', 'opacity-60', 'border-transparent',
    'border-[#16181B]/15', 'bg-[#23bd00]/10', 'border-[#23bd00]/40',
    'overflow-hidden', 'rotate-180', 'bg-[#16181B]', 'text-white', 'shadow-xs',
    'bg-white', 'text-[#16181B]', 'hover:text-[#23bd00]', 'bg-transparent',
    'text-[#2C313A]', 'bg-[#23bd00]', 'bg-slate-100', 'text-slate-700',
    'hover:bg-slate-100', 'border-slate-200', 'col-span-full', 'py-12',
    'rounded-3xl', 'p-8', 'text-sm', 'text-slate-600', 'mb-4', 'px-5', 'py-2.5',
    'text-xs', 'font-bold', 'rounded-xl', 'cursor-pointer', 'text-[0.95rem]',
    'scale-102', 'group-hover:scale-102', 'group-hover:scale-105',
  ];
  const allCandidates = Array.from(new Set([...candidates, ...extraCandidates]));

  const compiled = await compile(tailwindInput, {
    base: rootDir,
    onDependency: () => {},
  });

  const generatedTailwindCss = compiled.build(allCandidates);
  const combinedCss = `${generatedTailwindCss}\n${customCss}`;

  const minified = await transform(combinedCss, {
    loader: 'css',
    minify: true,
    legalComments: 'none',
  });

  const outPaths = [
    path.join(rootDir, 'public/assets/css/styles.min.css'),
    path.join(rootDir, 'app/assets/css/styles.min.css'),
  ];

  for (const outPath of outPaths) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, minified.code, 'utf8');
  }

  console.log(
    `[build-css] Escaneados ${allCandidates.length} selectores. Generado styles.min.css (${(Buffer.byteLength(minified.code) / 1024).toFixed(2)} KB) en public/assets/css y app/assets/css.`
  );
}

buildCss().catch((err) => {
  console.error('[build-css] Error compilando CSS:', err);
  process.exit(1);
});
