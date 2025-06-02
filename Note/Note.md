# Lưu ý quan trọng

## Cấu hình môi trường
- File `.cursorignore` đã disable file `.env` nên không thể load biến môi trường
- Các thay đổi được thực hiện trong `backend/app/config/config.js`
- Khi thực hiện, hãy đối chiếu với bản commit cũ nếu cần thiết

## Testing & Báo cáo
- Các middleware authorize trong `reportRoutes.js` đã được comment để thuận tiện cho việc test và tạo báo cáo

## Cập nhật mới
### Cấu trúc dữ liệu
- Bổ sung schema `roomtypes` riêng biệt để hỗ trợ tính năng của quy định 6

### Ràng buộc bổ sung
- Tạo booking sẽ khóa phòng, không cho tạo thêm
- Khi tạo Invoice để thanh toán booking, booking sẽ chuyển sang status `inPayment` để tránh nhiều invoice cho 1 booking
- Bổ sung `confirmPayment` để xác nhận Invoice đã thanh toán
- Các status được tự động cập nhật theo workflow, không cần admin tự set

### Hạn chế
- Tính năng update cho room, booking, invoice chưa được cài đặt route do chưa rõ nhu cầu
- Các tính năng update này bị hạn chế

### Testing
- Seed đã được chỉnh sửa theo cấu trúc dữ liệu mới
- Xóa hết dữ liệu trong database trước khi chạy seed để test
- File Postman mới đã được cập nhật trong thư mục `backend/app/configs`
