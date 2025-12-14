import { Image, Platform } from 'react-native';
import Sound from 'react-native-sound';

//set category when available
// 'Playback' ensures sound plays when device is in silent mode
Sound.setCategory && Sound.setCategory('Playback');

// Keep track of the currently playing sound
let currentSound = null;


// Map keys to sound assets
const soundMap = {
  'sound1.mp3': require('../../assets/sounds/classic.mp3'),
  'sound2.mp3': require('../../assets/sounds/chimes.mp3'),
  'sound3.mp3': require('../../assets/sounds/waves.mp3'),
};


// Function to play an alarm sound by key
export function playAlarm(key) {
  const file = soundMap[key];
  if (!file) {
    console.warn('playAlarm called with invalid key:', key);
    return;
  }

  //Stop + release any existing sound
  if (currentSound) {
    try {
      currentSound.stop(() => {});
    } catch (_) {}
    try {
      currentSound.release();
    } catch (_) {}
    currentSound = null;
  }

  //Resolve the bundler asset to a URI (useful for Android/iOS differences)
  let src = file;
  try {
    const resolved = Image.resolveAssetSource(file);
    if (resolved && resolved.uri) src = resolved.uri;
  } catch (err) {
    // ignore and fallback
    console.log('resolveAssetSource failed (continuing):', err);
  }

  console.log('playAlarm -> key:', key, 'src:', src, 'type:', typeof src, 'platform:', Platform.OS);

  const onLoad = error => {
    if (error) {
      console.log('Failed to load sound:', error);
      currentSound = null;
      return;
    }
    currentSound.play(success => {
      if (!success) console.log('Sound playback failed');
      try { currentSound.release(); } catch (_) {}
      currentSound = null;
    });
  };

  try {
    if (typeof src === 'string') {
      const base = Platform.OS === 'android' ? Sound.MAIN_BUNDLE || '' : '';
      currentSound = new Sound(src, base, onLoad);
    } else {
      // numeric/module id or object - pass directly
      currentSound = new Sound(src, onLoad);
    }
  } catch (e) {
    console.log('playAlarm unexpected error:', e);
  }
}

export function stopAlarm() {
  if (currentSound) {
    try {
      currentSound.stop(() => {});
    } catch (_) {}
    try {
      currentSound.release();
    } catch (_) {}
    currentSound = null;
  }
}
