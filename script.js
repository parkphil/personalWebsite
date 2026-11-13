const $ = (selector) => document.querySelector(selector);
const projects = window.PORTFOLIO_PROJECTS || [];
const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = (value) => { if (!value) return ''; try { const u = new URL(value, location.href); return ['http:', 'https:', 'mailto:', 'file:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };

if ($('#work-list')) {
  const cards = projects.map((p, i) => {
    const image = safeUrl(p.image);
    const previewImages = Array.isArray(p.previewImages) ? p.previewImages.map(safeUrl).filter(Boolean) : [];
    const video = safeUrl(p.video);
    const poster = safeUrl(p.poster);
    const href = safeUrl(p.href);
    const preview = previewImages.length ? '<div class="phone-preview">' + previewImages.map((src, index) => '<img src="' + escapeHTML(src) + '" alt="' + escapeHTML(p.title) + ' iPhone screen ' + (index + 1) + '" loading="lazy">').join('') + '</div>' : video ? '<video class="preview-video" src="' + escapeHTML(video) + '" poster="' + escapeHTML(poster) + '" muted autoplay loop playsinline preload="metadata" aria-label="Preview of ' + escapeHTML(p.title) + '"></video>' : image ? '<img src="' + escapeHTML(image) + '" alt="' + escapeHTML(p.imageAlt || p.title) + '" loading="lazy">' : '<div class="empty-preview"><span>Project ' + String(i + 1).padStart(2, '0') + '</span><span>Image or video</span></div>';
    const title = '<span class="project-title">' + escapeHTML(p.title) + '</span><span class="project-subtitle">' + escapeHTML(p.subtitle) + '</span>';
    const external = href && new URL(href).origin !== location.origin ? 'target="_blank" rel="noreferrer"' : '';
    const heading = href ? '<a class="project-heading-link" href="' + escapeHTML(href) + '" ' + external + '>' + title + '<span class="project-arrow" aria-hidden="true">↗</span></a>' : '<div class="project-heading-link">' + title + '</div>';
    return '<article class="work-card' + (p.paired ? ' paired-card' : '') + '" id="work-' + escapeHTML(p.id) + '" aria-label="' + escapeHTML(p.title) + '"><h2>' + heading + '</h2>' + (href ? '<a href="' + escapeHTML(href) + '" ' + external + ' class="preview-link" aria-label="Open ' + escapeHTML(p.title) + '">' + preview + '</a>' : '<div class="preview-link">' + preview + '</div>') + (p.description ? '<p>' + escapeHTML(p.description) + '</p>' : '<p class="card-spacer" aria-hidden="true"></p>') + '</article>';
  });
  const pairedCards = cards.filter((_, i) => projects[i].paired);
  const otherCards = cards.filter((_, i) => !projects[i].paired);
  $('#work-list').innerHTML = (pairedCards.length ? '<div class="project-pair">' + pairedCards.join('') + '</div>' : '') + otherCards.join('');
  $('#work-index').innerHTML = projects.map((p, i) => '<a href="#work-' + escapeHTML(p.id) + '" data-index="' + i + '">' + escapeHTML(p.shortName || p.title) + '<span class="index-dot" aria-hidden="true"></span></a>').join('');

  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('.work-index a')];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    }), {rootMargin:'-35% 0px -35% 0px'});
    document.querySelectorAll('.work-card').forEach(card => observer.observe(card));
    const indexObserver = new IntersectionObserver(entries => {
      $('#work-index').classList.toggle('visible', entries[0].isIntersecting);
    }, {rootMargin: '0px 0px -5% 0px'});
    indexObserver.observe($('#work'));
  }
}

const contactToggle = $('.contact-toggle');
if (contactToggle) {
  const menu = $('#contact-menu');
  contactToggle.addEventListener('click', () => { const open = contactToggle.getAttribute('aria-expanded') !== 'true'; contactToggle.setAttribute('aria-expanded', String(open)); menu.hidden = !open; });
  document.addEventListener('click', e => { if (!e.target.closest('.contact-toggle, .contact-menu')) { contactToggle.setAttribute('aria-expanded','false'); menu.hidden = true; } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { contactToggle.setAttribute('aria-expanded','false'); menu.hidden = true; } });
}
const noteToggle = $('.site-note-toggle');
if (noteToggle) noteToggle.addEventListener('click', () => { const open = noteToggle.getAttribute('aria-expanded') !== 'true'; noteToggle.setAttribute('aria-expanded', String(open)); $('.site-note').hidden = !open; });
