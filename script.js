import { projects } from './content.js';

const $ = (selector) => document.querySelector(selector);
const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = (value) => { if (!value) return ''; try { const u = new URL(value, location.href); return ['http:', 'https:', 'mailto:', 'file:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };

if ($('#work-list')) {
  $('#work-list').innerHTML = projects.map((p, i) => {
    const image = safeUrl(p.image);
    const href = safeUrl(p.href);
    const preview = image ? '<img src="' + escapeHTML(image) + '" alt="' + escapeHTML(p.imageAlt || p.title) + '" loading="lazy">' : '<div class="empty-preview"><span>Project ' + String(i + 1).padStart(2, '0') + '</span><span>Image or video</span></div>';
    const title = '<span class="project-title">' + escapeHTML(p.title) + '</span><span class="project-subtitle">' + escapeHTML(p.subtitle) + '</span>';
    const external = href.startsWith('http') ? 'target="_blank" rel="noreferrer"' : '';
    const heading = href ? '<a class="project-heading-link" href="' + escapeHTML(href) + '" ' + external + '>' + title + '<span class="project-arrow" aria-hidden="true">↗</span></a>' : '<div class="project-heading-link">' + title + '</div>';
    return '<article class="work-card" id="work-' + escapeHTML(p.id) + '" aria-label="' + escapeHTML(p.title) + '"><h2>' + heading + '</h2>' + (href ? '<a href="' + escapeHTML(href) + '" ' + external + ' class="preview-link" aria-label="Open ' + escapeHTML(p.title) + '">' + preview + '</a>' : '<div class="preview-link">' + preview + '</div>') + (p.description ? '<p>' + escapeHTML(p.description) + '</p>' : '<p class="card-spacer" aria-hidden="true"></p>') + '</article>';
  }).join('');
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

document.querySelectorAll('[data-craft-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.craftFilter;
  document.querySelectorAll('[data-craft-filter]').forEach(candidate => candidate.classList.toggle('selected', candidate === button));
  document.querySelectorAll('.craft-slot').forEach(slot => { slot.hidden = filter !== 'all' && slot.dataset.kind !== filter; });
}));

const canvas = $('#people-canvas');
if (canvas) {
  const context = canvas.getContext('2d');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, ratio = 1, figures = [];
  const random = (a,b) => a + Math.random() * (b-a);
  const inEllipse = (x,y,cx,cy,rx,ry) => ((x-cx)/rx)**2 + ((y-cy)/ry)**2 < 1;
  function figurePoints() {
    const points = [];
    for (let n=0;n<1050;n++) {
      const x=random(-13,13), y=random(-36,39);
      const head=inEllipse(x,y,0,-27,5,7);
      const torso=inEllipse(x,y,0,-8,6,15);
      const armL=Math.abs(x-(-6-(y+12)*.13))<2 && y>-17 && y<8;
      const armR=Math.abs(x-(6+(y+12)*.12))<2 && y>-17 && y<8;
      const legL=Math.abs(x-(-2-(y-4)*.15))<2.1 && y>3 && y<31;
      const legR=Math.abs(x-(2+(y-4)*.16))<2.1 && y>3 && y<31;
      const trail=y>14 && Math.random()<.11 && x<13 && x>-28;
      if (head||torso||armL||armR||legL||legR||trail) points.push({x,y,a:random(.18,.9),s:random(.45,1.2)});
    }
    return points;
  }
  function resize() {
    const box=canvas.getBoundingClientRect(); width=box.width; height=box.height; ratio=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*ratio); canvas.height=Math.round(height*ratio); context.setTransform(ratio,0,0,ratio,0,0);
    const count=Math.max(9,Math.round(width*height/52000));
    figures=Array.from({length:count},()=>{let x,y;do{x=random(0,width);y=random(0,height)}while(Math.abs(x-width/2)<Math.min(width*.32,390)&&Math.abs(y-height/2)<105);return {x,y,scale:random(.65,1.35),phase:random(0,6.28),speed:random(.05,.18),points:figurePoints()}});
  }
  function render(time=0) {
    context.clearRect(0,0,width,height);
    figures.forEach((f,i)=>{
      const t=time*.001;
      const x=f.x+Math.sin(t*f.speed+f.phase)*24;
      const y=f.y+Math.cos(t*f.speed*.7+f.phase)*16;
      context.save(); context.translate(x,y); context.rotate(-.18+Math.sin(t*.3+i)*.1); context.scale(f.scale,f.scale);
      for(const p of f.points){context.globalAlpha=p.a;context.fillStyle='#151515';context.fillRect(p.x,p.y,p.s,p.s)}
      context.restore();
    });
    if(!reduceMotion) requestAnimationFrame(render);
  }
  resize(); render(); addEventListener('resize',()=>{resize(); if(reduceMotion) render()});
}
