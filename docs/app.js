const $ = (id) => document.getElementById(id);
const ui = Object.fromEntries([
  'startCapture','imageInput','status','capturePanel','previewWrap','captureVideo','imageCanvas','selection',
  'duration','fps','width','colors','record','stop','reset','progressBar','estimate','editPanel','editCanvas',
  'editTime','playPreview','scrubber','trimStart','trimEnd','captionText','addCaption','stickers','overlayDuration',
  'overlayList','encode','backToCapture','result','resultImage','resultMeta','download','makeAnother','langToggle'
].map((id) => [id, $(id)]));

const copy = {
  ko: {
    ready: '준비됨 · 파일은 기기 밖으로 전송되지 않아요', choose: '공유할 화면, 창 또는 탭을 선택하세요.',
    selected: '영역을 드래그해 지정한 뒤 촬영을 시작하세요.', denied: '화면 공유가 취소되었어요. 다시 선택할 수 있습니다.',
    recording: (s) => `촬영 중 · ${s}초`, captured: (n) => `${n}개 장면을 담았어요. 짧게 편집해 보세요.`,
    imageLoaded: (n) => `${n}개 이미지를 불러왔어요.`, encoding: (p) => `GIF 만드는 중 · ${p}%`,
    done: 'GIF가 완성됐어요.', error: '처리 중 문제가 생겼어요. 설정을 낮춰 다시 시도해 주세요.',
    caption: '자막', sticker: '스티커', remove: '삭제', all: '끝까지', noFrames: '먼저 화면을 촬영하거나 이미지를 불러오세요.',
    estimate: (n) => `예상: ${n}프레임 · 긴 GIF는 저장까지 잠시 걸릴 수 있어요.`,
    result: (sec, size) => `${sec}초 · ${size}`
  },
  en: {
    ready: 'Ready · Your files never leave this device', choose: 'Choose a screen, window, or tab to share.',
    selected: 'Drag to select an area, then start recording.', denied: 'Screen sharing was cancelled. You can try again.',
    recording: (s) => `Recording · ${s}s`, captured: (n) => `${n} frames captured. Make a quick edit.`,
    imageLoaded: (n) => `${n} images loaded.`, encoding: (p) => `Building GIF · ${p}%`,
    done: 'Your GIF is ready.', error: 'Something went wrong. Try a smaller size or lower frame rate.',
    caption: 'Caption', sticker: 'Sticker', remove: 'Remove', all: 'Until end', noFrames: 'Capture your screen or load images first.',
    estimate: (n) => `Estimate: ${n} frames · Long GIFs may take a moment to save.`,
    result: (sec, size) => `${sec}s · ${size}`
  }
};

let locale = (localStorage.getItem('gifmaker-locale') || navigator.language || 'ko').toLowerCase().startsWith('ko') ? 'ko' : 'en';
let stream = null;
let recording = false;
let frameBlobs = [];
let frameDelay = 125;
let frameSize = { width: 640, height: 360 };
let overlays = [];
let objectUrl = null;
let previewTimer = null;
let selection = { x: .1, y: .1, w: .8, h: .8 };

