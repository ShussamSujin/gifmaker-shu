const $ = (id) => document.getElementById(id);
const ui = Object.fromEntries([
  'startCapture','imageInput','status','capturePanel','previewWrap','captureVideo','selection','selectionSize','selectAll','countdown',
  'duration','fps','width','colors','record','stop','reset','progressBar','estimate',
  'studio','editCanvas','playPreview','scrubber','editTime','timeline','clipCount','clipTools',
  'captionText','addCaption','stickers','overlayDuration','overlayList','encode','clearAll',
  'result','resultImage','resultMeta','download','makeAnother','langToggle'
].map((id) => [id, $(id)]));

const copy = {
  ko: {
    ready: '사진을 넣거나 화면을 촬영해 장면을 쌓아보세요 · 파일은 기기 밖으로 전송되지 않아요',
    choose: '공유할 화면, 창 또는 탭을 선택하세요.',
    selected: '영역을 정하고 촬영을 시작하세요. 시작 후 3초 뒤부터 녹화됩니다.',
    denied: '화면 공유가 취소되었어요. 다시 선택할 수 있습니다.',
    countdown: (n) => `${n}초 뒤 촬영이 시작돼요. 지금 원하는 탭으로 이동하세요.`,
    recording: (s) => `촬영 중 · ${s}초 (다른 탭에 있어도 계속 촬영돼요)`,
    captured: (n) => `${n}개 장면을 타임라인에 담았어요.`,
    imageLoaded: (n) => `사진 ${n}장을 타임라인에 담았어요.`,
    encoding: (p) => `GIF 만드는 중 · ${p}%`,
    done: 'GIF가 완성됐어요.',
    error: '처리 중 문제가 생겼어요. 크기나 색상을 낮춰 다시 시도해 주세요.',
    caption: '자막', sticker: '스티커', remove: '삭제',
    noFrames: '먼저 사진을 넣거나 화면을 촬영하세요.',
    estimate: (n) => `예상: ${n}프레임 · 크고 긴 GIF는 저장까지 잠시 걸릴 수 있어요.`,
    result: (sec, size) => `${sec}초 · ${size}`,
    clipCount: (c, sec) => `장면 ${c}개 · 전체 ${sec}초`,
    photo: '사진', video: '촬영',
    fullScreen: '전체 화면',
    selectionSize: (w, h) => `선택 영역 ${w}×${h}px`,
    showFor: '표시 시간',
    trimRange: '사용할 구간',
    sec: '초',
    moveLeft: '앞으로', moveRight: '뒤로', deleteClip: '삭제',
    emptyTimeline: '아직 장면이 없어요. 사진을 넣거나 화면을 촬영해 보세요.',
    confirmClear: '타임라인의 장면을 모두 지울까요?'
  },
  en: {
    ready: 'Add photos or record your screen to build a timeline · Files never leave this device',
    choose: 'Choose a screen, window, or tab to share.',
    selected: 'Set the area and start recording. Capture begins 3 seconds after you start.',
    denied: 'Screen sharing was cancelled. You can try again.',
    countdown: (n) => `Recording starts in ${n}s. Switch to the tab you want now.`,
    recording: (s) => `Recording · ${s}s (keeps going while you are on another tab)`,
    captured: (n) => `${n} frames added to the timeline.`,
    imageLoaded: (n) => `${n} photos added to the timeline.`,
    encoding: (p) => `Building GIF · ${p}%`,
    done: 'Your GIF is ready.',
    error: 'Something went wrong. Try a smaller size or fewer colors.',
    caption: 'Caption', sticker: 'Sticker', remove: 'Remove',
    noFrames: 'Add a photo or record your screen first.',
    estimate: (n) => `Estimate: ${n} frames · Large or long GIFs take a moment to save.`,
    result: (sec, size) => `${sec}s · ${size}`,
    clipCount: (c, sec) => `${c} scenes · ${sec}s total`,
    photo: 'Photo', video: 'Recording',
    fullScreen: 'Full screen',
    selectionSize: (w, h) => `Selected ${w}×${h}px`,
    showFor: 'Show for',
    trimRange: 'Range to use',
    sec: 's',
    moveLeft: 'Move left', moveRight: 'Move right', deleteClip: 'Delete',
    emptyTimeline: 'No scenes yet. Add a photo or record your screen.',
    confirmClear: 'Remove every scene from the timeline?'
  }
};

