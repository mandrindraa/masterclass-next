# School Management System — Full Specification

> Single-instance per school · Full-stack Next.js · PostgreSQL · Local file storage

---

## 1. Project Overview

A web-based school management system serving three roles: **Surveillant**, **Teacher**, and **Student**. Each school deploys its own isolated instance. The system handles student and teacher lifecycle management, course and grade management (Malagasy /20 system with coefficients), QR-based attendance tracking, and academic period configuration (bimester or trimester per year).

---

## 2. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 16** (App Router) | Full-stack: UI + API Routes + Server Actions |
| Language | **TypeScript** | Type safety across the whole codebase |
| Database | **PostgreSQL** | Relational integrity, RLS-ready |
| ORM | **Prisma** | Schema-first, type-safe queries |
| Auth | **NextAuth.js v5** | Role-based sessions, credentials provider |
| File Storage | **Local filesystem** (`/uploads`) | Simplest setup; abstracted behind a service layer for future S3/RustFS migration |
| Styling | **Tailwind CSS + shadcn/ui** | Rapid, consistent UI |
| QR Codes | **qrcode** (generation) + **html5-qrcode** (scanning) | Client-side scan via camera |
| Deployment | **Docker + Nginx** | Consistent with my existing setup |

> **Note on RustFS:** The file upload service is abstracted behind a `StorageService` interface. Switching from local disk to RustFS (S3-compatible) later only requires implementing the interface with an S3 SDK — no application logic changes needed.

---

## 3. Roles & Permissions

| Permission | Surveillant | Teacher | Student |
|---|:---:|:---:|:---:|
| Create/manage students | ✅ | ❌ | ❌ |
| Create/manage teachers | ✅ | ❌ | ❌ |
| Validate teacher accounts | ✅ | ❌ | ❌ |
| Manage academic years & periods | ✅ | ❌ | ❌ |
| Manage classes & subjects | ✅ | ❌ | ❌ |
| Create courses & upload materials | ❌ | ✅ | ❌ |
| Assign grades | ❌ | ✅ | ❌ |
| View own grades & materials | ❌ | ❌ | ✅ |
| Mark attendance (scan QR) | ✅ | ❌ | ❌ |
| View attendance reports | ✅ | ✅ (own courses) | ✅ (own) |
| Receive absence alerts | ✅ | ❌ | ❌ |

---

## 4. Database Schema

