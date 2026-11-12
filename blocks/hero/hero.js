/**
 * Hero.
 * Rows: an image row, a content row, then optional two-cell option rows:
 *   Position | 77% 48%   (background focal point, default 50% 50%)
 *   Height   | 575px     (min-height)
 *   Overlay  | 0.6       (dim layer opacity; omitted = no dim layer)
 *   Link     | /path     (the whole hero becomes one link)
 * Variants: `cover` (background image, centred text), `banner` (see hero.css).
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const options = {};
  let picture;
  let content;
  rows.forEach((row) => {
    const cells = [...row.children];
    const key = cells.length === 2 ? cells[0].textContent.trim().toLowerCase() : '';
    if (['position', 'height', 'overlay', 'link'].includes(key)) {
      options[key] = key === 'link' ? (cells[1].querySelector('a')?.getAttribute('href') || cells[1].textContent.trim()) : cells[1].textContent.trim();
    } else if (!picture && row.querySelector('img') && !row.querySelector('h1, h2, h3')) {
      picture = row;
    } else if (!content) {
      content = cells.length === 1 ? cells[0] : row;
    }
  });

  const media = document.createElement('div');
  media.className = 'hero-media';
  if (picture) {
    const img = picture.querySelector('img');
    // background-image on a layer, as on the source (no <img> element in the painted output)
    media.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
    media.setAttribute('role', 'img');
    if (img.alt) media.setAttribute('aria-label', img.alt);
    if (options.position) media.style.backgroundPosition = options.position;
  }
  if (block.classList.contains('parallax')) media.classList.add('parallax');

  const dim = document.createElement('span');
  dim.className = 'hero-dim';
  dim.setAttribute('aria-hidden', 'true');
  if (options.overlay) dim.style.opacity = options.overlay;

  const inner = document.createElement('div');
  inner.className = 'hero-content';
  if (content) inner.append(...[...content.children]);
  // the source spaces heading, text and buttons with 25px spacer elements, not margins
  [...inner.children].slice(1).forEach((child) => {
    const spacer = document.createElement('div');
    spacer.className = 'hero-spacer';
    spacer.setAttribute('aria-hidden', 'true');
    child.before(spacer);
  });
  // each button sits inline-block in its own wrapper inside the flex row
  inner.querySelectorAll('.button-wrapper, p:has(> a.button)').forEach((row) => {
    const flex = document.createElement('div');
    flex.className = 'hero-buttons';
    row.querySelectorAll('a').forEach((a) => {
      const cell = document.createElement('div');
      cell.append(a);
      flex.append(cell);
    });
    row.replaceWith(flex);
  });

  if (options.height) block.style.minHeight = options.height;
  if (options.link) {
    const a = document.createElement('a');
    a.className = 'hero-link';
    a.href = options.link;
    a.append(media, dim, inner);
    block.replaceChildren(a);
  } else {
    block.replaceChildren(media, dim, inner);
  }
}
