# FOR YOU V10 — ổn định camera và sửa thanh chọn chương

Phiên bản V10 tiếp tục V9, giữ nguyên nội dung tri ân, thư cá nhân hóa, một URL chung và giao diện điện thoại V7–V9.

## Sửa trong V10

- **Desktop:** thanh chọn chương Hoa / Ánh sáng / Cây tri ân trở lại trong suốt. Sửa CSS gây một khối nền tối hình chữ nhật bên phải.
- **Camera desktop:** quay lại điều khiển **giữ chuột trái rồi kéo** trên vùng thế giới 3D; kéo phải nhìn phải, kéo trái nhìn trái. Không tự quay khi rê chuột vào bảng hoặc khi con trỏ đứng lệch tâm.
- **Camera điện thoại:** vẫn vuốt trên vùng 3D để nhìn, dùng joystick để di chuyển.
- **Hiệu suất:** giữ tối ưu marker và render của V9; dùng chất lượng WebGL cố định (desktop 0.95, mobile 0.8) để tránh các đợt resize framebuffer trong lúc khám phá.
- **Cache:** đổi tài nguyên thành `?v=10` để trình duyệt nhận bản CSS/JS mới sau khi deploy.

## Chạy thử

Mở thư mục bằng VS Code, dùng Live Server để mở `index.html`. Trên desktop nhập tên, bắt đầu, thử WASD; giữ chuột trái và kéo trên vùng cảnh 3D để quan sát.

Lưu ý: Không thể kéo bắt đầu **trên bảng và các nút**, vì chúng dùng để chọn nội dung. Bắt đầu kéo từ vùng 3D trống vẫn tiếp tục di chuyển khi con trỏ đi qua bảng.

Khi đã triển khai, thêm `?debug=1` vào link để xem FPS. Trình duyệt thử nghiệm tại đây dùng chế độ đồ họa dự phòng, **chưa xác nhận FPS trên GPU thật**.

## Cập nhật GitHub / Vercel

1. Giải nén ZIP. Chép đè toàn bộ file vào **thư mục Git cũ**, giữ nguyên `.git`.
2. Trong VS Code:

```bash
git add .
git commit -m "FOR YOU V10 - Fix chapter nav and restore stable camera drag"
git push origin main
```

3. Đợi Vercel báo **Ready** và kiểm tra lại website bằng cửa sổ ẩn danh.
