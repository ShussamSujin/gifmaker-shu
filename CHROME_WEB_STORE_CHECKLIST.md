# Chrome Web Store submission checklist

- Package: `gifmaker-shu-extension-v1.0.0.zip`
- Category: Tools
- Default language: Korean
- Additional language: English
- Privacy policy: `https://gifmaker.shu.is/privacy.html`
- Support: `https://gifmaker.shu.is/support.html`
- Store icon: `store-assets/store-icon-128.png` (transparent background)

## Listing text

| Field | Source |
| --- | --- |
| Package title / summary | `extension/_locales/<lang>/messages.json` — edit and re-upload the zip to change these |
| Description (Korean) | `STORE_LISTING_KO.md` → "상세 설명" |
| Description (English) | `STORE_LISTING_EN.md` → "Detailed description" |

## Localized screenshots (1280x800)

| Language | Files |
| --- | --- |
| Korean | `store-assets/screenshot-ko-1.png`, `screenshot-ko-2.png` |
| English | `store-assets/screenshot-en-1.png`, `screenshot-en-2.png` |

Regenerate with headless Chrome against a local server — `?demo` fills the timeline
with sample scenes and `lang` forces the UI language:

```
chrome --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1280,800 --virtual-time-budget=7000 \
  --screenshot=out.png "http://localhost:8642/extension/capture.html?demo&lang=en"
```

Scrolling breaks the fixed background in headless Chrome, so capture a taller window
(`--window-size=1280,1150`) and crop to 1280x800 instead.

## Permissions

The extension declares no permissions. It opens a local capture page when the user clicks the
toolbar icon or the keyboard shortcut.

## Reviewer note

Chrome's native screen-sharing picker asks the user to select a tab, window, or screen. Captured
frames and imported photos stay in the current browser session, are edited locally, encoded by a
bundled GIF library, and downloaded as a GIF. No intermediate MP4 file is created and nothing is
uploaded to an operator server.

## Promotional tiles (24-bit PNG, no alpha)

| Asset | Size | File |
| --- | --- | --- |
| Small tile | 440x280 | `store-assets/promo-small-440x280.png` |
| Marquee tile | 1400x560 | `store-assets/promo-marquee-1400x560.png` |
| Small tile (EN) | 440x280 | `store-assets/promo-small-en-440x280.png` |
| Marquee tile (EN) | 1400x560 | `store-assets/promo-marquee-en-1400x560.png` |

Rendered from `store-assets/promo.html` (`?tile=small|marquee&lang=ko|en`) with headless Chrome
at the exact tile size, then converted to RGB so the PNG carries no alpha channel.
