const board = document.querySelector('.craft-wall');
const lightbox = document.querySelector('.craft-lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('p');

function openPiece(piece) {
  const image = piece.querySelector('img');
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = piece.querySelector('figcaption strong')?.textContent || '';
  lightbox.showModal();
}

board?.querySelectorAll('.craft-wall-item').forEach((piece) => {
  piece.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPiece(piece);
    }
  });

  piece.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch' || event.button !== 0 || window.matchMedia('(max-width: 550px)').matches) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const previousX = Number(piece.dataset.x || 0);
    const previousY = Number(piece.dataset.y || 0);
    let moved = false;
    piece.setPointerCapture(event.pointerId);

    const move = (next) => {
      if (Math.hypot(next.clientX - startX, next.clientY - startY) > 5) moved = true;
      if (!moved) return;
      piece.classList.add('is-dragging');
      piece.style.setProperty('--drag-x', `${previousX + next.clientX - startX}px`);
      piece.style.setProperty('--drag-y', `${previousY + next.clientY - startY}px`);
    };
    const end = (next) => {
      piece.removeEventListener('pointermove', move);
      piece.removeEventListener('pointerup', end);
      piece.removeEventListener('pointercancel', end);
      piece.classList.remove('is-dragging');
      if (moved) {
        piece.dataset.x = previousX + next.clientX - startX;
        piece.dataset.y = previousY + next.clientY - startY;
      } else if (next.type === 'pointerup') openPiece(piece);
    };
    piece.addEventListener('pointermove', move);
    piece.addEventListener('pointerup', end);
    piece.addEventListener('pointercancel', end);
  });

  piece.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 550px)').matches) openPiece(piece);
  });
});

lightbox?.querySelector('.craft-lightbox-close')?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
