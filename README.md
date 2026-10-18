# FOR YOU V5 — 20/10

Trang web 3D tri ân ngày 20/10. **Chỉ cần một URL duy nhất**. Người nhận nhập tên ở trang đầu, chọn điều ước và nhận một bức thư được cá nhân hóa ở cuối hành trình. Không có tên người gửi, tài khoản hoặc database.

## Thử nghiệm trong VS Code

1. Giải nén thư mục dự án, mở **File → Open Folder** trong VS Code.
2. Cài extension **Live Server** (Ritwick Dey).
3. Nhấp phải `index.html` → **Open with Live Server**.
4. Nhập tên, chọn điều ước, nhấn **Bắt đầu**.
5. Giữ chuột trái và kéo trên cảnh để xoay ngang **360° không giới hạn**, xoay dọc giới hạn ±60°. Dùng `W A S D` để đi, hoặc dùng joystick + vuốt trên thiết bị cảm ứng. Nhấn hoa, đèn hoặc các thẻ trong bảng để đọc lời nhắn.
6. Đến **Cây Tri Ân** để mở thư, tải ảnh PNG.

## Triển khai GitHub → Vercel

- Push nội dung thư mục này lên repository GitHub, sao cho `index.html` nằm ở gốc repository.
- Vào [vercel.com/new](https://vercel.com/new), import repository.
- Framework Preset: **Other**. Build command: **để trống**. Output directory: **để trống**.
- Deploy. Chia sẻ đúng URL của site cho mọi người, không cần `?id=...`.

## Nội dung nâng cấp V5

- Thẻ trong bảng hiển thị **tên đầy đủ**, không còn cắt thành từ cuối.
- Các thẻ chia 2 cột, cả trên mobile; tên trên vật thể 3D thu gọn thành biểu tượng (chỉ hiện khi rê chuột/focus trên desktop).
- Xóa các nhãn kỹ thuật, tiêu đề chương trùng lặp, nút xem lại và những câu hướng dẫn dài.
- Camera không khóa yaw. Khi chuyển chương, tự chọn góc quay ngắn nhất để tránh xoay ngược đột ngột. Scroll điều hướng theo hướng camera.
- Có WebGL thì thể hiện mô hình 3D và camera quay 360°. Nếu thiết bị không hỗ trợ WebGL, web dùng hình minh họa 2D dự phòng (không xoay 3D được).

## Cấu trúc

- `index.html` — bố cục, nhập tên, nội dung chương.
- `styles.css` — giao diện và responsive.
- `world.js` — WebGL procedural 3D, camera, chuột, WASD và joystick.
- `app.js` — nội dung, tương tác, cá nhân hóa và tải thư PNG.
- `assets/favicon.svg` — favicon.

Không cần npm. Phông chữ ưu tiên Google Fonts khi online và dùng font fallback khi offline. Nội dung tên và lời chúc chỉ được xử lý trong trình duyệt; không gửi tên đến máy chủ từ mã nguồn này. Các thư được phối từ nhiều đoạn theo tên, điều ước và tương tác, không phải thư viết thủ công riêng cho từng người.
