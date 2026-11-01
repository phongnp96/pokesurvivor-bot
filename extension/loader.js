// loader.js — PokéSurvivor AutoBot Smart Auto-Loader
// Tự động kiểm tra và nạp bản bot mới nhất từ repo: phongnp96/pokesurvivor-bot
(() => {
  'use strict';
  if (window.__PSBOT_LOADER_INITIALIZED) return;
  window.__PSBOT_LOADER_INITIALIZED = true;

  const REMOTE_URL = 'https://raw.githubusercontent.com/phongnp96/pokesurvivor-bot/main/bot.js';
  const CDN_FALLBACK_URL = 'https://cdn.jsdelivr.net/gh/phongnp96/pokesurvivor-bot@main/bot.js';
  const CACHE_KEY = 'psbot_wildcore_cached_bundle';
  const CACHE_TIME_KEY = 'psbot_wildcore_cache_time';

  // Thực thi mã nguồn bot an toàn vào window context của trang game
  const runBot = (code) => {
    if (!code || window.__PSBOT_RUNNING) return;
    try {
      const script = document.createElement('script');
      script.textContent = code;
      (document.head || document.documentElement).appendChild(script);
      script.remove();
      window.__PSBOT_RUNNING = true;
      return true;
    } catch (e) {
      try {
        window.eval(code);
        window.__PSBOT_RUNNING = true;
        return true;
      } catch (err) {
        console.error('[PSBot Loader] Không thể thực thi bot code:', err);
        return false;
      }
    }
  };

  // Lấy bản cache hiện tại nếu có
  let cachedCode = null;
  try {
    cachedCode = localStorage.getItem(CACHE_KEY);
  } catch(e) {}

  // Hàm tải code từ mạng với timeout bảo vệ
  const fetchWithTimeout = async (url, timeoutMs = 2500) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url + '?t=' + Date.now(), {
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timer);
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 5000 && text.includes('WILDCORE')) {
          return text;
        }
      }
    } catch(err) {
      clearTimeout(timer);
    }
    return null;
  };

  // Khởi động bot thông minh
  const init = async () => {
    // 1. Thử tải bản mới nhất từ GitHub
    let latestCode = await fetchWithTimeout(REMOTE_URL, 2000);
    if (!latestCode) {
      // Dự phòng qua CDN jsDelivr nếu GitHub raw bị chặn
      latestCode = await fetchWithTimeout(CDN_FALLBACK_URL, 2000);
    }

    if (latestCode) {
      // Có bản mới từ mạng: lưu cache và chạy ngay
      try {
        localStorage.setItem(CACHE_KEY, latestCode);
        localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
      } catch(e) {}
      runBot(latestCode);
      console.log('⚡ [PSBot] Đã nạp phiên bản mới nhất từ GitHub (phongnp96/pokesurvivor-bot)');
      return;
    }

    // 2. Nếu mạng lag / offline: chạy từ cache
    if (cachedCode) {
      runBot(cachedCode);
      console.log('🛡️ [PSBot] Đang chạy bản từ bộ nhớ đệm (Offline Cache)');
      return;
    }

    // 3. Nếu chưa có cache (lần đầu cài đặt khi không có mạng): thử đọc file cục bộ bot.local.js
    try {
      const localUrl = chrome.runtime.getURL('bot.local.js');
      const res = await fetch(localUrl);
      if (res.ok) {
        const localCode = await res.text();
        runBot(localCode);
        console.log('📦 [PSBot] Đang chạy bản cài đặt gốc (Local Fallback)');
      }
    } catch(e) {
      console.warn('[PSBot] Không thể tải local fallback:', e);
    }
  };

  init();
})();

