# FOR YOU V12 — Soft-focus distance reveal

Phiên bản V12 được phát triển trực tiếp từ V11. Giữ nguyên một URL chung, nhập tên người nhận ở trang đầu, điều khiển desktop/mobile, ba chương 3D và bức thư cá nhân hóa.

## Điểm mới ở V12 — xa mờ, gần rõ

- **Không còn Cây Tri Ân bất ngờ xuất hiện:** đã bỏ điều kiện ẩn hoàn toàn mô hình khi camera ở xa. Hoa, đèn, cây và trái tim luôn được render nếu nằm trong góc nhìn; tất cả dùng chung công thức khoảng cách.
- **Sương mờ theo khoảng cách (distance fog):** độ tương phản/màu sắc của vật thể giảm dần từ khoảng 19 đến 108 đơn vị, rồi từ từ hiện rõ khi tiến lại gần. Không có điểm bật/tắt cứng.
- **Blur hậu kỳ nhẹ (soft focus):** nếu thiết bị hỗ trợ framebuffer WebGL, một lớp 5-tap xử lý màu theo khoảng cách của từng pixel. Khoảng cách xa mờ hơn, gần rõ hơn. Mobile dùng mức mờ nhẹ hơn desktop để giảm gánh nặng GPU.
- **Dự phòng hiệu suất:** nếu framebuffer không được hỗ trợ, website vẫn chạy với distance fog. Mở `?blur=0` để tắt riêng bước soft-focus, giữ nguyên sương mờ; dùng `?debug=1` để so sánh FPS.
- **Các biểu tượng tương tác cũng hiện dần:** thay vì chỉ xuất hiện tại một mốc 48 đơn vị, icon mờ và giảm opacity từ xa (64 đơn vị), dần trở nên rõ khi tiến đến gần.
- **Không làm mờ chữ, nút hay bảng nội dung:** chỉ tác động lên thế giới 3D và marker trong cảnh.
- **Giữ nguyên điều khiển:** desktop giữ chuột kéo để xoay; điện thoại vuốt hướng nào nhìn hướng đó, joystick như V11.

## Kiểm tra bản V12

1. Trong VS Code mở `index.html` qua Live Server.
2. Nhập tên, đi từ khu vườn đến khu ánh sáng và Cây Tri Ân. Quan sát các mô hình trong nền: ở xa mờ, đến gần dần rõ, không xuất hiện đột ngột.
3. Kiểm tra lần lượt bằng desktop và điện thoại thực. So sánh `/?debug=1` và `/?debug=1&blur=0` để đánh giá mức tiêu thụ FPS của bước làm mờ hậu kỳ.
4. Thử lại các thao tác camera, joystick, mở lời nhắn và tải thư PNG.

## Triển khai lên GitHub và Vercel

Giải nén ZIP và chép đè **toàn bộ nội dung** vào thư mục Git cũ, giữ nguyên `.git`. Không chép nguyên thư mục V12 lồng vào thư mục dự án.

```bash
git status
git add .
git commit -m "FOR YOU V12 - Add distance fog and soft focus"
git push origin main
```

Vercel tự deploy lại trên nhánh `main`. Chờ **Ready**, sau đó kiểm tra website trong tab ẩn danh. Không cần npm hay build command.

## Giới hạn kiểm thử

Mã JS đã kiểm tra cú pháp; các hướng vuốt, joystick, chuyển chương, mở thư đã được kiểm tra trong trình duyệt Chromium mô phỏng nhiều kích thước. Đã thử lớp fallback 2D. **Chưa kiểm chứng hiệu ứng hậu kỳ WebGL trên GPU điện thoại thật**. Nếu điện thoại cụ thể còn khựng, so sánh chỉ số FPS tại `?debug=1` để tối ưu tiếp.