const translations = {
  en: {
    '사용법':'How it works','확장프로그램':'Extension','개인정보처리방침':'Privacy','브라우저 안에서 바로 완성':'Made entirely in your browser',
    '원하는 곳만 골라':'Select any area','바로 GIF로.':'Turn it into a GIF.',
    '사진과 화면 촬영을 원하는 순서로 이어 붙여 하나의 GIF로 만드세요. 중간 동영상 파일은 만들지 않습니다.':'Stack photos and screen recordings in any order to build one GIF. No intermediate video file.',
    '화면 촬영하기':'Record screen','사진 추가하기':'Add photos','드래그해 영역 지정':'Drag to select area',
    '전체 화면 사용':'Use full screen','길이':'Length','속도':'Speed','가로 크기':'Width','색상':'Colors',
    '가벼움':'Small','선명함':'Sharp','최고':'Best','원본 크기':'Original size',
    '촬영을 시작하면 3초 뒤부터 녹화돼요. 그 사이 원하는 탭으로 옮겨 재생 버튼을 누르세요. 멈출 때는 브라우저 아래의 “공유 중지”를 누르면 됩니다.':'Recording starts 3 seconds after you press start — switch to the tab you want and hit play. To stop early, use the browser’s “Stop sharing” bar.',
    '촬영 시작':'Start recording','지금 완료':'Finish now','화면 다시 선택':'Choose screen again',
    '순서를 정하고 다듬기':'Arrange and polish','타임라인':'Timeline',
    '이 장면에 자막':'Caption this scene','자막을 입력하세요':'Type a caption','추가':'Add','스티커':'Stickers','표시 시간':'Show for','끝까지':'Until end',
    'GIF 만들기':'Make GIF','전부 지우기':'Clear all','GIF 완성!':'GIF ready!','GIF 저장':'Save GIF','하나 더 만들기':'Start over',
    '안녕, 나는 슈슈!':'Hi, I’m Shushu!','장면을 이어 GIF로 만들어 줄게.':'I’ll turn your moments into a GIF.',
    '복잡한 편집 없이 끝':'Done in three simple steps','장면 모으기':'Collect scenes',
    '사진을 넣고 화면도 촬영해 타임라인에 쌓습니다.':'Add photos and record your screen onto one timeline.',
    '순서 정하기':'Arrange them','타임라인에서 순서와 표시 시간을 조절합니다.':'Reorder scenes and set how long each one shows.',
    'GIF 저장':'Save the GIF','자막과 스티커를 얹어 하나의 GIF로 저장합니다.':'Add captions and stickers, then save it as one GIF.',
    '확장 프로그램을 설치해서 좀 더 수월하게 GIF를 캡처해보슈~~':'Install the extension and capture GIFs the easy way!',
    '확장 프로그램을 설치해서':'Install the extension','좀 더 수월하게 GIF를 캡처해보슈~~':'and capture GIFs the easy way!',
    '도구 모음의 슈슈 아이콘만 누르면 어느 페이지에서든 바로 촬영이 시작돼요. 사이트를 따로 열어둘 필요도, 영상 파일을 저장했다 다시 올릴 필요도 없습니다.':'Just click Shushu in your toolbar and recording starts on any page — no need to keep the site open, and no exporting or re-uploading video files.',
    'Chrome 웹스토어 등록 준비 중':'Chrome Web Store listing in progress','슈 패밀리의 다른 도구':'More from the SHU family',
    '패밀리 홈':'Family home','콘텐츠 도구':'Content tool','관리자 연수 실습실':'Admin training lab','Workspace 관리 도구':'Workspace admin tool','메일 도우미':'Mail helper','🚧 계속 추가될 예정':'🚧 More coming soon',
    '모든 처리는 사용자의 브라우저 안에서 이루어집니다.':'Everything is processed inside your browser.','도움말':'Support',
    '문의: gajungssamzzang@gmail.com':'Contact: gajungssamzzang@gmail.com',
    '단축키 Ctrl+Shift+G로 언제든 열 수 있어요':'Open anytime with Ctrl+Shift+G'
  }
};

