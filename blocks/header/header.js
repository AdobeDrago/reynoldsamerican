import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');
const IMG = `${window.hlx.codeBasePath}/images`;

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  e.append(...children);
  return e;
}

function closeAll(nav, except) {
  nav.querySelectorAll('.header-nav-toggle[aria-expanded="true"]').forEach((b) => {
    if (b !== except) b.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Nav fragment, three sections:
 * 1. utility links (ul) + stock quote placeholder (p)
 * 2. brand link to the home page
 * 3. main navigation: nested ul (top-level link, sub-list of links)
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  const [utilSec, brandSec, navSec] = [...fragment.children];

  // utility bar
  const utilLinks = utilSec?.querySelector('ul') || el('ul');
  const quote = utilSec?.querySelector('p');
  const stock = el('p', { class: 'header-stock' });
  if (quote) {
    const m = quote.textContent.trim().match(/^(.*?)\s*(\([^)]*\))$/);
    if (m) stock.append(m[1], el('span', {}, m[2]));
    else stock.textContent = quote.textContent.trim();
  }
  const search = el(
    'div',
    { class: 'header-search', 'aria-label': 'Click to Display Search' },
    el('img', {
      src: `${IMG}/SearchIcon.png`, alt: 'Open Search Bar', width: '22', height: '27',
    }),
  );
  const utility = el(
    'div',
    { class: 'header-utility' },
    el('div', { class: 'header-utility-inner' }, el('div', { class: 'header-utility-links' }, utilLinks), stock, search),
  );

  // brand
  const brandLink = brandSec?.querySelector('a');
  const logo = el(
    'a',
    { class: 'header-logo', href: brandLink ? brandLink.getAttribute('href') : '/', 'aria-label': 'Logo Link to Homepage' },
    el('img', {
      src: `${IMG}/growing-tomorrow-logo-1.png`, alt: brandLink ? brandLink.textContent.trim() : 'Home', width: '223', height: '125',
    }),
  );

  // main navigation
  const nav = el('nav', { id: 'nav', 'aria-label': 'Main navigation' });
  const topList = navSec?.querySelector('ul') || el('ul');
  topList.classList.add('header-nav-list');
  [...topList.children].forEach((li) => {
    li.classList.add('header-nav-item');
    const sub = li.querySelector(':scope > ul');
    if (!sub) return;
    sub.classList.add('header-nav-dropdown');
    const label = li.querySelector(':scope > a')?.textContent.trim() || '';
    const toggle = el('button', {
      class: 'header-nav-toggle', type: 'button', 'aria-expanded': 'false', 'aria-label': `Toggle ${label} submenu`,
    });
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      closeAll(nav, toggle);
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    sub.before(toggle);
  });
  nav.append(topList);

  const hamburger = el('button', {
    class: 'header-hamburger', type: 'button', 'aria-label': 'Open menu', 'aria-expanded': 'false',
  }, el('span'));
  hamburger.addEventListener('click', () => {
    const open = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', open ? 'false' : 'true');
    hamburger.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    block.classList.toggle('header-menu-open', !open);
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') closeAll(nav);
  });
  isDesktop.addEventListener('change', () => {
    block.classList.remove('header-menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
  });

  const main = el(
    'div',
    { class: 'header-main' },
    el('div', { class: 'header-container' }, el('div', { class: 'header-row' }, logo, nav, hamburger)),
  );

  block.textContent = '';
  block.append(utility, main);
}
