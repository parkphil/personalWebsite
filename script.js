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
  const pageSize = 6;
  let activeFilter = 'all';
  let currentPage = 1;

  const updateMediaList = () => {
    const matchingItems = mediaItems.filter((item) => {
      return activeFilter === 'all' || item.dataset.kind === activeFilter;
    });
    const totalPages = Math.max(1, Math.ceil(matchingItems.length / pageSize));

    currentPage = Math.min(currentPage, totalPages);

    mediaItems.forEach((item) => {
      const itemIndex = matchingItems.indexOf(item);
      const matchesFilter = itemIndex !== -1;
      const isOnPage =
        itemIndex >= (currentPage - 1) * pageSize &&
        itemIndex < currentPage * pageSize;

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

const spotifyCarousel = document.querySelector('[data-spotify-carousel]');

if (spotifyCarousel) {
  const spotifyFrame = spotifyCarousel.querySelector('iframe');
  const spotifyCount = spotifyCarousel.querySelector('[data-spotify-count]');
  const spotifyPrevious = spotifyCarousel.querySelector('[data-spotify-prev]');
  const spotifyNext = spotifyCarousel.querySelector('[data-spotify-next]');
  const spotifyPlaylists = [
    'https://open.spotify.com/embed/playlist/4C2WsjL6g7zaxlkYVS5Kei?utm_source=generator&si=974d253f213642ab',
    'https://open.spotify.com/embed/playlist/6Y9daVn1CXw18THGEaJtZI?utm_source=generator&theme=0&si=ac8288ad2ff54671',
    'https://open.spotify.com/embed/playlist/1m3Z9xXj2rSRl7vVtK2fCo?utm_source=generator&si=589b5712cf7e43d3',
  ];
  let spotifyIndex = 0;

  const updateSpotifyPlaylist = () => {
    spotifyCount.textContent = `Playlist ${spotifyIndex + 1} of ${spotifyPlaylists.length}`;
    spotifyFrame.classList.add('is-changing');

    window.setTimeout(() => {
      spotifyFrame.src = spotifyPlaylists[spotifyIndex];
      spotifyFrame.addEventListener(
        'load',
        () => {
          spotifyFrame.classList.remove('is-changing');
        },
        { once: true },
      );
    }, 160);
  };

  spotifyPrevious?.addEventListener('click', () => {
    spotifyIndex = (spotifyIndex - 1 + spotifyPlaylists.length) % spotifyPlaylists.length;
    updateSpotifyPlaylist();
  });

  spotifyNext?.addEventListener('click', () => {
    spotifyIndex = (spotifyIndex + 1) % spotifyPlaylists.length;
    updateSpotifyPlaylist();
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
    const { default: createGlobe } = await import('https://esm.sh/cobe@0.6.3');
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