const translations = {
  en: {
    '사용법':'How it works','확장프로그램':'Extension','개인정보처리방침':'Privacy','브라우저 안에서 바로 완성':'Made entirely in your browser',
    '원하는 곳만 골라':'Select any area','바로 GIF로.':'Turn it into a GIF.','중간 동영상 파일 없이 화면을 선택하고, 영역을 잡고, 최대 1분 GIF를 저장하세요.':'Choose a screen, crop an area, and save up to a 60-second GIF with no intermediate video file.',
    '화면 선택하기':'Choose screen','이미지 불러오기':'Load images','드래그해 영역 지정':'Drag to select area','길이':'Length','속도':'Speed','가로 크기':'Width','색상':'Colors','가벼움':'Small','선명함':'Sharp','최고':'Best','원본 크기':'Original size',
    '촬영 시작':'Start recording','지금 완료':'Finish now','다시 선택':'Choose again','짧게 다듬고 완성':'Quick edit','시작':'Start','끝':'End','초':'sec','이 장면에 자막':'Caption this scene','자막을 입력하세요':'Type a caption','추가':'Add','스티커':'Stickers','표시 시간':'Show for','끝까지':'Until end','편집 적용하고 GIF 만들기':'Apply edits & make GIF','다시 촬영':'Record again','GIF 완성!':'GIF ready!','GIF 저장':'Save GIF','하나 더 만들기':'Make another',
    '안녕, 나는 슈슈!':'Hi, I’m Shushu!','장면을 이어 GIF로 만들어 줄게.':'I’ll turn your moments into a GIF.','복잡한 편집 없이 끝':'Done in three simple steps','화면 선택':'Choose a screen','탭, 창 또는 전체 화면 중 캡처할 대상을 고릅니다.':'Pick a tab, window, or full screen.','영역 지정':'Select an area','미리보기에서 필요한 부분만 드래그해 잡습니다.':'Drag around exactly what you need.','GIF 저장':'Save the GIF','최대 60초까지 바로 인코딩해 GIF 파일로 저장합니다.':'Encode up to 60 seconds directly as a GIF.',
    '필요한 순간, 한 번에 캡처':'Capture in one click','도구 모음의 슈슈 아이콘을 누르면 곧바로 영역 캡처가 시작됩니다. 영상 파일을 따로 저장하거나 다시 업로드할 필요가 없습니다.':'Click Shushu in your toolbar to capture an area instantly. No video export or re-upload required.','Chrome 웹스토어 등록 준비 중':'Chrome Web Store listing in progress','슈 패밀리의 다른 도구':'More from the SHU family','패밀리 홈':'Family home','콘텐츠 도구':'Content tool','관리자 연수 실습실':'Admin training lab','Workspace 관리 도구':'Workspace admin tool','메일 도우미':'Mail helper','🚧 계속 추가될 예정':'🚧 More coming soon','모든 처리는 사용자의 브라우저 안에서 이루어집니다.':'Everything is processed inside your browser.','도움말':'Support','문의: gajungssamzzang@gmail.com':'Contact: gajungssamzzang@gmail.com','단축키 Ctrl+Shift+G로 언제든 열 수 있어요':'Open anytime with Ctrl+Shift+G'
  }
};

function applyLocale() {
  document.documentElement.lang = locale;
  ui.langToggle.textContent = locale === 'ko' ? 'EN' : 'KO';
  ui.langToggle.setAttribute('aria-label', locale === 'ko' ? 'Switch to English' : '한국어로 전환');
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (['SCRIPT', 'STYLE'].includes(node.parentElement?.tagName) || !node.nodeValue.trim()) continue;
    if (!node.__ko) node.__ko = node.nodeValue.trim();
    const translated = locale === 'en' ? (translations.en[node.__ko] || node.__ko) : node.__ko;
    const leading = node.nodeValue.match(/^\s*/)?.[0] || '';
    const trailing = node.nodeValue.match(/\s*$/)?.[0] || '';
    node.nodeValue = `${leading}${translated}${trailing}`;
  }
  document.querySelectorAll('[placeholder]').forEach((el) => {
    if (el.placeholder) {
      if (!el.dataset.placeholderKo) el.dataset.placeholderKo = el.placeholder;
      el.placeholder = locale === 'en' ? (translations.en[el.dataset.placeholderKo] || el.dataset.placeholderKo) : el.dataset.placeholderKo;
    }
  });
  if (!recording && !ui.capturePanel.hidden) setStatus(copy[locale].selected);
  else if (!recording && ui.editPanel.hidden) setStatus(copy[locale].ready);
  updateEstimate();
  renderOverlayList();
}