```mermaid
erDiagram

  %% ─── USERS & ROLES ───────────────────────────────────────────

  User {
    uuid      id         PK
    string    email      UK
    string    password_hash
    enum      role       "SURVEILLANT | TEACHER | STUDENT"
    enum      status     "PENDING | ACTIVE | SUSPENDED"
    timestamp created_at
    timestamp updated_at
  }

  %% ─── SCHOOL STRUCTURE ────────────────────────────────────────

  AcademicYear {
    uuid      id           PK
    string    label        "e.g. 2024-2025"
    enum      period_type  "BIMESTER | TRIMESTER"
    int       period_count "2 or 3 computed from period_type"
    date      start_date
    date      end_date
    bool      is_active
  }

  Period {
    uuid      id              PK
    uuid      academic_year_id FK
    int       number          "1..5 (bimester) or 1..3 (trimester)"
    string    label           "e.g. Bimestre 1"
    date      start_date
    date      end_date
  }

  Class {
    uuid      id           PK
    string    name         "e.g. Terminale A"
    string    level        "e.g. Première"
    uuid      academic_year_id FK
  }

  Subject {
    uuid      id           PK
    string    name         "e.g. Mathématiques"
    int       coefficient  "1..5+"
  }

  ClassSubject {
    uuid      id         PK
    uuid      class_id   FK
    uuid      subject_id FK
  }

  %% ─── TEACHER ─────────────────────────────────────────────────

  Teacher {
    uuid      id             PK
    uuid      user_id        FK
    string    first_name
    string    last_name
    string    phone
    timestamp validated_at   "null = pending"
    uuid      validated_by   FK "Surveillant user_id"
  }

  TeacherClassSubject {
    uuid      id           PK
    uuid      teacher_id   FK
    uuid      class_id     FK
    uuid      subject_id   FK
    uuid      academic_year_id FK
  }

  %% ─── STUDENT ─────────────────────────────────────────────────

  Student {
    uuid      id           PK
    uuid      user_id      FK
    string    first_name
    string    last_name
    string    student_code UK  "Used to generate QR"
    date      birth_date
    uuid      class_id     FK
    uuid      academic_year_id FK
  }

  %% ─── COURSES & MATERIALS ─────────────────────────────────────

  Course {
    uuid      id             PK
    uuid      teacher_class_subject_id FK
    uuid      period_id      FK
    string    title
    text      description
    timestamp created_at
  }

  CourseMaterial {
    uuid      id          PK
    uuid      course_id   FK
    string    file_name
    string    file_path   "Relative path in /uploads"
    string    mime_type
    int       file_size
    timestamp uploaded_at
  }

  %% ─── GRADES ──────────────────────────────────────────────────

  Grade {
    uuid      id           PK
    uuid      student_id   FK
    uuid      teacher_class_subject_id FK
    uuid      period_id    FK
    decimal   score        "0.00 – 20.00"
    text      comment
    timestamp graded_at
  }

  %% ─── ATTENDANCE ──────────────────────────────────────────────

  AttendanceSession {
    uuid      id           PK
    uuid      class_id     FK
    uuid      period_id    FK
    date      date
    enum      slot         "MORNING | AFTERNOON"
    uuid      recorded_by  FK "Surveillant user_id"
    timestamp created_at
  }

  AttendanceRecord {
    uuid      id                    PK
    uuid      attendance_session_id FK
    uuid      student_id            FK
    enum      status                "PRESENT | ABSENT | LATE"
    timestamp scanned_at
  }

  AbsenceAlert {
    uuid      id                    PK
    uuid      student_id            FK
    uuid      attendance_session_id FK
    bool      acknowledged
    timestamp sent_at
  }

  %% ─── RELATIONSHIPS ───────────────────────────────────────────

  AcademicYear     ||--o{ Period              : "has"
  AcademicYear     ||--o{ Class               : "has"
  AcademicYear     ||--o{ TeacherClassSubject  : "scoped to"
  AcademicYear     ||--o{ Student              : "enrolled in"

  Class            ||--o{ ClassSubject         : "has"
  Class            ||--o{ Student              : "has"
  Class            ||--o{ AttendanceSession     : "has"

  Subject          ||--o{ ClassSubject         : "in"
  Subject          ||--o{ TeacherClassSubject  : "taught via"

  User             ||--o| Teacher              : "is"
  User             ||--o| Student              : "is"

  Teacher          ||--o{ TeacherClassSubject  : "assigned to"
  TeacherClassSubject ||--o{ Course            : "has"
  TeacherClassSubject ||--o{ Grade             : "has"

  Course           ||--o{ CourseMaterial       : "has"

  Period           ||--o{ Course               : "scoped to"
  Period           ||--o{ Grade                : "scoped to"
  Period           ||--o{ AttendanceSession     : "scoped to"

  Student          ||--o{ Grade                : "receives"
  Student          ||--o{ AttendanceRecord      : "has"
  Student          ||--o| AbsenceAlert          : "triggers"

  AttendanceSession ||--o{ AttendanceRecord    : "contains"
  AttendanceRecord  ||--o| AbsenceAlert        : "triggers"
```

---

## 5. Authentication & Onboarding Flow

### 5.1 Surveillant
- Created via a **seed script**
- Always `ACTIVE` from creation.

### 5.2 Teacher
1. Teacher registers via `/register` (email + password + personal info).
2. Account is created with `status = PENDING`.
3. Surveillant sees pending teachers in the dashboard and **validates** or **rejects**.
4. On validation: `status → ACTIVE`, `validated_at` and `validated_by` are set.
5. Teacher can now log in.

### 5.3 Student
- Students are **created by the Surveillant** (no self-registration).
- A `student_code` is auto-generated (e.g., `STU-2025-00042`) and used as the QR code payload.
- A default password is set and must be changed on first login.

---

## 6. Screens & Navigation

### 6.1 Shared Screens

#### `/login`
- Email + password form
- Error state for pending/suspended accounts ("Your account is awaiting validation")

#### `/profile`
- Edit own password
- View own info (read-only for teachers/students)

---

### 6.2 Surveillant Screens (`/dashboard/surveillant/...`)

#### `/dashboard` — Overview
- Stats cards: total students, teachers, today's absences, pending validations
- Quick-access links

#### `/teachers` — Teacher List
- Table: name, email, subjects assigned, status badge (Pending / Active / Suspended)
- Actions: Validate, Suspend, View detail
- Button: *(no invite needed — teachers self-register)*

#### `/teachers/[id]` — Teacher Detail
- Info panel + validation history
- Assigned classes/subjects
- Action: Validate / Suspend

#### `/students` — Student List
- Filter by class, academic year
- Table: code, name, class, status
- Button: **+ New Student**

