# School Management System Implementation Plan

This implementation plan details the steps required to build the Next.js 15, PostgreSQL, Prisma, NextAuth v5, and Tailwind CSS/shadcn-based School Management System according to the system specifications.

> **Report Card PDF Generation Rules**: Ranks will be computed dynamically using a PostgreSQL query with `DENSE_RANK()` during generation to prevent stale data.
---

## Proposed Changes

### Phase 1: Initialization & Configurations
Initialize Next.js 15, ESLint, TypeScript, and install dependencies.
- **Dependencies**: `next@15.0.3` (or latest stable), `react@19`, `react-dom@19`, `prisma`, `@prisma/client`, `next-auth@5.0.0-beta.x`, `qrcode`, `html5-qrcode`, `@react-pdf/renderer`, `jszip`, `lucide-react`, `bcryptjs`, `@types/bcryptjs`, etc.
- **Dev Dependencies**: `postcss`, `tailwindcss`, `typescript`, `@types/node`, `@types/react`, `@types/qrcode`
Configure TypeScript options.

Set up the design system, custom CSS variables for light/dark modes, and layout styles.

---

### Phase 2: Database Layer (Prisma & Postgres)
Implement all relational tables:
- `User` (id, email, password_hash, role, status)
- `AcademicYear` & `Period` (1-to-many relationship)
- `Class` & `Subject` & `ClassSubject`
- `Teacher` & `TeacherClassSubject`
- `Student` (with student_code UK)
- `Course` & `CourseMaterial`
- `Grade` (with score decimal 0-20)
- `AttendanceSession`, `AttendanceRecord`, `AbsenceAlert`

A seed script to create a default Surveillant user (e.g. `admin@school.mg`) so the system can be logged into upon first run.

---

### Phase 3: Authentication & Middleware (NextAuth.js v5)

Prisma Client singleton instantiation.
NextAuth v5 settings using Credentials provider. Validates email, password hash, status (must be `ACTIVE`), and inserts role/user info into the session token.
Route guard logic mapping permissions to endpoints and page directories:
- `/dashboard/surveillant/*` requires `role == 'SURVEILLANT'`
- `/dashboard/teacher/*` requires `role == 'TEACHER'`
- `/dashboard/student/*` requires `role == 'STUDENT'`

---

### Phase 4: Core Services & Helpers

Define `StorageService` interface.

Implement local file storage operations under `/uploads`.

Calculates averages and rankings:
- `period_avg = Σ(score * coeff) / Σ(coeff)`
- Annual average calculation
- Check completeness of grades for a class & period
QR code generation helpers.

---

### Phase 5: API Endpoints (`app/api/*`)

Develop the list of standard CRUD and transaction routes:
- `/api/auth/[...nextauth]/route.ts` - NextAuth router
- `/api/students/` & `/api/teachers/`
- `/api/classes/` & `/api/subjects/` & `/api/academic-years/`
- `/api/courses/` & `/api/courses/[id]/materials/`
- `/api/grades/` - Bulk save and fetch
- `/api/attendance/sessions` & `/api/attendance/scan`
- `/api/alerts/` & `/api/files/[...path]/route.ts` (protected download)
- `/api/report-card/route.ts` (calculates averages, rank, and streams report card PDF or zipped reports)

---

### Phase 6: Pages & Views

Configure pages and directories for layout templates:
- **Shared**: `/login`, `/profile`, components.
- **Surveillant**:
  - `/dashboard/surveillant` (Overview stats cards)
  - `/dashboard/surveillant/teachers` (List, validation actions)
  - `/dashboard/surveillant/students` (List, new student creation, view student QR)
  - `/dashboard/surveillant/classes` & `/dashboard/surveillant/subjects`
  - `/dashboard/surveillant/academic-years`
  - `/dashboard/surveillant/attendance` (Create sessions, scan camera using `html5-qrcode`, session lists)
  - `/dashboard/surveillant/alerts`
  - `/dashboard/surveillant/report-cards` (Filter class/period, download list/ZIP)
- **Teacher**:
  - `/dashboard/teacher` (Summary)
  - `/dashboard/teacher/courses` (Manage course materials)
  - `/dashboard/teacher/grades` (Matrix entry sheet, automatic weighted average calculation)
  - `/dashboard/teacher/report-cards`
- **Student**:
  - `/dashboard/student` (Summary status)
  - `/dashboard/student/grades` (Scores, coefficients, weighted average)
  - `/dashboard/student/courses` (Download materials)
  - `/dashboard/student/attendance` (Color-coded history)
  - `/dashboard/student/qr-code` (My badge)
  - `/dashboard/student/report-cards` (Download PDF)

---

### Phase 7: PDF Report Card Styling & Document Configuration

Build standard A4 layout using `@react-pdf/renderer`:
- School Header
- Student info
- Grade details table
- Period average and rank summary
- Footer signature space

---

### Phase 8: Dockerization & Orchestration

Multi-stage build for Next.js app.

Define postgres service, application service, volumes and env vars.

Simple reverse proxy config.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify standard type check and compilation.
- Prisma schema validation via `npx prisma validate`.
- Lint checks: `npm run lint`.

### Manual Verification
- Verify role restrictions via middleware by accessing other dashboard paths.
- Simulate teacher sign up and surveillant validation.
- Create class, subject, assign teacher, add student, print/view QR.
- Verify attendance scanner workflow and absence alerts.
- Check grade entry system, weighted averages, and generation of PDF report cards.
- Verify ZIP compression for batch downloads.