function setStatus(message) { ui.status.textContent = message; }
function formatTime(seconds) { const s = Math.max(0, Number(seconds) || 0); return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(Math.floor(s % 60)).padStart(2,'0')}`; }
function humanBytes(bytes) { return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`; }

function updateEstimate() {
  const frames = Number(ui.duration.value) * Number(ui.fps.value);
  ui.estimate.textContent = copy[locale].estimate(frames);
}

function updateSelectionElement() {
  Object.assign(ui.selection.style, { left: `${selection.x * 100}%`, top: `${selection.y * 100}%`, width: `${selection.w * 100}%`, height: `${selection.h * 100}%` });
}

let dragStart = null;
ui.previewWrap.addEventListener('pointerdown', (event) => {
  if (!stream || recording) return;
  const rect = ui.previewWrap.getBoundingClientRect();
  dragStart = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
  ui.previewWrap.setPointerCapture(event.pointerId);
});
ui.previewWrap.addEventListener('pointermove', (event) => {
  if (!dragStart) return;
  const rect = ui.previewWrap.getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
  selection = { x: Math.min(dragStart.x, x), y: Math.min(dragStart.y, y), w: Math.max(.04, Math.abs(x - dragStart.x)), h: Math.max(.04, Math.abs(y - dragStart.y)) };
  updateSelectionElement();
});
ui.previewWrap.addEventListener('pointerup', () => { dragStart = null; });

async function chooseScreen() {
  cleanupStream();
  setStatus(copy[locale].choose);
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: { ideal: 30, max: 30 }, width: { ideal: 3840 }, height: { ideal: 2160 } }, audio: false });
    ui.captureVideo.srcObject = stream;
    await ui.captureVideo.play();
    ui.capturePanel.hidden = false;
    ui.editPanel.hidden = true;
    ui.result.hidden = true;
    ui.record.disabled = false;
    selection = { x: .08, y: .08, w: .84, h: .84 };
    updateSelectionElement();
    setStatus(copy[locale].selected);
    stream.getVideoTracks()[0].addEventListener('ended', () => { if (recording) finishCapture(); });
  } catch { setStatus(copy[locale].denied); }
}

function cleanupStream() {
  if (stream) stream.getTracks().forEach((track) => track.stop());
  stream = null;
  ui.captureVideo.srcObject = null;
}

async function canvasBlob(canvas, type = 'image/webp', quality = .92) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

function selectedOutputSize(sourceWidth, sourceHeight) {
  const cropW = Math.max(2, Math.round(sourceWidth * selection.w));
  const cropH = Math.max(2, Math.round(sourceHeight * selection.h));
  const requested = ui.width.value === 'source' ? cropW : Number(ui.width.value);
  const width = Math.min(requested, cropW);
  return { width: Math.max(2, Math.round(width / 2) * 2), height: Math.max(2, Math.round((width * cropH / cropW) / 2) * 2), cropW, cropH };
}

async function startRecording() {
  if (!stream) return chooseScreen();
  frameBlobs = [];
  overlays = [];
  const fps = Number(ui.fps.value);
  frameDelay = Math.round(1000 / fps);
  const durationMs = Number(ui.duration.value) * 1000;
  const sourceW = ui.captureVideo.videoWidth;
  const sourceH = ui.captureVideo.videoHeight;
  const out = selectedOutputSize(sourceW, sourceH);
  frameSize = { width: out.width, height: out.height };
  const canvas = document.createElement('canvas');
  canvas.width = out.width; canvas.height = out.height;
  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  recording = true;
  ui.record.hidden = true; ui.stop.hidden = false; ui.reset.disabled = true;
  const started = performance.now();
  let next = started;
  while (recording && performance.now() - started < durationMs) {
    const now = performance.now();
    if (now >= next) {
      ctx.drawImage(ui.captureVideo, sourceW * selection.x, sourceH * selection.y, out.cropW, out.cropH, 0, 0, out.width, out.height);
      const blob = await canvasBlob(canvas);
      if (blob) frameBlobs.push(blob);
      next += frameDelay;
      const elapsed = Math.min(durationMs, now - started);
      ui.progressBar.style.width = `${elapsed / durationMs * 100}%`;
      setStatus(copy[locale].recording((elapsed / 1000).toFixed(1)));
    }
    await new Promise((resolve) => setTimeout(resolve, Math.max(4, next - performance.now())));
  }
  await finishCapture();
}

