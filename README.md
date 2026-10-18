# FOR YOU V11 — Mobile touch and performance update

Phiên bản V11 dựa trực tiếp trên V10. Vẫn giữ nguyên: 1 URL chung, trang đầu nhập tên người nhận, 3 chương 3D, lời nhắn và lá thư cá nhân.

## Những thay đổi ở V11

- **Vuốt để nhìn trên điện thoại:** vuốt trái → camera nhìn trái; vuốt phải → nhìn phải; vuốt lên → nhìn lên; vuốt xuống → nhìn xuống. Không đảo hướng.
- **Độ nhạy:** tăng hệ số quay khi vuốt từ `0.0042` lên `0.0065` rad/px (ngang), từ `0.0033` lên `0.0051` rad/px (dọc). Giảm độ trễ bằng nội suy theo thời gian nhanh hơn chỉ trên mobile.
- **Di chuyển bằng joystick:** tốc độ di chuyển mobile 10.8 thay vì 7.4 đơn vị/giây; thêm lọc nhẹ chống rung, deadzone nhỏ, giới hạn tốc độ chéo, và không đo lại layout mỗi sự kiện di chuyển ngón tay.
- **WebGL mobile:** tỉ lệ render cố định 0.74 (trước là 0.8); tắt multisample antialiasing trên mobile; giới hạn số điểm hạt được vẽ trên điện thoại còn 650. Không có cơ chế tăng/giảm chất lượng liên tục trong khi xoay camera.
- **Vùng cảm ứng 3D:** thêm `.look-zone` để trình duyệt không hiểu thao tác vuốt cảnh là cuộn trang. Bảng nội dung khi mở rộng vẫn cho phép cuộn dọc độc lập.
- **Desktop:** giữ cách giữ chuột trái rồi kéo để xoay, không thay đổi điều khiển desktop.

## Kiểm tra bản V11

1. Chạy `index.html` trong Live Server của VS Code.
2. Dùng Chrome/Edge trên điện thoại: mở màn hình bắt đầu, nhập tên, bấm **Bắt đầu**.
3. Vuốt ở **vùng cảnh 3D** (không vuốt vào bảng hoặc các nút). Vuốt bốn hướng, xác nhận khung cảnh chuyển động đúng hướng ngón tay.
4. Dùng joystick: kéo lên để tiến, kéo xuống để lùi, trái/phải để đi ngang. Thả tay để dừng.
5. Nhấn **Xem các lời nhắn**, cuộn nội dung, rồi thu gọn. Mở thư cuối hành trình.
6. Nếu muốn quan sát FPS, mở website với `?debug=1`. Cần kiểm tra FPS trên GPU điện thoại thật vì trình duyệt kiểm thử tự động không đại diện cho phần cứng người nhận.

## Triển khai lên GitHub và Vercel

Giải nén ZIP và chép đè **toàn bộ nội dung** vào thư mục Git cũ, giữ nguyên `.git`. Không chép nguyên thư mục V11 lồng vào thư mục dự án.

```bash
git status
git add .
git commit -m "FOR YOU V11 - Improve mobile swipe and movement"
git push origin main
```

Vercel tự deploy lại trên nhánh `main`. Chờ **Ready**, sau đó kiểm tra website trong tab ẩn danh. Không cần npm hay build command.

## Giới hạn kiểm thử

Mã JS đã kiểm tra cú pháp; các hướng vuốt, joystick, chuyển chương, mở thư đã được kiểm tra trong trình duyệt Chromium mô phỏng nhiều kích thước. Đã thử lớp fallback 2D. **Chưa đo được hiệu năng WebGL trên GPU điện thoại thật**. Nếu điện thoại cụ thể còn khựng, so sánh chỉ số FPS tại `?debug=1` để tối ưu tiếp.
