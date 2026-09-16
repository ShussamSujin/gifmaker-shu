import { GIFEncoder, quantize, applyPalette } from './vendor/gifenc.esm.js';

let encoder;
let settings;
let count = 0;

self.onmessage = (event) => {
  const { type, data } = event.data;
  try {
    if (type === 'start') {
      settings = data;
      count = 0;
      encoder = GIFEncoder();
      self.postMessage({ type: 'ready' });
      return;
    }
    if (type === 'frame') {
      const rgba = new Uint8ClampedArray(data.buffer);
      const palette = quantize(rgba, settings.colors, { format: 'rgba4444' });
      const index = applyPalette(rgba, palette, 'rgba4444');
      encoder.writeFrame(index, settings.width, settings.height, {
        palette,
        delay: settings.delay,
        repeat: count === 0 ? 0 : undefined
      });
      count += 1;
      self.postMessage({ type: 'frameDone', index: data.index });
      return;
    }
    if (type === 'finish') {
      encoder.finish();
      const bytes = encoder.bytes();
      self.postMessage({ type: 'done', buffer: bytes.buffer, count }, [bytes.buffer]);
      encoder = null;
    }
  } catch (error) {
    self.postMessage({ type: 'error', message: error?.message || String(error) });
  }
};