let locale = (localStorage.getItem('gifmaker-locale') || navigator.language || 'ko').toLowerCase().startsWith('ko') ? 'ko' : 'en';
let stream = null;
let recording = false;
let clips = [];
let selectedClipId = null;
let objectUrl = null;
let previewTimer = null;
let playing = false;
let selection = { x: 0, y: 0, w: 1, h: 1 };
let ticker = null;

const t = () => copy[locale];
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `id-${Math.random().toString(36).slice(2)}`);

/* ---------- timeline model ---------- */
// clip: { id, kind:'image'|'capture', frames:[{blob,w,h,delay}], in, out, thumb, overlays:[] }

const cframes = (clip) => clip.frames.slice(clip.in, clip.out + 1);
const totalVisible = () => clips.reduce((n, c) => n + cframes(c).length, 0);
const totalMs = () => clips.reduce((ms, c) => ms + cframes(c).reduce((s, f) => s + f.delay, 0), 0);

function locate(index) {
  let i = index;
  for (const clip of clips) {
    const fs = cframes(clip);
    if (i < fs.length) return { clip, frame: fs[i], local: clip.in + i };
    i -= fs.length;
  }
  return null;
}

function timeBefore(index) {
  let ms = 0;
  let i = 0;
  for (const clip of clips) {
    for (const frame of cframes(clip)) {
      if (i >= index) return ms;
      ms += frame.delay;
      i += 1;
    }
  }
  return ms;
}

function projectSize() {
  const first = clips[0]?.frames[0];
  if (!first) return { width: 640, height: 360 };
  const aspect = first.w / first.h;
  const natural = Math.max(...clips.flatMap((c) => c.frames.map((f) => f.w)));
  const requested = ui.width.value === 'source' ? natural : Number(ui.width.value);
  const width = Math.max(2, Math.round(Math.min(requested, natural) / 2) * 2);
  return { width, height: Math.max(2, Math.round((width / aspect) / 2) * 2) };
}

function drawContain(ctx, bitmap, size) {
  ctx.fillStyle = '#201914';
  ctx.fillRect(0, 0, size.width, size.height);
  const scale = Math.min(size.width / bitmap.width, size.height / bitmap.height);
  const w = bitmap.width * scale;
  const h = bitmap.height * scale;
  ctx.drawImage(bitmap, (size.width - w) / 2, (size.height - h) / 2, w, h);
}

/* ---------- adding scenes ---------- */

async function makeThumb(blob) {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = 132;
  canvas.height = 88;
  drawContain(canvas.getContext('2d'), bitmap, { width: 132, height: 88 });
  bitmap.close();
  return canvas.toDataURL('image/jpeg', .72);
}

async function addClip(kind, frames) {
  if (!frames.length) return null;
  const clip = { id: uid(), kind, frames, in: 0, out: frames.length - 1, thumb: '', overlays: [] };
  clips.push(clip);
  selectedClipId = clip.id;
  clip.thumb = await makeThumb(frames[0].blob);
  refreshStudio();
  return clip;
}

async function loadImages(files) {
  if (!files.length) return;
  const seconds = 1;
  const frames = [];
  for (const file of files) {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext('2d', { alpha: false }).drawImage(bitmap, 0, 0);
    const blob = await canvasBlob(canvas);
    if (blob) frames.push({ blob, w: bitmap.width, h: bitmap.height, delay: Math.round(seconds * 1000) });
    bitmap.close();
  }
  for (const frame of frames) await addClip('image', [frame]);
  setStatus(t().imageLoaded(frames.length));
  ui.imageInput.value = '';
}

/* ---------- capture ---------- */

async function canvasBlob(canvas, type = 'image/webp', quality = .92) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

async function chooseScreen() {
  cleanupStream();
  setStatus(t().choose);
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: { ideal: 30, max: 30 }, width: { ideal: 3840 }, height: { ideal: 2160 } },
      audio: false
    });
    ui.captureVideo.srcObject = stream;
    await ui.captureVideo.play();
    ui.capturePanel.hidden = false;
    ui.result.hidden = true;
    ui.record.disabled = false;
    selection = { x: 0, y: 0, w: 1, h: 1 };
    updateSelectionElement();
    setStatus(t().selected);
    stream.getVideoTracks()[0].addEventListener('ended', () => { if (recording) finishCapture(); else resetCapturePanel(); });
  } catch { setStatus(t().denied); }
}

