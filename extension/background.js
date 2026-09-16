async function openCapture() {
  const url = chrome.runtime.getURL('capture.html');
  const tabs = await chrome.tabs.query({ url: `${url}*` });
  if (tabs[0]?.id) {
    await chrome.tabs.update(tabs[0].id, { active: true });
    if (tabs[0].windowId) await chrome.windows.update(tabs[0].windowId, { focused: true });
    return;
  }
  await chrome.tabs.create({ url });
}

chrome.action.onClicked.addListener(openCapture);
chrome.commands.onCommand.addListener((command) => { if (command === 'start-capture') openCapture(); });
