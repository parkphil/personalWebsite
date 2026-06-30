import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import '../script.js';
import Lanyard from './Lanyard.jsx';

const lanyardRoot = document.querySelector('[data-lanyard-root]');

if (lanyardRoot) {
  try {
    lanyardRoot.dataset.lanyardStatus = 'mounting';
    const root = createRoot(lanyardRoot);
    flushSync(() => {
      root.render(
        <div className="lanyard-react-shell">
          <Lanyard
            position={[0, 0, 24]}
            gravity={[0, -40, 0]}
            fov={21}
            frontImage="/lanyard-card-front.svg"
            backImage="/lanyard-card-back.svg"
            lanyardImage="/lanyard-band.svg"
            lanyardWidth={1.15}
          />
        </div>,
      );
    });
    lanyardRoot.dataset.lanyardStatus = 'mounted';
  } catch (error) {
    lanyardRoot.dataset.lanyardStatus = 'failed';
    lanyardRoot.textContent = error instanceof Error ? error.message : 'Lanyard failed to mount.';
    throw error;
  }
}