async function finishCapture() {
  if (!recording) return;
  recording = false;
  ui.stop.hidden = true; ui.record.hidden = false; ui.reset.disabled = false;
  ui.progressBar.style.width = '100%';
  cleanupStream();
  if (frameBlobs.length) openEditor();
}

async function loadImages(files) {
  if (!files.length) return;
  frameBlobs = [];
  overlays = [];
  frameDelay = 500;
  const bitmaps = await Promise.all([...files].map((file) => createImageBitmap(file)));
  const naturalMax = Math.max(...bitmaps.map((b) => b.width));
  const maxW = ui.width.value === 'source' ? naturalMax : Math.min(Number(ui.width.value), naturalMax);
  const first = bitmaps[0];
  frameSize = { width: Math.round(maxW / 2) * 2, height: Math.round((maxW * first.height / first.width) / 2) * 2 };
  const canvas = document.createElement('canvas'); canvas.width = frameSize.width; canvas.height = frameSize.height;
  const ctx = canvas.getContext('2d', { alpha: false });
  for (const bitmap of bitmaps) {
    ctx.fillStyle = '#201914'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const scale = Math.min(canvas.width / bitmap.width, canvas.height / bitmap.height);
    const w = bitmap.width * scale, h = bitmap.height * scale;
    ctx.drawImage(bitmap, (canvas.width - w)/2, (canvas.height - h)/2, w, h);
    const blob = await canvasBlob(canvas);
    if (blob) frameBlobs.push(blob);
    bitmap.close();
  }
  setStatus(copy[locale].imageLoaded(frameBlobs.length));
  openEditor();
}

function openEditor() {
  ui.capturePanel.hidden = true;
  ui.editPanel.hidden = false;
  ui.result.hidden = true;
  ui.scrubber.max = Math.max(0, frameBlobs.length - 1);
  ui.scrubber.value = 0;
  ui.trimStart.value = 0;
  ui.trimEnd.value = (frameBlobs.length * frameDelay / 1000).toFixed(1);
  ui.trimEnd.max = ui.trimEnd.value;
  ui.trimStart.max = ui.trimEnd.value;
  setStatus(copy[locale].captured(frameBlobs.length));
  renderFrame(0);
}

function activeOverlays(index) { return overlays.filter((o) => index >= o.start && index <= o.end); }
function drawOverlays(ctx, index) {
  activeOverlays(index).forEach((o, layer) => {
    if (o.type === 'caption') {
      const size = Math.max(18, Math.round(frameSize.width * .052));
      ctx.font = `800 ${size}px system-ui, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.lineJoin = 'round';
      ctx.lineWidth = Math.max(4, size * .18); ctx.strokeStyle = 'rgba(0,0,0,.72)'; ctx.fillStyle = '#fff';
      const y = frameSize.height - size * (1 + layer * 1.25);
      ctx.strokeText(o.value, frameSize.width / 2, y, frameSize.width * .9);
      ctx.fillText(o.value, frameSize.width / 2, y, frameSize.width * .9);
    } else {
      const size = Math.max(34, Math.round(frameSize.width * .1));
      ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`; ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillText(o.value, frameSize.width - size * .25, size * .2 + layer * size * .75);
    }
  });
}

