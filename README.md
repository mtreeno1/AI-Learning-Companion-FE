---
title: "AI Learning Companion – Giải thích Hệ thống Dễ Hiểu"
subtitle: "Tài liệu Diễn giải"
version: "1.1"
date: "January 2026"
---

# 🎓 AI Learning Companion
## Hệ thống AI hỗ trợ tập trung học tập – Giải thích từ gốc

---

## 📌 Mục tiêu của hệ thống là gì?

AI Learning Companion là một **trợ lý học tập thông minh**, giúp người học:

- 📸 **Tự nhận biết mức độ tập trung của bản thân**
- 🚫 Phát hiện các hành vi gây mất tập trung (dùng điện thoại, rời ghế)
- 📊 Đánh giá chất lượng phiên học bằng **điểm số công bằng**
- 🔔 Nhắc nhở kịp thời để quay lại trạng thái tập trung

👉 Quan trọng nhất:  
> **Hệ thống không “phạt oan” người học chỉ vì camera gửi nhiều ảnh.**

---

## 🧭 Tổng quan cách hệ thống hoạt động (Big Picture)

Camera → Gửi hình → AI phân tích → Đánh giá trạng thái → Tính điểm → Cảnh báo

yaml
Copy code

Cứ **0.5 giây**, hệ thống làm một vòng kiểm tra như vậy.

Bạn có thể tưởng tượng giống như:
> “Một người giám thị AI quan sát nhẹ nhàng, không soi mói từng giây.”

---

## 1️⃣ Use Cases – Hệ thống dùng trong những tình huống nào?

---

## UC-01: Tạo phiên học mới

### 🧠 Người dùng đang làm gì?

- Chọn chế độ học (Pomodoro, 52-17…)
- Đặt tên phiên học (VD: *Morning Study*)
- Bật camera
- Nhấn **Start**

### 🤖 Hệ thống làm gì phía sau?

1. Tạo một **phiên học mới** trong hệ thống
2. Gán cho phiên đó:
   - Điểm ban đầu = **100**
   - Thời gian bắt đầu
3. Mở kết nối **WebSocket** để trao đổi dữ liệu real-time

📌 *WebSocket giống như một cuộc gọi điện – không cần gửi request liên tục.*

---

## UC-02: Giám sát thời gian thực (Real-time Monitoring)

### 📸 Camera gửi dữ liệu như thế nào?

- Mỗi **0.5 giây**, frontend gửi **1 ảnh** (JPEG, nén nhẹ)
- Backend nhận ảnh → đưa vào AI

### 🤖 AI sẽ kiểm tra những gì?

1. **Có người trong khung hình không?**
2. **Người đó có đang ngồi đúng không?**
3. **Có điện thoại xuất hiện không?**

Sau đó AI gửi lại kết quả dạng:

- Bạn có đang tập trung không?
- Có vi phạm không?
- Điểm hiện tại là bao nhiêu?

👉 Người dùng **nhìn thấy phản hồi gần như ngay lập tức**.

---

## UC-03: Phát hiện vi phạm – Điểm quan trọng nhất của hệ thống

### ❓ Vi phạm là gì?

| Hành vi | Có bị coi là vi phạm? |
|------|----------------|
| Cầm điện thoại | ✅ Có |
| Rời khỏi ghế | ✅ Có |
| Ngồi hơi lệch | ⚠️ Nhắc nhẹ |
| Ngồi tập trung | ❌ Không |

---

## ⚠️ VẤN ĐỀ LỚN: Nếu cứ phạt theo từng ảnh thì sao?

Ví dụ:
- Camera gửi **2 ảnh / giây**
- Bạn cầm điện thoại **10 giây**
- → AI thấy điện thoại **20 lần**

❌ Nếu mỗi lần đều tính là vi phạm:
- 20 violations
- -100 điểm
- **Quá vô lý và không công bằng**

---

## ✅ GIẢI PHÁP: Event-Based Violation (Phạt theo sự kiện)

### 🎯 Triết lý thiết kế

> **Một hành vi sai = một vi phạm**  
> Không quan trọng kéo dài bao lâu

---