#### `/students/new` — Create Student
- Form: first name, last name, birth date, class, generate student code
- Auto-generates QR on save

#### `/students/[id]` — Student Detail
- Info + QR code display (downloadable/printable)
- Attendance summary
- Grade summary (read-only)
- Action: Edit, Suspend

#### `/classes` — Class Management
- List of classes per academic year
- Create / Edit / Archive class
- Assign subjects + teachers per class

#### `/subjects` — Subject Management
- List: name, coefficient
- Create / Edit subject

#### `/academic-years` — Academic Year Management
- List of years (only one active at a time)
- Create year: label, period type (Bimester / Trimester), start/end dates
- Periods auto-generated on creation, editable

#### `/attendance` — Attendance Management
- Date picker + class selector + slot (Morning / Afternoon)
- Start session → opens scanner view

#### `/attendance/scan` — QR Scan Session
- Camera-based QR scanner (full-screen)
- Each scan marks student as PRESENT
- Unscanned students at session close → marked ABSENT → alert triggered
- Live list of scanned students

#### `/attendance/[sessionId]` — Session Detail
- Full list: Present / Absent / Late
- Manual override (edit status)

#### `/attendance/reports` — Absence Reports
- Filter by class, period, date range
- Table: student, total absences, total lates
- Unread alerts badge

#### `/alerts` — Absence Alerts
- List of unacknowledged alerts
- Mark as acknowledged

---

### 6.3 Teacher Screens (`/dashboard/teacher/...`)

#### `/dashboard` — Overview
- My classes this year
- Recent courses
- Grades to fill (period in progress)

#### `/courses` — My Courses
- Filter by class/subject/period
- List of courses with material count
- Button: **+ New Course**

#### `/courses/new` — Create Course
- Form: title, description, class, subject, period
- File upload zone (PDF, PPTX, DOCX, etc.)

#### `/courses/[id]` — Course Detail
- Info + material list
- Download / Delete material
- Edit course info

#### `/grades` — Grade Entry
- Select: class → subject → period
- Table of students with score input (0–20) and comment
- Batch save

#### `/grades/[classId]/[subjectId]/[periodId]` — Grade Sheet
- Inline editable table
- Displays computed weighted score (score × coefficient)
- Save button

#### `/attendance/[classId]` — Attendance View
- Read-only view of sessions for own class/subject
- Filterable by date and slot

---

### 6.4 Student Screens (`/dashboard/student/...`)

#### `/dashboard` — Overview
- Current period, class name
- Grade summary cards per subject
- Upcoming / recent courses

#### `/grades` — My Grades
- Tabs per period
- Table: subject, coefficient, score (/20), weighted score, teacher comment
- Period average (weighted mean)

#### `/courses` — Course Materials
- Filter by subject
- List of courses with downloadable materials

#### `/courses/[id]` — Course Detail
- Description + file list (download only)

#### `/attendance` — My Attendance
- Calendar or table view
- Color-coded: Present (green), Absent (red), Late (orange)
- Period summary: X absences, Y lates

#### `/qr-code` — My Badge
- Displays own QR code
- Downloadable as PNG for printing

---

## 7. QR Attendance Flow (Detailed)

```
Surveillant opens /attendance
  → Selects class + date + slot (MORNING or AFTERNOON)
  → Clicks "Start Session"
    → AttendanceSession created in DB

/attendance/scan opens
  → Camera activates (html5-qrcode)
  → Student badge scanned → QR payload = student_code
    → POST /api/attendance/scan { sessionId, studentCode }
      → Validates student belongs to class
      → Creates AttendanceRecord { status: PRESENT }
      → Returns student name for confirmation toast

Surveillant clicks "Close Session"
  → All students in class WITHOUT an AttendanceRecord get:
      → AttendanceRecord { status: ABSENT }
      → AbsenceAlert created
      → Alert appears in /alerts dashboard
```

---

## 8. Grading System

- Scores entered on a **/20** scale.
- Each subject has a `coefficient` (e.g., Math = 4 → effectively /80 when computing averages).
- **Period average** formula:

```
period_avg = Σ(score_i × coefficient_i) / Σ(coefficient_i)
```

- **Annual average** = mean of period averages (each period weighted equally).
- Period type (Bimester = 5 periods / Trimester = 3 periods) affects how many grade rows are expected per student per subject per year.

---

## 9. File Upload

- Files stored under `/uploads/courses/[courseId]/[filename]`.
- Served via a Next.js API route `/api/files/[...path]` with auth check (student must be enrolled in the class).
- Max file size: **50 MB** per file.
- Accepted types: PDF, DOCX, PPTX, XLSX, images.
- **StorageService** interface:

