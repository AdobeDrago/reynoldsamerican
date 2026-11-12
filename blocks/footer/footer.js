import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const IMG = `${window.hlx.codeBasePath}/images`;
const X_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="#0e2b63" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>';
const SOCIAL = { 'x.com': null, 'linkedin.com': 'linkedin.svg', 'instagram.com': 'Instagram.svg' };

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  e.append(...children);
  return e;
}

function rainbow() {
  return el('div', { class: 'footer-rainbow' });
}

/** groups a section's children into columns, one per h4 */
function columns(section) {
  const cols = [];
  const wrap = section.querySelector('.default-content-wrapper') || section;
  [...wrap.children].forEach((node) => {
    if (node.tagName === 'H4') cols.push({ head: node, items: [] });
    else if (cols.length) cols[cols.length - 1].items.push(node);
  });
  return cols;
}

function decorateItems(head, items) {
  const box = el('div', { class: 'footer-items' });
  const text = head.textContent.trim().toLowerCase();
  const links = items.flatMap((n) => (n.tagName === 'UL' ? [n] : [...n.querySelectorAll('a')]));
  if (text.startsWith('follow')) {
    box.classList.add('footer-social');
    links.forEach((a) => {
      const host = Object.keys(SOCIAL).find((h) => a.href.includes(h));
      const link = el('a', { href: a.href, 'aria-label': a.textContent.trim() });
      if (host && SOCIAL[host]) link.append(el('img', { src: `${IMG}/${SOCIAL[host]}`, alt: a.textContent.trim() }));
      else link.innerHTML = X_ICON;
      box.append(link);
    });
  } else if (text.includes('stock')) {
    box.classList.add('footer-stock');
    box.append(...items);
  } else if (items.some((n) => n.tagName === 'UL')) {
    box.append(...items.filter((n) => n.tagName === 'UL'));
  } else {
    box.classList.add('footer-list');
    links.forEach((a) => box.append(a));
  }
  return box;
}

/**
 * Footer fragment, three sections:
 * 1. link columns, each started by an h4 (Follow Us, Current Stock Price, Quick Links, Contact Us)
 * 2. brand line: group link + disclaimer paragraph
 * 3. legal links (ul)
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  const [colSec, brandSec, legalSec] = [...fragment.children];

  const grid = el('div', { class: 'footer-grid' });
  columns(colSec).forEach(({ head, items }) => {
    grid.append(el('div', { class: 'footer-col' }, el('div', { class: 'footer-heading' }, head), decorateItems(head, items)));
  });
  const top = el('div', { class: 'footer-top' }, el('div', { class: 'footer-container' }, grid));

  const brandLink = brandSec?.querySelector('a');
  const disclaimer = [...(brandSec?.querySelectorAll('p') || [])].filter((p) => !p.querySelector('a'));
  const brand = el(
    'div',
    { class: 'footer-brand' },
    el('img', {
      src: `${IMG}/reynolds_logo.png`, alt: 'Reynolds American', width: '157', height: '96',
    }),
  );
  if (brandLink) brand.append(brandLink, el('br'));
  brand.append(el('div', { class: 'footer-disclaimer' }, ...disclaimer));

  const legal = el('div', { class: 'footer-legal' }, el('div', { class: 'footer-legal-inner' }, legalSec?.querySelector('ul') || el('ul')));

  block.textContent = '';
  block.append(rainbow(), top, rainbow(), brand, legal);
}
