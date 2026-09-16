// Drives the capture loop from a worker so recording keeps its pace
// while the user is on another tab (main-thread timers get throttled there).
let timer = null;

self.onmessage = (event) => {
  const { type, interval } = event.data;
  if (type === 'start') {
    clearInterval(timer);
    timer = setInterval(() => self.postMessage({ type: 'tick' }), Math.max(10, interval));
  }
  if (type === 'stop') {
    clearInterval(timer);
    timer = null;
  }
};