function cleanupStream() {
  if (stream) stream.getTracks().forEach((track) => track.stop());
  stream = null;
  ui.captureVideo.srcObject = null;
}

function resetCapturePanel() {
  cleanupStream();
  ui.capturePanel.hidden = true;
  ui.record.hidden = false;
  ui.stop.hidden = true;
  ui.progressBar.style.width = '0';
}

function updateSelectionElement() {
  Object.assign(ui.selection.style, {
    left: `${selection.x * 100}%`, top: `${selection.y * 100}%`,
    width: `${selection.w * 100}%`, height: `${selection.h * 100}%`
  });
  const sourceW = ui.captureVideo.videoWidth || 0;
  const sourceH = ui.captureVideo.videoHeight || 0;
  const full = selection.w > .995 && selection.h > .995;
  ui.selectionSize.textContent = full || !sourceW
    ? t().fullScreen
    : t().selectionSize(Math.round(sourceW * selection.w), Math.round(sourceH * selection.h));
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
  selection = {
    x: Math.min(dragStart.x, x), y: Math.min(dragStart.y, y),
    w: Math.max(.04, Math.abs(x - dragStart.x)), h: Math.max(.04, Math.abs(y - dragStart.y))
  };
  updateSelectionElement();
});
ui.previewWrap.addEventListener('pointerup', () => { dragStart = null; });

function countdown(seconds) {
  return new Promise((resolve) => {
    let left = seconds;
    ui.countdown.hidden = false;
    ui.countdown.textContent = left;
    setStatus(t().countdown(left));
    const timer = setInterval(() => {
      left -= 1;
      if (left <= 0) {
        clearInterval(timer);
        ui.countdown.hidden = true;
        resolve();
        return;
      }
      ui.countdown.textContent = left;
      setStatus(t().countdown(left));
    }, 1000);
  });
}

async function startRecording() {
  if (!stream) return chooseScreen();
  ui.record.hidden = true;
  ui.stop.hidden = false;
  ui.reset.disabled = true;
  await countdown(3);
  if (!stream) { ui.record.hidden = false; ui.stop.hidden = true; ui.reset.disabled = false; return; }

  const fps = Number(ui.fps.value);
  const delay = Math.round(1000 / fps);
  const durationMs = Number(ui.duration.value) * 1000;
  const sourceW = ui.captureVideo.videoWidth;
  const sourceH = ui.captureVideo.videoHeight;
  const cropW = Math.max(2, Math.round(sourceW * selection.w));
  const cropH = Math.max(2, Math.round(sourceH * selection.h));
  const width = Math.max(2, Math.round(Math.min(cropW, 1920) / 2) * 2);
  const height = Math.max(2, Math.round((width * cropH / cropW) / 2) * 2);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

  const captured = [];
  recording = true;
  const started = performance.now();
  let busy = false;

  ticker = new Worker('./ticker-worker.js');
  await new Promise((resolve) => {
    ticker.onmessage = async () => {
      if (!recording || busy) return;
      busy = true;
      try {
        ctx.drawImage(ui.captureVideo, sourceW * selection.x, sourceH * selection.y, cropW, cropH, 0, 0, width, height);
        const blob = await canvasBlob(canvas);
        if (blob) captured.push({ blob, w: width, h: height, delay });
        const elapsed = performance.now() - started;
        ui.progressBar.style.width = `${Math.min(100, elapsed / durationMs * 100)}%`;
        setStatus(t().recording((elapsed / 1000).toFixed(1)));
        if (elapsed >= durationMs) { recording = false; resolve(); }
      } catch { recording = false; resolve(); }
      busy = false;
    };
    stopResolve = resolve;
    ticker.postMessage({ type: 'start', interval: delay });
  });

  stopTicker();
  recording = false;
  ui.stop.hidden = true;
  ui.record.hidden = false;
  ui.reset.disabled = false;
  ui.progressBar.style.width = '100%';
  cleanupStream();
  ui.capturePanel.hidden = true;

  if (captured.length) {
    await addClip('capture', captured);
    setStatus(t().captured(captured.length));
  }
}

let stopResolve = null;
function stopTicker() {
  if (ticker) { ticker.postMessage({ type: 'stop' }); ticker.terminate(); ticker = null; }
}
function finishCapture() {
  if (!recording) return;
  recording = false;
  if (stopResolve) stopResolve();
}

