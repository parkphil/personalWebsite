import createGlobe from 'cobe';

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

const albumCarousel = document.querySelector('[data-album-carousel]');

if (albumCarousel) {
  const albumCover = albumCarousel.querySelector('[data-album-cover]');
  const albumTitle = albumCarousel.querySelector('[data-album-title]');
  const albumArtist = albumCarousel.querySelector('[data-album-artist]');
  const albumCount = albumCarousel.querySelector('[data-album-count]');
  const albumWiki = albumCarousel.querySelector('[data-album-wiki]');
  const albumWikiLink = albumCarousel.querySelector('[data-album-wiki-link]');
  const albumSpotify = albumCarousel.querySelector('[data-album-spotify]');
  const albumPrevious = albumCarousel.querySelector('[data-album-prev]');
  const albumNext = albumCarousel.querySelector('[data-album-next]');
  const albums = [
    {
      title: "(What's the Story) Morning Glory?",
      artist: 'Oasis',
      cover: 'assets/album-oasis-morning-glory.png',
      wiki: 'https://en.wikipedia.org/wiki/(What%27s_the_Story)_Morning_Glory%3F',
      spotify: 'https://open.spotify.com/search/%28What%27s%20the%20Story%29%20Morning%20Glory%3F%20Oasis',
    },
    {
      title: 'Hopes and Fears',
      artist: 'Keane',
      cover: 'assets/album-keane-hopes-and-fears.png',
      wiki: 'https://en.wikipedia.org/wiki/Hopes_and_Fears',
      spotify: 'https://open.spotify.com/search/Hopes%20and%20Fears%20Keane',
    },
    {
      title: 'Préludes',
      artist: 'Claude Debussy · Jean-Yves Thibaudet',
      cover: 'assets/album-debussy-thibaudet.png',
      wiki: 'https://en.wikipedia.org/wiki/Jean-Yves_Thibaudet',
      spotify: 'https://open.spotify.com/search/Debussy%20Pr%C3%A9ludes%20Jean-Yves%20Thibaudet',
    },
    {
      title: 'Hiding in Plain Sight',
      artist: 'Drugdealer',
      cover: 'assets/album-drugdealer-hiding-in-plain-sight.png',
      wiki: 'https://en.wikipedia.org/wiki/Special:Search?search=Drugdealer%20Hiding%20in%20Plain%20Sight',
      spotify: 'https://open.spotify.com/search/Hiding%20in%20Plain%20Sight%20Drugdealer',
    },
    {
      title: 'Jubilee',
      artist: 'Japanese Breakfast',
      cover: 'assets/album-japanese-breakfast-jubilee.png',
      wiki: 'https://en.wikipedia.org/wiki/Jubilee_(Japanese_Breakfast_album)',
      spotify: 'https://open.spotify.com/search/Jubilee%20Japanese%20Breakfast',
    },
  ];
  let albumIndex = 0;

  const updateAlbum = () => {
    const album = albums[albumIndex];
    albumCarousel.classList.add('is-changing');
    window.setTimeout(() => {
      albumCover.src = album.cover;
      albumCover.alt = `Album cover for ${album.title}`;
      albumTitle.textContent = album.title;
      albumTitle.href = album.wiki;
      albumArtist.textContent = album.artist;
      albumCount.textContent = `Album ${albumIndex + 1} of ${albums.length}`;
      albumWiki.href = album.wiki;
      albumWikiLink.href = album.wiki;
      albumSpotify.href = album.spotify;
      albumCarousel.classList.remove('is-changing');
    }, 120);
  };

  albumPrevious?.addEventListener('click', () => {
    albumIndex = (albumIndex - 1 + albums.length) % albums.length;
    updateAlbum();
  });

  albumNext?.addEventListener('click', () => {
    albumIndex = (albumIndex + 1) % albums.length;
    updateAlbum();
  });
}

const globeCanvas = document.querySelector('[data-github-globe]');

if (globeCanvas) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const globeMarkers = [
    { location: [37.7749, -122.4194], size: 0.055 },
    { location: [40.7128, -74.006], size: 0.05 },
    { location: [51.5072, -0.1276], size: 0.045 },
    { location: [35.6764, 139.65], size: 0.052 },
    { location: [37.5665, 126.978], size: 0.044 },
    { location: [1.3521, 103.8198], size: 0.04 },
    { location: [-33.8688, 151.2093], size: 0.042 },
  ];

  const hexToUnitRgb = (color, fallback) => {
    const hex = color.trim();
    if (hex.startsWith('#') && hex.length === 4) {
      return hex
        .slice(1)
        .split('')
        .map((part) => parseInt(part + part, 16) / 255);
    }
    if (hex.startsWith('#') && hex.length === 7) {
      return [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
    }
    return fallback;
  };

  const initCobeGlobe = async () => {
    let globe = null;
    let phi = 0;
    let dragStart = null;
    let rotationOffset = 0;
    let targetRotationOffset = 0;
    let resizeTimer = null;

    const destroyGlobe = () => {
      if (globe) globe.destroy();
      globe = null;
    };

    const createConfiguredGlobe = () => {
      const rect = globeCanvas.getBoundingClientRect();
      const size = Math.max(220, Math.floor(rect.width));
      const styles = getComputedStyle(root);
      const blue = hexToUnitRgb(styles.getPropertyValue('--blue'), [0.2, 0.4, 0.8]);
      const isDark = root.getAttribute('data-color') === 'dark';

      destroyGlobe();
      globeCanvas.width = size * 2;
      globeCanvas.height = size * 2;

      globe = createGlobe(globeCanvas, {
        devicePixelRatio: 2,
        width: size * 2,
        height: size * 2,
        phi: 0,
        theta: 0.25,
        dark: isDark ? 1 : 0,
        diffuse: 1.1,
        mapSamples: 15000,
        mapBrightness: isDark ? 4.4 : 3.2,
        baseColor: isDark ? [0.16, 0.18, 0.2] : [0.93, 0.94, 0.95],
        markerColor: blue,
        glowColor: isDark ? [0.22, 0.27, 0.34] : [0.96, 0.97, 0.98],
        markers: globeMarkers,
        opacity: 0.98,
        scale: 1,
        onRender: (state) => {
          rotationOffset += (targetRotationOffset - rotationOffset) * 0.08;
          if (!dragStart && !reducedMotion.matches) phi += 0.004;
          state.phi = phi + rotationOffset;
          state.width = size * 2;
          state.height = size * 2;
        },
      });
    };

    const scheduleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(createConfiguredGlobe, 120);
    };

    globeCanvas.addEventListener('pointerdown', (event) => {
      dragStart = event.clientX - targetRotationOffset * 180;
      globeCanvas.setPointerCapture(event.pointerId);
    });

    globeCanvas.addEventListener('pointermove', (event) => {
      if (dragStart === null) return;
      targetRotationOffset = (event.clientX - dragStart) / 180;
    });

    const endDrag = () => {
      dragStart = null;
    };

    globeCanvas.addEventListener('pointerup', endDrag);
    globeCanvas.addEventListener('pointercancel', endDrag);
    new ResizeObserver(scheduleResize).observe(globeCanvas);

    const colorObserver = new MutationObserver(createConfiguredGlobe);
    colorObserver.observe(root, { attributes: true, attributeFilter: ['data-color'] });

    createConfiguredGlobe();
  };

  initCobeGlobe().catch(() => {
    globeCanvas.replaceWith(document.createTextNode('Interactive globe failed to load.'));
  });
}