```typescript
interface StorageService {
  save(file: Buffer, path: string, mimeType: string): Promise<string>
  delete(path: string): Promise<void>
  getReadStream(path: string): Promise<ReadableStream>
}
```
Swap `LocalStorageService` for `RustFSStorageService` (S3 SDK) later with zero app-layer changes.

---

## 10. Report Card

### 10.1 Overview

A per-student, per-period PDF report card generated server-side using **`@react-pdf/renderer`**. All three roles can trigger generation, scoped to their access level. The report card is only available once **all grades for that period and class have been entered** (i.e., every student in the class has a grade for every subject).

### 10.2 Content

| Section | Details |
|---|---|
| Header | School name, academic year label, period label, student name & code, class name |
| Grade table | Subject · Coefficient · Score (/20) · Weighted score · Teacher comment |
| Period average | `Σ(score × coeff) / Σ(coeff)` displayed as X/20 |
| Class rank | Dense rank among all students of the same class and period based on period average. Ties share the same rank (e.g., two students at rank 2 → next rank is 3, not 4) |
| Attendance summary | Number of missed class |
| Footer | Generated date, surveillant name/signature placeholder |

### 10.3 Class Rank Computation

```sql
-- Computed at report card generation time (not stored)
SELECT
  student_id,
  DENSE_RANK() OVER (
    PARTITION BY class_id, period_id
    ORDER BY period_average DESC
  ) AS class_rank
FROM student_period_averages
WHERE class_id = :classId AND period_id = :periodId;
```

Rank is **not persisted** in the database — it is computed on-the-fly at PDF generation time to always reflect the latest grade state.

### 10.4 Access Rules

| Role | Scope |
|---|---|
| Student | Own report card only |
| Teacher | Any student in a class they are assigned to |
| Surveillant | Any student, any class |

### 10.5 Generation Flow

```
User clicks "Download Report Card" (student/period selected)
  → GET /api/report-card?studentId=&periodId=
    → Auth check (role-based scope validation)
    → Check all grades are filled for this class & period
        → If incomplete: 400 { message: "Grades not fully entered for this period" }
    → Fetch: student info, class, grades + comments, period average, class rank
    → Render <ReportCardDocument /> with @react-pdf/renderer
    → Stream PDF response with headers:
        Content-Type: application/pdf
        Content-Disposition: attachment; filename="bulletin_[studentCode]_[period].pdf"
```

### 10.6 New Screens

#### Surveillant & Teacher: `/dashboard/[role]/report-cards`
- Select class → select period → table of students
- Each row: student name, period average, class rank, **Download PDF** button
- Batch download button: "Download all PDFs for this class & period" (ZIP via `jszip`)

#### Student: `/dashboard/student/report-cards`
- List of available periods (only periods where all grades are filled)
- Each row: period label, period average, class rank, **Download PDF** button

### 10.7 Report Card PDF Layout (React PDF Components)

```
<Page size="A4">
  <SchoolHeader />          ← School name, year, period
  <StudentInfo />           ← Name, code, class
  <GradeTable />            ← Subject | Coeff | Score | Weighted | Comment
  <SummaryRow />            ← Period average + Class rank
  <Footer />                ← Generated date + signature line
</Page>
```

### 10.8 Stack Addition

| Addition | Purpose |
|---|---|
| `@react-pdf/renderer` | Server-side PDF generation from React components |
| `jszip` | Batch ZIP download of multiple PDFs |

---

## 11. API Routes Summary

| Method | Route | Role | Description |
|---|---|---|---|
| POST | `/api/auth/[...nextauth]` | All | NextAuth handler |
| GET | `/api/students` | Surveillant | List students |
| POST | `/api/students` | Surveillant | Create student |
| GET | `/api/students/[id]` | Surveillant | Get student detail |
| PATCH | `/api/students/[id]` | Surveillant | Update student |
| GET | `/api/teachers` | Surveillant | List teachers |
| PATCH | `/api/teachers/[id]/validate` | Surveillant | Validate teacher |
| GET | `/api/classes` | All | List classes |
| POST | `/api/classes` | Surveillant | Create class |
| GET | `/api/subjects` | All | List subjects |
| POST | `/api/subjects` | Surveillant | Create subject |
| GET | `/api/academic-years` | All | List years |
| POST | `/api/academic-years` | Surveillant | Create year + periods |
| GET | `/api/courses` | Teacher, Student | List courses |
| POST | `/api/courses` | Teacher | Create course |
| POST | `/api/courses/[id]/materials` | Teacher | Upload file |
| DELETE | `/api/courses/[id]/materials/[mid]` | Teacher | Delete file |
| GET | `/api/files/[...path]` | Auth | Serve protected file |
| GET | `/api/grades` | Teacher, Student | Get grades |
| POST | `/api/grades` | Teacher | Save grade batch |
| POST | `/api/attendance/sessions` | Surveillant | Start session |
| POST | `/api/attendance/scan` | Surveillant | Record scan |
| PATCH | `/api/attendance/sessions/[id]/close` | Surveillant | Close session |
| GET | `/api/attendance/reports` | Surveillant, Teacher | Get report |
| GET | `/api/alerts` | Surveillant | List alerts |
| PATCH | `/api/alerts/[id]/ack` | Surveillant | Acknowledge alert |

