// Birthday Template 1 — Party Pink

// ── Idle animations — each element starts idling after its own entry finishes

document.querySelectorAll(
  '.sticker--flowers, .sticker--disco, .sticker--kiss, .sticker--kiss-2,' +
  '.sticker--cocktail, .sticker--cocktail-2, .sticker--cocktail-3, .sticker--cocktail-4,' +
  '.piece--face, .piece--numbers, .piece--name, .piece--bday-text'
).forEach(el => {
  el.addEventListener('animationend', () => el.classList.add('idle'), { once: true });
});

// Time characters — staggered idle start
document.querySelectorAll('.time-char').forEach((ch, i) => {
  setTimeout(() => ch.classList.add('idle'), 600 + i * 120);
});

// ── Background music toggle ────────────────────────────────────────────────

const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

function setMusicButtonState(isPlaying) {
  musicToggle.classList.toggle('is-muted', !isPlaying);
  musicToggle.classList.toggle('playing', isPlaying);
  musicToggle.setAttribute('aria-label', isPlaying ? 'მუსიკის გამორთვა' : 'მუსიკის ჩართვა');
}

function tryPlayMusic(markPlayingOnSuccess) {
  if (!bgMusic) return;

  const playPromise = bgMusic.play();

  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.then(() => {
      if (markPlayingOnSuccess) setMusicButtonState(true);
    }).catch(() => {
      if (markPlayingOnSuccess) setMusicButtonState(false);
    });
  }
}

if (bgMusic && musicToggle) {
  bgMusic.volume = 0.35;
  setMusicButtonState(true);

  window.addEventListener('load', () => tryPlayMusic(false), { once: true });

  bgMusic.addEventListener('play', () => setMusicButtonState(true));
  bgMusic.addEventListener('pause', () => setMusicButtonState(false));

  // Mobile browsers (especially iOS Safari) often require a direct touch gesture
  // before allowing audible media. We "unlock" playback on the first gesture.
  let audioUnlocked = false;

  function unlockAudioFromGesture() {
    if (audioUnlocked) return;
    audioUnlocked = true;

    const playPromise = bgMusic.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.then(() => {
        setMusicButtonState(true);
      }).catch(() => {
        setMusicButtonState(false);
      });
    }
  }

  document.addEventListener('pointerdown', unlockAudioFromGesture, { once: true });
  document.addEventListener('touchstart', unlockAudioFromGesture, { once: true, passive: true });

  let lastToggleAt = 0;

  function handleMusicToggle() {
    const now = Date.now();
    if (now - lastToggleAt < 450) return;
    lastToggleAt = now;

    if (musicToggle.classList.contains('playing')) {
      bgMusic.pause();
      return;
    }

    tryPlayMusic(true);
  }

  musicToggle.addEventListener('click', handleMusicToggle);
  musicToggle.addEventListener('touchstart', handleMusicToggle, { passive: true });
}

// ── Schedule item popups ──────────────────────────────────────────────────

const colors = ['pink', 'teal', 'purple', 'peach'];

const overlay  = document.getElementById('schedOverlay');
const popup    = document.getElementById('schedPopup');
const emojiEl  = document.getElementById('schedEmoji');
const titleEl  = document.getElementById('schedTitle');
const infoEl   = document.getElementById('schedInfo');
const closeBtn = document.getElementById('schedClose');

function openPopup(item, index) {
  // bounce the row
  item.classList.remove('popping');
  void item.offsetWidth; // reflow to retrigger
  item.classList.add('popping');
  item.addEventListener('animationend', () => item.classList.remove('popping'), { once: true });

  // fill popup
  emojiEl.textContent  = item.dataset.emoji  || '';
  titleEl.textContent  = item.dataset.title  || '';
  infoEl.textContent   = item.dataset.info   || '';
  popup.dataset.color  = colors[index] || 'pink';

  // reset animation
  popup.style.animation = 'none';
  void popup.offsetWidth;
  popup.style.animation = '';

  overlay.classList.add('active');
}

function closePopup() {
  overlay.classList.remove('active');
}

document.querySelectorAll('.schedule-item').forEach((item, i) => {
  item.addEventListener('click', () => openPopup(item, i));
});

// ── Dresscode popup ───────────────────────────────────────────────────────

const dresscodeSpan = document.getElementById('dresscodeSpan');

dresscodeSpan.addEventListener('click', () => {
  // bounce the span
  dresscodeSpan.classList.remove('popping');
  void dresscodeSpan.offsetWidth;
  dresscodeSpan.classList.add('popping');
  dresscodeSpan.addEventListener('animationend', () => dresscodeSpan.classList.remove('popping'), { once: true });

  emojiEl.textContent = '🌸';
  titleEl.textContent = 'dress code: თავისუფალი';
  infoEl.textContent  = 'შეგიძლიათ ჩაიცვათ რა ფერიც გინდათ ✨';
  popup.dataset.color = 'lavender';

  popup.style.animation = 'none';
  void popup.offsetWidth;
  popup.style.animation = '';

  overlay.classList.add('active');
});

closeBtn.addEventListener('click', closePopup);

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closePopup();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopup();
});
