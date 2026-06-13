# School Management System Implementation Plan

This implementation plan details the steps required to build the Next.js 15, PostgreSQL, Prisma, NextAuth v5, and Tailwind CSS/shadcn-based School Management System according to the system specifications.

## User Review Required

> [!IMPORTANT]
> The database schema includes complex relationships between `Teacher`, `Class`, `Subject`, and `AcademicYear` via join tables. I've designed the models to be highly relational to ensure integrity.
>
> **Report Card PDF Generation Rules**: Ranks will be computed dynamically using a PostgreSQL query with `DENSE_RANK()` during generation to prevent stale data.

## Open Questions

> [!NOTE]
> None at the moment. We will initialize the Next.js app in the current directory and build it incrementally.

---

## Proposed Changes

### Phase 1: Initialization & Configurations

#### [NEW] [package.json](file:///home/mandrindra/Projects/masterclass-next/package.json)
Initialize Next.js 15, ESLint, TypeScript, and install dependencies.
- **Dependencies**: `next@15.0.3` (or latest stable), `react@19`, `react-dom@19`, `prisma`, `@prisma/client`, `next-auth@5.0.0-beta.x`, `qrcode`, `html5-qrcode`, `@react-pdf/renderer`, `jszip`, `lucide-react`, `bcryptjs`, `@types/bcryptjs`, etc.
- **Dev Dependencies**: `postcss`, `tailwindcss`, `typescript`, `@types/node`, `@types/react`, `@types/qrcode`

#### [NEW] [tsconfig.json](file:///home/mandrindra/Projects/masterclass-next/tsconfig.json)
Configure TypeScript options.

#### [NEW] [tailwind.config.ts](file:///home/mandrindra/Projects/masterclass-next/tailwind.config.ts) & [app/globals.css](file:///home/mandrindra/Projects/masterclass-next/app/globals.css)
Set up the design system, custom CSS variables for light/dark modes, and layout styles.

---

### Phase 2: Database Layer (Prisma & Postgres)

#### [NEW] [prisma/schema.prisma](file:///home/mandrindra/Projects/masterclass-next/prisma/schema.prisma)
Implement all relational tables:
- `User` (id, email, password_hash, role, status)
- `AcademicYear` & `Period` (1-to-many relationship)
- `Class` & `Subject` & `ClassSubject`
- `Teacher` & `TeacherClassSubject`
- `Student` (with student_code UK)
- `Course` & `CourseMaterial`
- `Grade` (with score decimal 0-20)
- `AttendanceSession`, `AttendanceRecord`, `AbsenceAlert`

#### [NEW] [prisma/seed.ts](file:///home/mandrindra/Projects/masterclass-next/prisma/seed.ts)
A seed script to create a default Surveillant user (e.g. `admin@school.mg`) so the system can be logged into upon first run.

---

### Phase 3: Authentication & Middleware (NextAuth.js v5)

#### [NEW] [lib/prisma.ts](file:///home/mandrindra/Projects/masterclass-next/lib/prisma.ts)
Prisma Client singleton instantiation.

#### [NEW] [auth.ts](file:///home/mandrindra/Projects/masterclass-next/auth.ts) & [lib/auth-config.ts](file:///home/mandrindra/Projects/masterclass-next/lib/auth-config.ts)
NextAuth v5 settings using Credentials provider. Validates email, password hash, status (must be `ACTIVE`), and inserts role/user info into the session token.

#### [NEW] [middleware.ts](file:///home/mandrindra/Projects/masterclass-next/middleware.ts)
Route guard logic mapping permissions to endpoints and page directories:
- `/dashboard/surveillant/*` requires `role == 'SURVEILLANT'`
- `/dashboard/teacher/*` requires `role == 'TEACHER'`
- `/dashboard/student/*` requires `role == 'STUDENT'`

---

### Phase 4: Core Services & Helpers

#### [NEW] [lib/storage/interface.ts](file:///home/mandrindra/Projects/masterclass-next/lib/storage/interface.ts)
Define `StorageService` interface.

#### [NEW] [lib/storage/local.ts](file:///home/mandrindra/Projects/masterclass-next/lib/storage/local.ts)
Implement local file storage operations under `/uploads`.

#### [NEW] [lib/utils/grades.ts](file:///home/mandrindra/Projects/masterclass-next/lib/utils/grades.ts)
Calculates averages and rankings:
- `period_avg = Σ(score * coeff) / Σ(coeff)`
- Annual average calculation
- Check completeness of grades for a class & period

#### [NEW] [lib/utils/qr.ts](file:///home/mandrindra/Projects/masterclass-next/lib/utils/qr.ts)
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

#### [NEW] [pdf/ReportCardDocument.tsx](file:///home/mandrindra/Projects/masterclass-next/pdf/ReportCardDocument.tsx)
Build standard A4 layout using `@react-pdf/renderer`:
- School Header
- Student info
- Grade details table
- Period average and rank summary
- Footer signature space

---

### Phase 8: Dockerization & Orchestration

#### [NEW] [Dockerfile](file:///home/mandrindra/Projects/masterclass-next/Dockerfile)
Multi-stage build for Next.js app.

#### [NEW] [docker-compose.yml](file:///home/mandrindra/Projects/masterclass-next/docker-compose.yml)
Define postgres service, application service, volumes and env vars.

#### [NEW] [nginx.conf](file:///home/mandrindra/Projects/masterclass-next/nginx.conf)
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