/* ---------- studio ---------- */

function refreshStudio() {
  const total = totalVisible();
  ui.studio.hidden = total === 0;
  ui.scrubber.max = Math.max(0, total - 1);
  if (Number(ui.scrubber.value) > total - 1) ui.scrubber.value = Math.max(0, total - 1);
  ui.clipCount.textContent = t().clipCount(clips.length, (totalMs() / 1000).toFixed(1));
  renderTimeline();
  renderClipTools();
  renderOverlayList();
  updateEstimate();
  if (total) renderFrame(Number(ui.scrubber.value));
}

function renderTimeline() {
  ui.timeline.replaceChildren();
  if (!clips.length) {
    const empty = document.createElement('p');
    empty.className = 'timeline-empty';
    empty.textContent = t().emptyTimeline;
    ui.timeline.append(empty);
    return;
  }
  clips.forEach((clip, index) => {
    const card = document.createElement('div');
    card.className = `clip${clip.id === selectedClipId ? ' selected' : ''}`;

    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'clip-thumb';
    thumb.style.backgroundImage = clip.thumb ? `url(${clip.thumb})` : 'none';
    thumb.addEventListener('click', () => {
      selectedClipId = clip.id;
      ui.scrubber.value = startIndexOf(clip);
      renderFrame(ui.scrubber.value);
      renderTimeline();
      renderClipTools();
    });

    const badge = document.createElement('span');
    badge.className = 'clip-badge';
    const seconds = cframes(clip).reduce((s, f) => s + f.delay, 0) / 1000;
    badge.textContent = `${clip.kind === 'image' ? t().photo : t().video} · ${seconds.toFixed(1)}${t().sec}`;
    thumb.append(badge);

    const actions = document.createElement('div');
    actions.className = 'clip-actions';
    const left = iconButton('◀', t().moveLeft, () => moveClip(index, -1), index === 0);
    const right = iconButton('▶', t().moveRight, () => moveClip(index, 1), index === clips.length - 1);
    const del = iconButton('✕', t().deleteClip, () => removeClip(clip.id));
    del.classList.add('danger-icon');
    actions.append(left, right, del);

    card.append(thumb, actions);
    ui.timeline.append(card);
  });
}

function iconButton(label, title, onClick, disabled = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.title = title;
  button.setAttribute('aria-label', title);
  button.disabled = disabled;
  button.addEventListener('click', onClick);
  return button;
}

function startIndexOf(target) {
  let index = 0;
  for (const clip of clips) {
    if (clip === target) return index;
    index += cframes(clip).length;
  }
  return 0;
}

function moveClip(index, step) {
  const next = index + step;
  if (next < 0 || next >= clips.length) return;
  [clips[index], clips[next]] = [clips[next], clips[index]];
  refreshStudio();
}

function removeClip(id) {
  clips = clips.filter((clip) => clip.id !== id);
  if (selectedClipId === id) selectedClipId = clips[0]?.id || null;
  if (!clips.length) resetAll();
  else refreshStudio();
}

function renderClipTools() {
  ui.clipTools.replaceChildren();
  const clip = clips.find((c) => c.id === selectedClipId);
  ui.clipTools.hidden = !clip;
  if (!clip) return;

  if (clip.kind === 'image') {
    const label = document.createElement('label');
    label.className = 'clip-duration';
    label.append(document.createTextNode(t().showFor));
    const select = document.createElement('select');
    const current = clip.frames[0].delay / 1000;
    const choices = [0.5, 1, 1.5, 2, 3, 5];
    const closest = choices.reduce((best, value) => Math.abs(value - current) < Math.abs(best - current) ? value : best, choices[0]);
    choices.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = `${value}${t().sec}`;
      option.selected = value === closest;
      select.append(option);
    });
    select.addEventListener('change', () => {
      clip.frames[0].delay = Math.round(Number(select.value) * 1000);
      refreshStudio();
    });
    label.append(select);
    ui.clipTools.append(label);
    return;
  }

  const seconds = clip.frames.reduce((s, f) => s + f.delay, 0) / 1000;
  const wrap = document.createElement('div');
  wrap.className = 'clip-trim';
  const title = document.createElement('span');
  title.textContent = t().trimRange;
  const startInput = rangeInput(clip.in, clip.frames.length - 1, (value) => {
    clip.in = Math.min(value, clip.out);
    refreshStudio();
  });
  const endInput = rangeInput(clip.out, clip.frames.length - 1, (value) => {
    clip.out = Math.max(value, clip.in);
    refreshStudio();
  });
  const readout = document.createElement('span');
  readout.className = 'clip-trim-readout';
  const used = cframes(clip).reduce((s, f) => s + f.delay, 0) / 1000;
  readout.textContent = `${used.toFixed(1)} / ${seconds.toFixed(1)}${t().sec}`;
  wrap.append(title, startInput, endInput, readout);
  ui.clipTools.append(wrap);
}