async function renderFrame(index) {
  const i = Math.max(0, Math.min(frameBlobs.length - 1, Number(index) || 0));
  const bitmap = await createImageBitmap(frameBlobs[i]);
  ui.editCanvas.width = frameSize.width; ui.editCanvas.height = frameSize.height;
  const ctx = ui.editCanvas.getContext('2d'); ctx.drawImage(bitmap, 0, 0, frameSize.width, frameSize.height); bitmap.close();
  drawOverlays(ctx, i);
  ui.editTime.textContent = `${formatTime(i * frameDelay / 1000)} / ${formatTime(frameBlobs.length * frameDelay / 1000)}`;
}

function addOverlay(type, value) {
  if (!value || !frameBlobs.length) return;
  const start = Number(ui.scrubber.value);
  const duration = ui.overlayDuration.value === 'all' ? frameBlobs.length : Math.round(Number(ui.overlayDuration.value) * 1000 / frameDelay);
  overlays.push({ id: crypto.randomUUID(), type, value, start, end: Math.min(frameBlobs.length - 1, start + duration) });
  if (type === 'caption') ui.captionText.value = '';
  renderOverlayList(); renderFrame(start);
}

function renderOverlayList() {
  ui.overlayList.replaceChildren();
  overlays.forEach((overlay) => {
    const item = document.createElement('div'); item.className = 'overlay-chip';
    const strong = document.createElement('strong'); strong.textContent = overlay.type === 'caption' ? copy[locale].caption : copy[locale].sticker;
    const span = document.createElement('span'); span.textContent = `${overlay.value} · ${formatTime(overlay.start * frameDelay / 1000)}–${formatTime(overlay.end * frameDelay / 1000)}`;
    const button = document.createElement('button'); button.type = 'button'; button.textContent = copy[locale].remove;
    button.addEventListener('click', () => { overlays = overlays.filter((o) => o.id !== overlay.id); renderOverlayList(); renderFrame(ui.scrubber.value); });
    item.append(strong, span, button); ui.overlayList.append(item);
  });
}

async function encodeGif() {
  if (!frameBlobs.length) return setStatus(copy[locale].noFrames);
  const start = Math.max(0, Math.floor(Number(ui.trimStart.value) * 1000 / frameDelay));
  const end = Math.min(frameBlobs.length, Math.ceil(Number(ui.trimEnd.value) * 1000 / frameDelay));
  if (end <= start) return;
  ui.encode.disabled = true; ui.progressBar.style.width = '0'; ui.capturePanel.hidden = false; ui.capturePanel.querySelector('.preview-wrap').hidden = true; ui.capturePanel.querySelector('.controls').hidden = true; ui.capturePanel.querySelector('.capture-actions').hidden = true;
  const worker = new Worker('./encoder-worker.js', { type: 'module' });
  const canvas = document.createElement('canvas'); canvas.width = frameSize.width; canvas.height = frameSize.height;
  const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
  const total = end - start;
  const completion = new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
      if (event.data.type === 'ready') resolve('ready');
      if (event.data.type === 'frameDone') resolve(event.data.index);
      if (event.data.type === 'done') resolve({ done: event.data.buffer, count: event.data.count });
      if (event.data.type === 'error') reject(new Error(event.data.message));
    };
    worker.onerror = reject;
  });
  worker.postMessage({ type: 'start', data: { width: frameSize.width, height: frameSize.height, colors: Number(ui.colors.value), delay: frameDelay } });
  try {
    await completion;
    for (let i = start; i < end; i += 1) {
      const bitmap = await createImageBitmap(frameBlobs[i]); ctx.drawImage(bitmap, 0, 0, frameSize.width, frameSize.height); bitmap.close();
      drawOverlays(ctx, i);
      const image = ctx.getImageData(0, 0, frameSize.width, frameSize.height);
      await new Promise((resolve, reject) => {
        worker.onmessage = (event) => event.data.type === 'frameDone' ? resolve() : event.data.type === 'error' ? reject(new Error(event.data.message)) : null;
        worker.postMessage({ type: 'frame', data: { index: i - start, buffer: image.data.buffer } }, [image.data.buffer]);
      });
      const pct = Math.round((i - start + 1) / total * 100); ui.progressBar.style.width = `${pct}%`; setStatus(copy[locale].encoding(pct));
    }
    const result = await new Promise((resolve, reject) => {
      worker.onmessage = (event) => event.data.type === 'done' ? resolve(event.data) : event.data.type === 'error' ? reject(new Error(event.data.message)) : null;
      worker.postMessage({ type: 'finish' });
    });
    const blob = new Blob([result.buffer], { type: 'image/gif' });
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(blob);
    ui.resultImage.src = objectUrl; ui.download.href = objectUrl;
    ui.resultMeta.textContent = copy[locale].result((total * frameDelay / 1000).toFixed(1), humanBytes(blob.size));
    ui.result.hidden = false; ui.editPanel.hidden = true; ui.capturePanel.hidden = true;
    setStatus(copy[locale].done);
  } catch (error) { console.error(error); setStatus(copy[locale].error); }
  finally { worker.terminate(); ui.encode.disabled = false; ui.capturePanel.querySelector('.preview-wrap').hidden = false; ui.capturePanel.querySelector('.controls').hidden = false; ui.capturePanel.querySelector('.capture-actions').hidden = false; }
}

