import './content.js';

const projectsRoot = document.querySelector('#projects');
const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];

function safeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function safeUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value, window.location.href);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

projectsRoot.innerHTML = projects.map((project, index) => {
  const title = safeText(project.title);
  const href = safeUrl(project.href);
  const image = safeUrl(project.image);
  const accent = /^#[0-9a-fA-F]{3,8}$/.test(project.accent || '') ? project.accent : '#e9e0d0';
  const visual = image
    ? `<img src="${safeText(image)}" alt="${safeText(project.imageAlt || title)}" loading="lazy" />`
    : `<div class="project-placeholder"><span class="placeholder-orbit" aria-hidden="true"></span><span>${safeText(project.visualLabel || 'Project')}</span></div>`;
  const action = href ? `<a class="project-action" href="${safeText(href)}" target="_blank" rel="noreferrer">${safeText(project.linkLabel || 'View project')} <span aria-hidden="true">↗</span></a>` : `<span class="project-upcoming">Project details coming soon</span>`;
  return `<article class="project-card${href ? '' : ' is-placeholder'}" style="--project-accent:${accent}">
    <div class="project-visual">${visual}<span class="visual-counter">${safeText(project.number || String(index + 1).padStart(2, '0'))} / ${String(projects.length).padStart(2, '0')}</span></div>
    <div class="project-details"><div class="project-topline"><span>${safeText(project.category)}</span><span>${safeText(project.year)}</span></div><h3>${title}</h3><p>${safeText(project.description)}</p>${action}</div>
  </article>`;
}).join('');

document.querySelector('#year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), {threshold: .1});
  document.querySelectorAll('.project-card, .section-heading, .about-content').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
}
