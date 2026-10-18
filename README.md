# FOR YOU V9 — Camera continuity & FPS stability

Một đường link duy nhất, thư cá nhân hóa theo tên người nhận. Phiên bản này cập nhật từ FOR YOU V8.

## Sửa trong V9

- Camera desktop **luôn nhận chuột khi con trỏ nằm trên bảng/chữ/nút**. Chỉ tạm dừng khi hộp thoại/lá thư đang mở hoặc camera đang chuyển vị trí giữa các chương.
- Không cần nhấn giữ chuột. Trái → quay trái; phải → quay phải; đưa về vùng giữa → dừng. Dead zone tăng lên 16%, đường cong điều khiển nhẹ và tốc độ góc giới hạn để tránh rung.
- Giảm chi phí GPU khi render: mức pixel ratio desktop từ 1.25 xuống 1.0, mobile từ 1.0 xuống 0.85; cắt một số mô hình ngoài tầm nhìn.
- Bỏ cơ chế **tự tăng lại độ phân giải** gây khựng; chỉ giảm tối đa 2 lần nếu FPS thấp kéo dài, sau đó giữ ổn định.
- Tránh đọc/ghi layout liên tục: cache hình chữ nhật UI, giảm marker updates từ ~12 lần/giây xuống ~7 lần/giây và chỉ cập nhật class/toạ độ nếu cần.
- Bỏ backdrop blur nặng trên giao diện trong khi WebGL render.
- Giữ thiết kế mobile của V8 và nội dung lời chúc/lá thư.

## Cách chạy

Mở folder bằng VS Code, dùng **Live Server** trên `index.html`.

Để hiện FPS khi chạy trang đã deploy, mở:

`https://for-you-lake-beta.vercel.app/?debug=1`

Khung nhỏ phía dưới sẽ báo FPS và tỉ lệ render. Mở link bình thường (không có `?debug=1`) sẽ không thấy khung đo.

## Checklist ngắn (nên kiểm tra trên GPU thật)

1. Rê chuột qua giữa bảng bên trái, qua cả nút và vùng văn bản: camera vẫn quay theo chuột.
2. Đưa chuột về giữa màn hình: camera dừng, không tự trôi.
3. Quay góc nhìn 360° và vừa dùng WASD vừa quay.
4. Mở một lời nhắn: camera tạm dừng khi modal đang mở; đóng modal để tiếp tục.
5. So sánh FPS ở `?debug=1` với V8 và kiểm tra Vercel đã cập nhật bản mới.
6. Kiểm tra lại trên điện thoại thật.

Đã kiểm tra cú pháp JavaScript và các luồng chính trong Chromium với renderer dự phòng; **chưa đo FPS WebGL trên GPU thật của người dùng**. Không cam kết 60 FPS trên mọi thiết bị.

## Đẩy mã lên GitHub, để Vercel tự cập nhật

Giải nén, chép đè **toàn bộ** file của V9 vào đúng folder Git cũ, không xoá thư mục `.git`. Sau đó:

```bash
git add .
git commit -m "FOR YOU V9 - Optimize camera and performance"
git push origin main
```
