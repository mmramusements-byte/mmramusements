// Web Audio API Synthesizer for Awwwards-quality organic UI interactions
// Zero network load, ultra low latency, works instantly out-of-the-box

let audioCtx = null;
let hasUserGesture = false;

// Register global listeners for first user gesture to unlock AudioContext cleanly
if (typeof window !== 'undefined') {
  const enableAudio = () => {
    hasUserGesture = true;
    cleanup();
  };
  const cleanup = () => {
    window.removeEventListener('click', enableAudio);
    window.removeEventListener('keydown', enableAudio);
    window.removeEventListener('touchstart', enableAudio);
  };
  window.addEventListener('click', enableAudio, { passive: true });
  window.addEventListener('keydown', enableAudio, { passive: true });
  window.addEventListener('touchstart', enableAudio, { passive: true });
}

function getAudioContext() {
  if (!hasUserGesture) {
    return null; // Prevent warnings prior to user interaction
  }
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser security auto-lock override)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {}); // Safely catch promise rejections
  }
  return audioCtx;
}

export const playHoverSound = () => {
  if (!hasUserGesture) return; // Fail fast silently to prevent console warnings
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Ultra short subtle futuristic frequency sweep
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Fail silently if browser blocks audio autoplay initially
  }
};

export const playClickSound = () => {
  hasUserGesture = true; // An explicit click counts as an immediate gesture
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // Fail silently
  }
};

export const playSuccessSound = () => {
  hasUserGesture = true; // An explicit action counts as an immediate gesture
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Quick ascending clean micro arpeggio
    const playNote = (freq, delay, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0.0, now + delay);
      gain.gain.linearRampToValueAtTime(0.025, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + duration);
    };

    playNote(523.25, 0, 0.18);      // C5
    playNote(659.25, 0.06, 0.18);   // E5
    playNote(783.99, 0.12, 0.24);   // G5
    playNote(1046.50, 0.18, 0.35);  // C6
  } catch {
    // Fail silently
  }
};
