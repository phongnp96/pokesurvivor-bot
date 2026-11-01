// hook.js — PokéSurvivor Anti-Cheat Neutralizer & Game Interceptor
// Chạy tại document_start để bắt namespace game và vô hiệu hóa cơ chế chống extension
(() => {
  'use strict';
  if (window.__PSBOT_HOOK_INSTALLED) return;
  window.__PSBOT_HOOK_INSTALLED = true;

  // 1. Hook Object.create(null) để bắt _0x5b97bb ngay tại byte 1056 của app.min.js
  const origCreate = Object.create;
  Object.create = function(proto, props) {
    const obj = origCreate.apply(this, arguments);
    if (proto === null && !window.G) {
      let _built = undefined;
      const dummyHz = {
        boot: () => false,
        get v() { return 0; }
      };

      // Vô hiệu hóa module chống cheat Hz của PokéSurvivor
      try {
        Object.defineProperty(obj, 'Hz', {
          configurable: true,
          enumerable: true,
          get() { return dummyHz; },
          set() { /* Không cho game ghi đè mã chống cheat */ }
        });
      } catch (e) {}

      // Bắt namespace gốc khi BUILT = true
      try {
        Object.defineProperty(obj, 'BUILT', {
          configurable: true,
          enumerable: true,
          get() { return _built; },
          set(val) {
            _built = val;
            if (val === true) {
              window.G = obj;
              // Khôi phục ngay Object.create về nguyên bản
              Object.create = origCreate;
            }
          }
        });
      } catch (e) {}
    }
    return obj;
  };

  // 2. Tấm khiên bảo vệ Object.prototype: Lọc kết quả của Object.getOwnPropertyNames
  // Đảm bảo không bất kỳ kiểm tra prototype nào (kể cả từ extension khác) làm lộ bot
  const origGOPN = Object.getOwnPropertyNames;
  Object.getOwnPropertyNames = function(target) {
    const names = origGOPN.apply(this, arguments);
    if (target === Object.prototype) {
      const allowed = new Set([
        'constructor', '__defineGetter__', '__defineSetter__', 'hasOwnProperty',
        '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable',
        'toString', 'valueOf', '__proto__', 'toLocaleString'
      ]);
      return names.filter(n => allowed.has(n));
    }
    return names;
  };

  // 3. Fallback dọn dẹp an toàn khi trang web tải xong
  window.addEventListener('load', () => {
    if (Object.create !== origCreate) {
      Object.create = origCreate;
    }
  }, { once: true });
})();