### 📱 Ví dụ: Cầm điện thoại 10 giây

| Thời điểm | Điều xảy ra | Vi phạm | Điểm |
|--------|-----------|---------|------|
| 0s | Bắt đầu cầm phone | +1 | -5 |
| 0.5s → 10s | Vẫn cầm | +0 | -0.1 mỗi frame |
| 10s | Bỏ phone | +0 | Không trừ |

👉 Tổng kết:
- **1 violation**
- **Mất ~7 điểm**
- Hợp lý ✅

---

## 2️⃣ Cơ chế AI Detection – AI nhìn và hiểu thế nào?

---

## 2.1 Nhận diện người (Person Detection)

### 🤖 AI làm gì?

- Tìm **khuôn mặt** trong ảnh
- Đánh giá mức độ chắc chắn (confidence)

### 📊 Ý nghĩa confidence

| Confidence | Ý nghĩa |
|----------|--------|
| ≥ 0.7 | Ngồi rất rõ, tư thế tốt |
| 0.3 – 0.7 | Có người, nhưng hơi lệch |
| < 0.3 | Có thể đã rời ghế |

👉 Không cần chính xác tuyệt đối, chỉ cần **đủ tốt để nhắc nhở**

---

## 2.2 Nhận diện điện thoại (Phone Detection)

### 🤖 Công nghệ

- Dùng mô hình **YOLO**
- Chỉ tìm **đối tượng điện thoại**

### 📊 Độ tin cậy

| Confidence | Hành động |
|----------|-----------|
| ≥ 0.7 | Chắc chắn là phone → phạt |
| 0.4 – 0.7 | Khả năng cao → phạt |
| < 0.4 | Không chắc → bỏ qua |

👉 Tránh phạt nhầm vật giống điện thoại

---

## 2.3 Đánh giá trạng thái tập trung

### 🧠 Logic rất đơn giản

```text
Có người + Không dùng phone = Tập trung
Người	Phone	Kết luận
Có	Không	✅ Focus
Có	Có	🚨 Distracted
Không	Không	🚨 Left seat

3️⃣ Hệ thống tính điểm – Công bằng & dễ hiểu
🎯 Nguyên tắc
Điểm bắt đầu: 100

Điểm không bao giờ < 0 hoặc > 100

Phạt mạnh lúc bắt đầu vi phạm

Phạt nhẹ nếu vẫn cố tình

Hồi điểm chậm khi tập trung lại

📉 Phạt
Hành vi	Mức phạt
Cầm phone (bắt đầu)	-5
Rời ghế (bắt đầu)	-3
Vi phạm kéo dài	-0.1 / frame

📈 Hồi điểm
Điều kiện	Hồi điểm
Tập trung liên tục	+0.2 / frame

👉 Muốn hồi lại 5 điểm → cần ~12.5 giây tập trung

4️⃣ Hệ thống cảnh báo – Nhắc nhở chứ không dọa nạt
🔔 3 mức cảnh báo
Mức	Khi nào	Mục đích
🟡 Gentle	Ngồi chưa tốt	Nhắc nhẹ
🟠 Urgent	Vi phạm	Cảnh báo rõ
🔴 Critical	Nhiều vi phạm	Đánh thức người học

🧠 Tư duy thiết kế
AI giống huấn luyện viên, không phải cảnh sát

Không la hét liên tục

Chỉ tăng mức độ khi người học liên tục không sửa

5️⃣ Vì sao hệ thống này “đáng tin”?
✅ Không phạt oan
Event-based, không frame-based

✅ Phản hồi nhanh
< 500ms

✅ Dễ mở rộng
Có thể thêm eye tracking, posture, buồn ngủ…

✅ Phù hợp giáo dục
Khuyến khích thay đổi hành vi, không gây stress

🎯 Tổng kết ngắn gọn
css
Copy code
AI Learning Companion không nhằm kiểm soát người học,
mà giúp họ tự nhận thức và điều chỉnh sự tập trung của chính mình.
🎓 Phù hợp cho học sinh – sinh viên

🧠 Áp dụng tốt cho self-study

🚀 Nền tảng tốt để mở rộng AI giáo dục
