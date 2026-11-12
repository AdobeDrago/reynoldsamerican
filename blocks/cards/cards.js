import { createOptimizedPicture } from '../../scripts/aem.js';

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  e.append(...children);
  return e;
}

/**
 * news: a carousel of article cards.
 * Rows: image | date | read time | title (linked). A one-cell row with only a link is the
 * closing "View All" slide.
 */
function decorateNews(block) {
  const slides = [...block.children].map((row) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      const a = cells[0].querySelector('a');
      const label = a ? a.textContent.trim() : '';
      const more = el('a', { href: a ? a.getAttribute('href') : '#' }, `${label}\u00a0\u00a0`, el('i', { class: 'news-icon-arrow', 'aria-hidden': 'true' }));
      return el('li', { class: 'news-slide news-slide-more' }, el('div', { class: 'news-more' }, more));
    }
    const [imgCell, dateCell, timeCell, titleCell] = cells;
    const titleLink = titleCell?.querySelector('a');
    const href = titleLink ? titleLink.getAttribute('href') : '#';
    const img = imgCell?.querySelector('picture') || imgCell?.querySelector('img');
    const media = el('a', { href, class: 'news-media', tabindex: '-1' });
    if (img) media.append(img);
    const meta = el(
      'div',
      { class: 'news-meta' },
      el('span', {}, el('i', { class: 'news-icon-date', 'aria-hidden': 'true' }), ` ${dateCell?.textContent.trim() || ''}`),
      el('span', {}, el('i', { class: 'news-icon-time', 'aria-hidden': 'true' }), ` ${timeCell?.textContent.trim() || ''}`),
    );
    const h3 = el('h3', {}, el('a', { href }, titleLink ? titleLink.textContent.trim() : (titleCell?.textContent.trim() || '')));
    return el('li', { class: 'news-slide' }, el('article', {}, media, meta, h3));
  });

  const track = el('ul', { class: 'news-track' }, ...slides);
  const viewport = el('div', { class: 'news-viewport' }, track);
  const prev = el('button', { type: 'button', class: 'news-prev', 'aria-label': 'Previous slide' });
  const next = el('button', { type: 'button', class: 'news-next', 'aria-label': 'Next slide' });
  const dots = el('div', { class: 'news-dots' });
  slides.forEach((_, i) => dots.append(el('button', { type: 'button', 'aria-label': `Go to slide ${i + 1}` })));
  viewport.append(dots);

  let index = 0;
  const go = (i) => {
    index = Math.max(0, Math.min(slides.length - 1, i));
    const step = slides[0].getBoundingClientRect().width + 20;
    track.style.transform = index ? `translateX(${-index * step}px)` : '';
    [...dots.children].forEach((d, n) => {
      if (n === index) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
  };
  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  [...dots.children].forEach((d, n) => d.addEventListener('click', () => go(n)));
  go(0);
  // freeze hook for the parity harness (carousels: ["hook"])
  window.freezeCarousels = () => go(0);

  block.replaceChildren(el('div', { class: 'news-slider' }, prev, next, viewport));
}

export default function decorate(block) {
  if (block.classList.contains('news')) {
    decorateNews(block);
    return;
  }
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture, img')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  // optimize same-origin (DA/EDS media) images only; external image URLs are kept as authored
  ul.querySelectorAll('picture > img').forEach((img) => {
    if (new URL(img.src, window.location.href).origin !== window.location.origin) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
  block.replaceChildren(ul);
}