function rangeInput(value, max, onInput) {
  const input = document.createElement('input');
  input.type = 'range';
  input.min = 0;
  input.max = max;
  input.value = value;
  input.className = 'clip-range';
  input.addEventListener('input', () => onInput(Number(input.value)));
  return input;
}

/* ---------- preview & overlays ---------- */

function activeOverlays(clip, local) {
  return clip.overlays.filter((o) => local >= o.start && local <= o.end);
}

function drawOverlays(ctx, clip, local, size) {
  activeOverlays(clip, local).forEach((overlay, layer) => {
    if (overlay.type === 'caption') {
      const fontSize = Math.max(18, Math.round(size.width * .052));
      ctx.font = `800 ${fontSize}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.lineJoin = 'round';
      ctx.lineWidth = Math.max(4, fontSize * .18);
      ctx.strokeStyle = 'rgba(0,0,0,.72)';
      ctx.fillStyle = '#fff';
      const y = size.height - fontSize * (1 + layer * 1.25);
      ctx.strokeText(overlay.value, size.width / 2, y, size.width * .9);
      ctx.fillText(overlay.value, size.width / 2, y, size.width * .9);
    } else {
      const fontSize = Math.max(34, Math.round(size.width * .1));
      ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText(overlay.value, size.width - fontSize * .25, fontSize * .2 + layer * fontSize * .75);
    }
  });
}

async function renderFrame(index) {
  const total = totalVisible();
  if (!total) return;
  const i = Math.max(0, Math.min(total - 1, Number(index) || 0));
  const spot = locate(i);
  if (!spot) return;
  const size = projectSize();
  const bitmap = await createImageBitmap(spot.frame.blob);
  ui.editCanvas.width = size.width;
  ui.editCanvas.height = size.height;
  const ctx = ui.editCanvas.getContext('2d');
  drawContain(ctx, bitmap, size);
  bitmap.close();
  drawOverlays(ctx, spot.clip, spot.local, size);
  if (spot.clip.id !== selectedClipId) {
    selectedClipId = spot.clip.id;
    renderTimeline();
    renderClipTools();
  }
  ui.editTime.textContent = `${formatTime(timeBefore(i) / 1000)} / ${formatTime(totalMs() / 1000)}`;
}

function addOverlay(type, value) {
  if (!value || !totalVisible()) return;
  const spot = locate(Number(ui.scrubber.value));
  if (!spot) return;
  const clip = spot.clip;
  const perFrame = spot.frame.delay || 120;
  const span = ui.overlayDuration.value === 'all'
    ? clip.frames.length
    : Math.max(1, Math.round(Number(ui.overlayDuration.value) * 1000 / perFrame));
  clip.overlays.push({
    id: uid(), type, value,
    start: spot.local,
    end: Math.min(clip.frames.length - 1, spot.local + span - 1)
  });
  if (type === 'caption') ui.captionText.value = '';
  renderOverlayList();
  renderFrame(ui.scrubber.value);
}

function renderOverlayList() {
  ui.overlayList.replaceChildren();
  clips.forEach((clip, clipIndex) => {
    clip.overlays.forEach((overlay) => {
      const item = document.createElement('div');
      item.className = 'overlay-chip';
      const strong = document.createElement('strong');
      strong.textContent = overlay.type === 'caption' ? t().caption : t().sticker;
      const span = document.createElement('span');
      span.textContent = `${overlay.value} · ${clipIndex + 1}${locale === 'ko' ? '번째 장면' : ''}`;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = t().remove;
      button.addEventListener('click', () => {
        clip.overlays = clip.overlays.filter((o) => o.id !== overlay.id);
        renderOverlayList();
        renderFrame(ui.scrubber.value);
      });
      item.append(strong, span, button);
      ui.overlayList.append(item);
    });
  });
}

/* ---------- encode ---------- */

async function encodeGif() {
  const total = totalVisible();
  if (!total) return setStatus(t().noFrames);
  ui.encode.disabled = true;
  ui.progressBar.style.width = '0';

  const size = projectSize();
  const worker = new Worker('./encoder-worker.js', { type: 'module' });
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });

  try {
    await new Promise((resolve, reject) => {
      worker.onmessage = (event) => event.data.type === 'ready' ? resolve() : event.data.type === 'error' ? reject(new Error(event.data.message)) : null;
      worker.onerror = reject;
      worker.postMessage({ type: 'start', data: { width: size.width, height: size.height, colors: Number(ui.colors.value), delay: 120 } });
    });

    let written = 0;
    for (const clip of clips) {
      const frames = cframes(clip);
      for (let i = 0; i < frames.length; i += 1) {
        const frame = frames[i];
        const bitmap = await createImageBitmap(frame.blob);
        drawContain(ctx, bitmap, size);
        bitmap.close();
        drawOverlays(ctx, clip, clip.in + i, size);
        const image = ctx.getImageData(0, 0, size.width, size.height);
        await new Promise((resolve, reject) => {
          worker.onmessage = (event) => event.data.type === 'frameDone' ? resolve() : event.data.type === 'error' ? reject(new Error(event.data.message)) : null;
          worker.postMessage({ type: 'frame', data: { index: written, delay: frame.delay, buffer: image.data.buffer } }, [image.data.buffer]);
        });
        written += 1;
        const pct = Math.round(written / total * 100);
        ui.progressBar.style.width = `${pct}%`;
        setStatus(t().encoding(pct));
      }
    }

    const result = await new Promise((resolve, reject) => {
      worker.onmessage = (event) => event.data.type === 'done' ? resolve(event.data) : event.data.type === 'error' ? reject(new Error(event.data.message)) : null;
      worker.postMessage({ type: 'finish' });
    });

    const blob = new Blob([result.buffer], { type: 'image/gif' });
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(blob);
    ui.resultImage.src = objectUrl;
    ui.download.href = objectUrl;
    ui.resultMeta.textContent = t().result((totalMs() / 1000).toFixed(1), humanBytes(blob.size));
    ui.result.hidden = false;
    setStatus(t().done);
    ui.result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    console.error(error);
    setStatus(t().error);
  } finally {
    worker.terminate();
    ui.encode.disabled = false;
  }
}

/* ---------- misc ---------- */

function setStatus(message) { ui.status.textContent = message; }
function formatTime(seconds) {
  const s = Math.max(0, Number(seconds) || 0);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}
function humanBytes(bytes) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
function updateEstimate() {
  const frames = totalVisible() || Number(ui.duration.value) * Number(ui.fps.value);
  ui.estimate.textContent = t().estimate(frames);
}

function stopPlayback() {
  playing = false;
  if (previewTimer) clearTimeout(previewTimer);
  previewTimer = null;
  ui.playPreview.textContent = '▶';
}

function playLoop() {
  if (!playing) return;
  const total = totalVisible();
  if (!total) return stopPlayback();
  let next = Number(ui.scrubber.value) + 1;
  if (next > total - 1) next = 0;
  ui.scrubber.value = next;
  renderFrame(next).then(() => {
    const spot = locate(next);
    previewTimer = setTimeout(playLoop, spot ? spot.frame.delay : 120);
  });
}

function resetAll() {
  recording = false;
  stopTicker();
  cleanupStream();
  stopPlayback();
  clips = [];
  selectedClipId = null;
  ui.imageInput.value = '';
  ui.capturePanel.hidden = true;
  ui.studio.hidden = true;
  ui.result.hidden = true;
  ui.clipTools.hidden = true;
  ui.progressBar.style.width = '0';
  ui.scrubber.value = 0;
  setStatus(t().ready);
  updateEstimate();
}

function applyLocale() {
  document.documentElement.lang = locale;
  ui.langToggle.textContent = locale === 'ko' ? 'EN' : 'KO';
  ui.langToggle.setAttribute('aria-label', locale === 'ko' ? 'Switch to English' : '한국어로 전환');
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent || ['SCRIPT', 'STYLE'].includes(parent.tagName) || !node.nodeValue.trim()) continue;
    if (parent.closest('[data-no-i18n]')) continue;
    if (!node.__ko) node.__ko = node.nodeValue.trim();
    const translated = locale === 'en' ? (translations.en[node.__ko] || node.__ko) : node.__ko;
    const leading = node.nodeValue.match(/^\s*/)?.[0] || '';
    const trailing = node.nodeValue.match(/\s*$/)?.[0] || '';
    node.nodeValue = `${leading}${translated}${trailing}`;
  }
  document.querySelectorAll('[placeholder]').forEach((el) => {
    if (!el.placeholder) return;
    if (!el.dataset.placeholderKo) el.dataset.placeholderKo = el.placeholder;
    el.placeholder = locale === 'en' ? (translations.en[el.dataset.placeholderKo] || el.dataset.placeholderKo) : el.dataset.placeholderKo;
  });
  if (!recording && ui.capturePanel.hidden && ui.studio.hidden) setStatus(t().ready);
  updateSelectionElement();
  refreshStudio();
}

/* ---------- events ---------- */

ui.startCapture.addEventListener('click', chooseScreen);
ui.reset.addEventListener('click', chooseScreen);
ui.record.addEventListener('click', startRecording);
ui.stop.addEventListener('click', finishCapture);
ui.selectAll.addEventListener('click', () => { selection = { x: 0, y: 0, w: 1, h: 1 }; updateSelectionElement(); });
ui.imageInput.addEventListener('change', (event) => loadImages([...event.target.files]));
ui.duration.addEventListener('change', updateEstimate);
ui.fps.addEventListener('change', updateEstimate);
ui.width.addEventListener('change', () => { if (totalVisible()) renderFrame(ui.scrubber.value); });
ui.scrubber.addEventListener('input', () => { stopPlayback(); renderFrame(ui.scrubber.value); });
ui.addCaption.addEventListener('click', () => addOverlay('caption', ui.captionText.value.trim()));
ui.captionText.addEventListener('keydown', (event) => { if (event.key === 'Enter') addOverlay('caption', ui.captionText.value.trim()); });
ui.stickers.addEventListener('click', (event) => { if (event.target.tagName === 'BUTTON') addOverlay('sticker', event.target.textContent); });
ui.encode.addEventListener('click', encodeGif);
ui.clearAll.addEventListener('click', () => { if (confirm(t().confirmClear)) resetAll(); });
ui.makeAnother.addEventListener('click', () => { ui.result.hidden = true; });
ui.playPreview.addEventListener('click', () => {
  if (playing) return stopPlayback();
  if (!totalVisible()) return;
  playing = true;
  ui.playPreview.textContent = 'Ⅱ';
  playLoop();
});
ui.langToggle.addEventListener('click', () => {
  locale = locale === 'ko' ? 'en' : 'ko';
  localStorage.setItem('gifmaker-locale', locale);
  applyLocale();
});

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

// ?demo fills the timeline with sample scenes so the UI can be reviewed
// or screenshotted without granting screen-capture permission.
async function runDemo() {
  const params = new URLSearchParams(location.search);
  if (!params.has('demo')) return;
  const make = (from, to, label) => new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 1280, 720);
    gradient.addColorStop(0, from);
    gradient.addColorStop(1, to);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1280, 720);
    ctx.fillStyle = 'rgba(255,255,255,.92)';
    ctx.font = '700 104px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 640, 360);
    canvas.toBlob((blob) => resolve({ blob, w: 1280, h: 720, delay: 1000 }));
  });
  const scenes = await Promise.all([
    make('#ffd483', '#f79a2a', '1'),
    make('#a9dcff', '#4f9ce8', '2'),
    make('#ffc9b8', '#e65d46', '3')
  ]);
  for (const scene of scenes) await addClip('image', [scene]);
  addOverlay('caption', '슈슈랑 GIF 만들기');
  addOverlay('sticker', '✨');
  setStatus(t().imageLoaded(scenes.length));
  const scroll = Number(params.get('scroll'));
  if (scroll) window.scrollTo(0, scroll);
}

applyLocale();
setStatus(t().ready);
runDemo();
