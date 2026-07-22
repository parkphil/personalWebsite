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

const readingLab = document.querySelector('[data-reading-lab]');

if (readingLab) {
  const filterButtons = [...readingLab.querySelectorAll('[data-filter]')];
  const mediaItems = [...readingLab.querySelectorAll('[data-kind]')];
  const pagination = readingLab.querySelector('[data-pagination]');
  const previousButton = readingLab.querySelector('[data-page-prev]');
  const nextButton = readingLab.querySelector('[data-page-next]');
  const pageStatus = readingLab.querySelector('[data-page-status]');
  const pageSize = 5;
  let activeFilter = 'all';
  let currentPage = 1;

  const updateMediaList = () => {
    const matchingItems = mediaItems
      .filter((item) => activeFilter === 'all' || item.dataset.kind === activeFilter)
      .sort((first, second) => {
        const firstTitle = first.querySelector('h3')?.textContent.trim() || '';
        const secondTitle = second.querySelector('h3')?.textContent.trim() || '';
        return firstTitle.localeCompare(secondTitle, undefined, { sensitivity: 'base' });
      });
    const totalPages = Math.max(1, Math.ceil(matchingItems.length / pageSize));

    currentPage = Math.min(currentPage, totalPages);

    mediaItems.forEach((item) => {
      const itemIndex = matchingItems.indexOf(item);
      const matchesFilter = itemIndex !== -1;
      const isOnPage =
        itemIndex >= (currentPage - 1) * pageSize &&
        itemIndex < currentPage * pageSize;

      item.style.order = matchesFilter ? String(itemIndex) : '';
      item.classList.toggle('is-hidden', !matchesFilter || !isOnPage);
    });

    if (pagination && previousButton && nextButton && pageStatus) {
      pagination.hidden = matchingItems.length <= pageSize;
      previousButton.disabled = currentPage === 1;
      nextButton.disabled = currentPage === totalPages;
      pageStatus.textContent = `Page ${currentPage} of ${totalPages}`;
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      currentPage = 1;

      filterButtons.forEach((candidate) => {
        candidate.setAttribute('aria-pressed', String(candidate === button));
      });

      updateMediaList();
    });
  });

  previousButton?.addEventListener('click', () => {
    currentPage = Math.max(1, currentPage - 1);
    updateMediaList();
  });

  nextButton?.addEventListener('click', () => {
    currentPage += 1;
    updateMediaList();
  });

  updateMediaList();
}
