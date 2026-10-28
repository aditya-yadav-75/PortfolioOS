# PortfolioOS 🌌
### AI-Powered Portfolio Database & Dynamic Resume Generator
> **Course / Academic Context:** Semester III AI Tools & Prompt Engineering Assignment  
> **Author / Student:** Full-Stack Software Engineering & Applied AI Portfolio  

---

## 🌟 Executive Summary

**PortfolioOS** is a spatial web operating system and career database designed to solve a fundamental problem in modern technical recruiting: **the friction between maintaining a single master portfolio and generating evidence-backed, highly customized resumes for distinct roles.**

Unlike generic AI resume builders that hallucinate skills or output cookie-cutter SaaS templates, PortfolioOS:
1. **Maintains a Grounded Relational Database (SQLite):** Strictly records verified candidate achievements, skills, projects, and work experience.
2. **Performs Evidence-Based Job Matching:** Utilizes Google Gemini 1.5 with strict prompt grounding (plus an automatic deterministic rule-based fallback) to classify requirements as **Matched**, **Partially Matched**, or **Not Evidenced**, complete with cited portfolio records and confidence rationale.
3. **Generates Dual Role-Tailored Resumes:** Proves that **one single candidate portfolio** can synthesize two distinct resumes—such as a **Frontend Developer Intern** and an **AI / Machine Learning Intern**—each emphasizing relevant evidence, custom bullet points, and distinct typographic templates (Classic ATS vs Modern Professional).
4. **Outputs Real Downloadable Vector PDFs:** Generates print-ready vector PDF files with precise margins, typography scales, page breaks, and clickable links.
5. **Bi-Directionally Integrates with Google Sheets:** Maps database records across dedicated worksheet tabs with stable Column-A UUIDs to prevent duplicate appends.

---

## 🎨 Apple-Inspired Spatial Design System

PortfolioOS is built on a custom Apple visionOS and macOS liquid glass design system:
- **Base Canvas:** Deep spatial dark mode (`#08090B` main background, `#101216` secondary background).
- **Glass Materials:** Hardware-accelerated CSS `backdrop-filter: blur(20px - 28px)` with subtle edge reflections and inset highlights.
- **Accents:** Restrained ice-blue glow (`#38BDF8`), emerald success indicators, and amber/rose status cues.
- **Floating Document Preview:** White and warm-white paper canvas with print-standard typography, cast against a spatial backdrop.
- **Quick Command Center:** Accessible at any time via `⌘K` or `Ctrl+K`.

---

## 📁 Project Architecture & Directory Structure

```
portfolio-os/
├── client/                     # Frontend Application (React 19, Vite, Tailwind CSS, Framer Motion)
│   ├── src/
│   │   ├── components/ui/      # GlassPanel, GlassNavigation, SpatialWorkspace, Modal, Toast
│   │   ├── features/
│   │   │   ├── dashboard/      # OverviewView analytics & quick actions
│   │   │   ├── portfolio/      # PortfolioView CRUD & RecordEditor
│   │   │   ├── job-matcher/    # JobMatcherView & JobRequirementItem
│   │   │   ├── resume-studio/  # ResumeStudioView, ResumePaper & ResumeToolbar
│   │   │   ├── integrations/   # GoogleSheetsView & SyncStatus
│   │   │   └── settings/       # SettingsView & system diagnostics
│   │   ├── lib/api.ts          # Typed REST client
│   │   ├── styles/             # index.css design tokens & liquid glass styles
│   │   ├── App.tsx             # Main layout & router coordination
│   │   └── main.tsx            # React bootstrap
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── server/                     # Backend API (Node.js, Express, TypeScript, SQLite)
│   ├── src/
│   │   ├── config/             # Environment configuration
│   │   ├── database/           # SQLite connection, schema migrator & seed script
│   │   ├── services/           # PortfolioService, GeminiService, ResumeService, PdfService, SheetsService
│   │   ├── controllers/        # REST controllers
│   │   ├── routes/             # Express API routes
│   │   ├── middleware/         # Zod validation & global error handlers
│   │   ├── app.ts              # Express application factory
│   │   └── index.ts            # Server entry point
│   ├── tests/                  # Automated Vitest test suite
│   ├── package.json
│   └── tsconfig.json
├── shared/                     # Shared TypeScript types & Zod schemas
│   ├── src/
│   │   ├── types/              # Portfolio, Resume, Job Analysis, Sheets interfaces
│   │   └── schemas/            # Zod validation schemas
│   └── tsconfig.json
├── docs/                       # Technical Documentation
│   ├── architecture.md         # Full system architecture specification
│   ├── database-schema.md      # Relational SQLite schema documentation
│   └── demo-script.md          # Step-by-step evaluator demonstration script
├── .env.example                # Environment variable template
├── .gitignore
├── package.json                # Root npm workspaces configuration
└── README.md
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 6, TypeScript 5, Tailwind CSS 3, Framer Motion 12, Lucide Icons |
| **Backend** | Node.js 24, Express 4, TypeScript 5, Better-SQLite3, PDFKit, Zod |
| **AI Integration** | Official Google Gemini SDK (`@google/generative-ai`), Gemini 1.5 Flash |
| **Cloud Integration** | Official Google APIs Client (`googleapis`), Google Sheets API v4 |
| **Testing** | Vitest 3, Supertest 7 |

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- **Node.js:** v18.0.0 or later (v20+ or v24 LTS recommended)
- **npm:** v9.0.0 or later

### 2. Installation
Clone or navigate to the project directory and install dependencies:
```bash
cd portfolio-os
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` in the project root:
```bash
cp .env.example .env
```

Configure your environment settings (optional for local testing; PortfolioOS operates smoothly with deterministic fallbacks when external API keys are omitted):
```env
PORT=4000
NODE_ENV=development
DATABASE_PATH=./portfolio_os.db
CLIENT_URL=http://localhost:5173

