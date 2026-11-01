# Changelog

## 2.2.0 — Tích hợp tùy chọn WILDCORE AI V2 (Experimental) vào AutoBot

- **Tích hợp Cooperative Bridge 1-điểm duy nhất**:
  - Máy chủ chính (`pokesurvivor.com`): Tích hợp trực tiếp tại `pilot.steer` kết nối với hook `Input.axis`, đảm bảo quyền ưu tiên tuyệt đối cho phím bấm thủ công của người chơi (Manual Input Override) ngay trong frame hiện tại.
  - Máy chủ Doofcraft (`pokesurvivor.doofcraft.com`): Tích hợp qua adapter `createVerifiedSiteAdapter` đọc dữ liệu quét canvas/terrain và xuất lệnh bàn phím an toàn.
- **Tùy chọn A/B Testing trên giao diện UI**:
  - Bổ sung tùy chọn `ĐỘNG CƠ DI CHUYỂN` trong tab BATTLE LAB (`tactics`):
    - `V1 (Stable - Mặc định)`: Giữ nguyên 100% thuật toán điều hướng ổn định hiện tại.
    - `V2 (Experimental - WILDCORE AI)`: Kích hoạt bộ điều hướng độc lập WILDCORE AI 2.1 với A* phân đoạn, thoát góc tường 24 hướng, phá vây quái và circuit breaker CPU.
  - Live HUD Badge: Hiển thị trực quan trạng thái động cơ `NAV: V1 (STABLE)` hoặc `NAV: V2 (EXP) · [MODE]` (`STEER`, `ESCAPE`, `COOLDOWN`, `UNAVAILABLE`).
- **Cơ chế Fallback & An toàn tuyệt đối**:
  - Khi V2 gặp lỗi hoặc thiếu dữ liệu va chạm (`UNAVAILABLE`, `COOLDOWN`, `ERROR`), hệ thống dừng an toàn với vector `[0, 0]`, hiển thị cảnh báo trên HUD để người dùng chuyển về V1; tuyệt đối không chạy 2 engine song song trong cùng một frame.
- **Kiểm thử & Đo lường**:
  - Toàn bộ 38 bài unit & integration tests đều vượt qua (`38 passed, 0 failed`).
  - Benchmark 500 tick với 85 quái: trung bình 1.48ms, p95 đạt 2.56ms, bộ nhớ RSS ~42.4MB (đáp ứng hoàn hảo môi trường VPS 1GB RAM).

---

## 2.1.0 — Antigravity handoff

- Thêm `engine.mjs` với opt-in, manual/paused safety gates, snapshot/collision
  validation, top-N entity budget, watchdog CPU và xử lý lỗi.
- Thêm `bridge.mjs` để tích hợp với một điểm điều khiển duy nhất, không hook
  chồng lên autopilot hiện tại.
- Thêm `telemetry.mjs` ring-buffer cục bộ và thống kê p95 tick.
- Thêm `strategy.mjs`: điều chỉnh ưu tiên nhận heal/XP, giảm tham mục tiêu khi
  HP thấp hoặc quái đông, không thay thế preset skill hiện tại.
- Thêm `adapter-template.mjs` cho runtime adapter đã xác minh, đặc biệt Doof.
- Cải thiện `steering.mjs`: mục tiêu xa chia đoạn, blacklist mục tiêu gây kẹt,
  ghi nhớ heading escape thất bại, clock rollback, fail-closed collision.
- `official-controller.mjs` có kiểm tra hook trùng với bot cũ và nhường manual.
- Thêm 13 bài test safety/strategy/integration và 2 case đường dài/blacklist
  pickup, nâng tổng thành 27.
- Thêm sơ đồ luồng nghiệp vụ và prompt giao việc chi tiết cho Antigravity.

