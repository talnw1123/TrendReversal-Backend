# 🐳 Docker Documentation - TrendReversal Backend

คู่มือการใช้งาน Docker สำหรับ TrendReversal Backend

## ความต้องการของระบบ

- **Docker Desktop** เวอร์ชัน 20.10 ขึ้นไป
- **Docker Compose** เวอร์ชัน 2.0 ขึ้นไป
- **RAM** อย่างน้อย 4GB
- **Disk Space** อย่างน้อย 2GB

---

## โครงสร้างไฟล์

```
backend/
├── docker-compose.yml    # กำหนด services ทั้งหมด
├── Dockerfile            # สร้าง image สำหรับ backend
├── .dockerignore         # ไฟล์ที่ไม่ต้องการใน Docker build
└── .env                  # Environment variables
```

---

## การเริ่มต้นใช้งาน

### 1. สร้างไฟล์ .env

สร้างไฟล์ `.env` ในโฟลเดอร์ `backend/` 

### 2. Build และ Run ทุก Services

```bash
# เข้าไปที่โฟลเดอร์ backend
cd backend

# Build และ Start ทุก services
docker compose up -d --build
```

### 3. ตรวจสอบสถานะ

```bash
# ดู containers ที่กำลังทำงาน
docker compose ps

# ดู logs ของ backend
docker compose logs backend --tail=50
```

---
## Services ที่มีในระบบ

### 1. Backend (NestJS)

| รายละเอียด | ค่า |
|------------|-----|
| **Container Name** | trend_reversal_backend |
| **Image** | backend-backend |
| **Port (Host → Container)** | 3000 → 3000 |
| **URL** | http://localhost:3000 |
| **Swagger Docs** | http://localhost:3000/api/docs |

### 2. PostgreSQL

| รายละเอียด | ค่า |
|------------|-----|
| **Container Name** | trend_reversal_db |
| **Image** | postgres:15-alpine |
| **Port (Host → Container)** | 8000 → 5432 |
| **Username** | postgres |
| **Database** | trend_reversal_db |
| **Volume** | postgres_data |

### 3. Redis

| รายละเอียด | ค่า |
|------------|-----|
| **Container Name** | trend_reversal_redis |
| **Image** | redis:7-alpine |
| **Port (Host → Container)** | 7000 → 6379 |
| **Volume** | redis_data |

