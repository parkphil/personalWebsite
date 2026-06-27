const root = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const applySetting = (name, value) => {
  if (name === 'color' && value === 'automatic') {
    root.setAttribute('data-color', prefersDark.matches ? 'dark' : 'light');
    root.setAttribute('data-color-mode', 'automatic');
  } else {
    root.setAttribute(`data-${name}`, value);
    if (name === 'color') root.setAttribute('data-color-mode', value);
  }
};

applySetting('color', 'light');

document.querySelectorAll('.appearance input').forEach((input) => {
  input.addEventListener('change', () => {
    applySetting(input.name, input.value);
  });
});

const setPanelHidden = (panel, isHidden) => {
  panel.classList.toggle('panel-hidden', isHidden);
  panel.querySelector('.hide-panel').textContent = isHidden ? 'show' : 'hide';
  panel.querySelectorAll('nav, fieldset').forEach((content) => {
    content.hidden = isHidden;
  });
};

document.querySelectorAll('.hide-panel').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = button.closest('aside');
    setPanelHidden(panel, !panel.classList.contains('panel-hidden'));
  });
});

document.querySelector('.menu-button').addEventListener('click', () => {
  const contents = document.querySelector('.contents');
  setPanelHidden(contents, !contents.classList.contains('panel-hidden'));
});

prefersDark.addEventListener('change', () => {
  if (root.getAttribute('data-color-mode') === 'automatic') {
    applySetting('color', 'automatic');
  }
});

document.querySelector('.search').addEventListener('submit', (event) => {
  event.preventDefault();
  const query = document.querySelector('#site-search').value.trim().toLowerCase();
  if (!query) return;

  const candidates = [...document.querySelectorAll('h1, h2, h3, p, li, dt, dd')];
  const match = candidates.find((node) => node.textContent.toLowerCase().includes(query));
  match?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