# Optional: Google Gemini API (Get from https://aistudio.google.com/)
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash

# Optional: Google Sheets Service Account
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=
GOOGLE_SPREADSHEET_ID=
```

### 4. Database Setup & Seeding
Run the automated seed command to populate the relational database with fictional, verified student candidate data:
```bash
npm run seed
```
*(This creates `Alex Morgan`—a Computer Science student with 4 projects, 20+ skills, 2 internships, 2 certifications, and hackathon honors)*

### 5. Running the Application
Start both the backend server and frontend client concurrently:
```bash
npm run dev
```

- **Client Application:** `http://localhost:5173`
- **Backend API:** `http://localhost:4000`
- **API Health Check:** `http://localhost:4000/api/health`

---

## 🧪 Testing & Verification

Run the full automated test suite verifying CRUD operations, schema constraints, evidence matching logic, PDF generation, and Google Sheets safety:
```bash
npm run test
```

### Build Verification
Compile all workspaces (shared, server, and client):
```bash
npm run build
```

---

## 🎯 Key Application Destinations

1. **Overview (`/`):** High-level metrics, active resume cards, system diagnostic indicators, and one-click demo tailoring.
2. **My Portfolio (`/portfolio`):** Complete management of Profile, Education, Skills, Projects, Experience, Certifications, and Achievements. Supports full JSON export and restore.
3. **Job Matcher (`/job-matcher`):**
   - 1-click presets for **Frontend Developer Intern** and **AI/ML Intern**.
   - Extracts skills, qualifications, and responsibilities.
   - Shows **Matched**, **Partially Matched**, and **Not Evidenced** status with explicit citations to portfolio records.
   - Generates non-hallucinatory professional summary suggestions.
4. **Resume Studio (`/resume-studio`):**
   - Split-screen WYSIWYG editing environment.
   - Live floating paper preview with Classic ATS and Modern Professional templates.
   - Reorder sections, customize bullet points, adjust font scale and margins.
   - **Real Vector PDF Download:** Generates clean, downloadable PDFs.
5. **Google Sheets (`/sheets`):**
   - Bi-directional sync status and configuration guide.
   - Separate worksheet tabs: Profile, Education, Skills, Projects, Experience, Certifications, Achievements.
   - Stable IDs in Column A prevent duplicate row appends.
   - Live audit logs recording timestamps, record counts, and API responses.
6. **Settings (`/settings`):** System status, Gemini engine check, demo data re-seeding, database reset, and complete JSON backups.

---

## 📄 Assignment Deliverables Checklist

- [x] **Source Code:** Full-stack TypeScript monorepo with clean separation of concerns.
- [x] **Database Schema:** SQLite schema with migrations, foreign keys, indexes, and documentation in `docs/database-schema.md`.
- [x] **Dual Tailored Resumes:** One portfolio produces two distinct resumes:
  1. *Frontend Developer Intern* (Modern Professional template, PulseUI, React/TypeScript focus).
  2. *AI/ML Intern* (Classic ATS template, NeuroVision, PyTorch/quantization focus).
- [x] **Downloadable PDF:** Server-side PDFKit vector generation with correct pagination and margins.
- [x] **Google Sheets Integration:** Official `googleapis` implementation with tab schemas and error logging.
- [x] **Walkthrough Script:** Step-by-step evaluator demonstration script in `docs/demo-script.md`.
- [x] **System Architecture:** Detailed architecture documentation in `docs/architecture.md`.

---

## 🛡️ Security & Privacy Notice

- All secrets and API keys remain strictly on the backend and are never sent to the client browser.
- SQLite queries use parameterized statements to prevent SQL injection.
- Request payloads are validated at runtime via Zod schemas.
- External API calls (Gemini and Google Sheets) gracefully handle rate limits, network timeouts, and missing credentials with friendly user diagnostics.
