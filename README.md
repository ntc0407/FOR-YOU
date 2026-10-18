# FOR YOU · V8 — Camera & performance update

Website 3D tri ân ngày 20/10, sử dụng một link chung cho tất cả người nhận.

## Sửa lỗi ở V8

- **Điều khiển camera desktop:** đưa con trỏ sang bên trái màn hình → nhìn sang trái; đưa sang phải → nhìn sang phải. Đưa về gần giữa màn hình → camera ngừng tự quay. Không cần giữ chuột; để con trỏ ở một bên đủ lâu sẽ xoay được 360°. Camera tạm dừng tự quay khi đang tương tác với bảng, nút hoặc hộp thoại.
- **Sửa sự kiện chuột:** ở bản trước phần giao diện che canvas nên nó không nhận được đầy đủ các sự kiện trỏ chuột. V8 bắt sự kiện ở vùng khám phá của trang và bỏ qua những điều khiển UI.
- **Mượt hơn:** nội suy góc quay với hàm giảm chấn theo thời gian, giảm độ phân giải WebGL ban đầu, tự giảm độ phân giải nếu FPS thấp liên tục và hồi phục có kiểm soát nếu FPS ổn định. Giảm hiệu ứng blur của các khối giao diện lớn.
- **Không thay đổi bố cục V7**, vẫn có bottom sheet điện thoại, joystick, thư cá nhân hóa và xuất thiệp PNG.

## Chạy thử

Trong VS Code, mở `index.html` bằng Live Server. Di chuột qua vùng không gian 3D, không cần giữ nút. Di chuột về giữa màn hình để dừng xoay. Dùng `W A S D` để đi.

**Lưu ý:** cảm giác mượt thực tế còn phụ thuộc GPU, driver, trình duyệt và thiết bị. Hãy kiểm tra hiệu suất WebGL trên máy bạn; không thể cam kết FPS cố định ở mọi máy.

## Cập nhật GitHub & Vercel

Giải nén rồi chép đè **tất cả file** vào đúng thư mục dự án đã kết nối GitHub, giữ nguyên `.git`. Chạy:

```bash
git add .
git commit -m "FOR YOU V8 - Correct mouse look and optimize performance"
git push origin main
```

Vercel sẽ tự deploy nếu dự án đã kết nối GitHub. Kiểm tra trạng thái Ready và mở lại trang bằng tab ẩn danh để tránh cache.