function resetAll() {
  recording = false; cleanupStream(); frameBlobs = []; overlays = [];
  ui.imageInput.value = '';
  ui.capturePanel.hidden = true; ui.editPanel.hidden = true; ui.result.hidden = true; ui.progressBar.style.width = '0';
  if (previewTimer) clearInterval(previewTimer);
  setStatus(copy[locale].ready);
}

ui.startCapture.addEventListener('click', chooseScreen);
ui.reset.addEventListener('click', chooseScreen);
ui.record.addEventListener('click', startRecording);
ui.stop.addEventListener('click', finishCapture);
ui.imageInput.addEventListener('change', (event) => loadImages(event.target.files));
ui.duration.addEventListener('change', updateEstimate); ui.fps.addEventListener('change', updateEstimate);
ui.scrubber.addEventListener('input', () => renderFrame(ui.scrubber.value));
ui.addCaption.addEventListener('click', () => addOverlay('caption', ui.captionText.value.trim()));
ui.captionText.addEventListener('keydown', (event) => { if (event.key === 'Enter') addOverlay('caption', ui.captionText.value.trim()); });
ui.stickers.addEventListener('click', (event) => { if (event.target.tagName === 'BUTTON') addOverlay('sticker', event.target.textContent); });
ui.encode.addEventListener('click', encodeGif);
ui.backToCapture.addEventListener('click', resetAll); ui.makeAnother.addEventListener('click', resetAll);
ui.playPreview.addEventListener('click', () => {
  if (previewTimer) { clearInterval(previewTimer); previewTimer = null; ui.playPreview.textContent = '▶'; return; }
  ui.playPreview.textContent = 'Ⅱ';
  previewTimer = setInterval(() => { let next = Number(ui.scrubber.value) + 1; if (next > Number(ui.scrubber.max)) next = 0; ui.scrubber.value = next; renderFrame(next); }, frameDelay);
});
ui.langToggle.addEventListener('click', () => { locale = locale === 'ko' ? 'en' : 'ko'; localStorage.setItem('gifmaker-locale', locale); applyLocale(); });

if ('modelContext' in document && document.modelContext?.registerTool) {
  try {
    document.modelContext.registerTool({
      name: 'start_gif_capture', title: 'Start GIF capture',
      description: 'Open the browser screen picker so the user can select a screen, window, or tab for GIF capture.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: async () => { await chooseScreen(); return { status: stream ? 'picker_completed' : 'cancelled' }; }
    });
  } catch (error) { console.debug('WebMCP unavailable', error); }
}

applyLocale();