---

## 11. Project Structure

```
/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── surveillant/
│   │   │   ├── page.tsx
│   │   │   ├── teachers/
│   │   │   ├── students/
│   │   │   ├── classes/
│   │   │   ├── subjects/
│   │   │   ├── academic-years/
│   │   │   ├── attendance/
│   │   │   └── alerts/
│   │   ├── teacher/
│   │   │   ├── page.tsx
│   │   │   ├── courses/
│   │   │   └── grades/
│   │   └── student/
│   │       ├── page.tsx
│   │       ├── grades/
│   │       ├── courses/
│   │       ├── attendance/
│   │       └── qr-code/
│   └── api/
│       ├── auth/
│       ├── students/
│       ├── teachers/
│       ├── classes/
│       ├── subjects/
│       ├── academic-years/
│       ├── courses/
│       ├── grades/
│       ├── attendance/
│       ├── alerts/
│       └── files/
├── components/
│   ├── ui/          # shadcn/ui components
│   ├── attendance/  # QR scanner, session table
│   ├── grades/      # Grade sheet, period tabs
│   └── courses/     # File uploader, material list
├── lib/
│   ├── auth.ts      # NextAuth config
│   ├── prisma.ts    # Prisma client singleton
│   ├── storage/
│   │   ├── interface.ts
│   │   ├── local.ts
│   │   └── rustfs.ts  # Future
│   └── utils/
│       ├── grades.ts  # Average computation + dense rank
│       └── qr.ts      # QR generation helpers
├── pdf/
│   ├── ReportCardDocument.tsx   # @react-pdf/renderer root
│   ├── SchoolHeader.tsx
│   ├── StudentInfo.tsx
│   ├── GradeTable.tsx
│   ├── SummaryRow.tsx
│   └── Footer.tsx
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── uploads/           # Local file storage (gitignored)
├── .env.local
├── docker-compose.yml
└── nginx.conf
```

---

## 12. Docker Compose (Outline)

```yaml
services:
  app:
    build: .
    environment:
      - DATABASE_URL=postgresql://...
      - NEXTAUTH_SECRET=...
      - NEXTAUTH_URL=https://school.example.mg
      - UPLOAD_DIR=/uploads
    volumes:
      - uploads_data:/uploads
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    volumes:
      - pg_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=school
      - POSTGRES_USER=school
      - POSTGRES_PASSWORD=...

volumes:
  pg_data:
  uploads_data:
```

---

## 13. Key Design Decisions & Notes

- **No parent/guardian role in v1.** Absence alerts are internal to the surveillant dashboard only.
- **Report cards are gate-kept by grade completeness.** A PDF cannot be generated until every subject grade is filled for every student in the class for that period — prevents partial bulletins.
- **Class rank is computed at generation time, never stored.** This avoids stale ranks if a teacher edits a grade after initial entry. The `DENSE_RANK()` window function in PostgreSQL handles ties natively.
- **Batch PDF download** uses `jszip` to bundle individual PDFs server-side and stream a single `.zip` file — useful for the surveillant printing all bulletins at once.
- **Period type is per academic year.** Switching from trimester to bimester the next year is fully supported; historical data is unaffected.
- **Bimester = 5 two-month periods, Trimester = 3 periods (~3.33 months each).** Period boundaries stored explicitly so the UI can label them correctly.
- **QR payload is `student_code` only** (not a signed JWT) — validation happens server-side. For a kiosk deployment, the scan route should be IP-restricted or use a short-lived session token.
- **Teacher self-registration** reduces admin burden; the surveillant only needs to validate, not manually enter teacher data.
- **StorageService abstraction** enables a future RustFS/S3 migration with a single dependency swap.
