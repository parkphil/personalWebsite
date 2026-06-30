import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import '../script.js';

const lanyardRoot = document.querySelector('[data-lanyard-root]');

if (lanyardRoot) {
  let hasMountedLanyard = false;

  const mountLanyard = () => {
    if (hasMountedLanyard) return;
    hasMountedLanyard = true;
    lanyardRoot.dataset.lanyardStatus = 'loading';

    import('./Lanyard.jsx')
      .then(({ default: Lanyard }) => {
        lanyardRoot.dataset.lanyardStatus = 'mounting';
        const root = createRoot(lanyardRoot);
        flushSync(() => {
          root.render(
            <div className="lanyard-react-shell">
              <Lanyard
                position={[0.75, 0, 11]}
                fov={19}
                frontImage="/conference-log-card.svg"
                backImage="/conference-log-card.svg"
                lanyardWidth={0.42}
              />
            </div>,
          );
        });
        lanyardRoot.dataset.lanyardStatus = 'mounted';
      })
      .catch((error) => {
        lanyardRoot.dataset.lanyardStatus = 'failed';
        lanyardRoot.textContent = error instanceof Error ? error.message : 'Lanyard failed to mount.';
        throw error;
      });
  };

  lanyardRoot.dataset.lanyardStatus = 'waiting';

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        mountLanyard();
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );

    observer.observe(lanyardRoot);
  } else {
    mountLanyard();
  }
}
