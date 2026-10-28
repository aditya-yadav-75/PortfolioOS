# Submission Screenshots Guide

This directory holds the required high-resolution visual evidence for the Semester III AI Tools assignment submission.

> **Integrity Notice:** To maintain academic integrity, screenshots are not fabricated. Capture live screenshots from your running browser session at `http://localhost:5173` using macOS screenshot shortcuts (`Cmd+Shift+4` or Chrome DevTools "Capture full size screenshot").

---

## Required Screenshot Checklist

| Filename | View / Destination | Key Elements to Capture |
| :--- | :--- | :--- |
| `01-overview-dashboard.png` | **Overview** (`/`) | Spatial dark canvas, metric cards (Skills: 24, Projects: 4, Experience: 2), active resume cards, engine health indicators. |
| `02-portfolio-database.png` | **My Portfolio** (`/portfolio`) | Tabs bar (Profile, Skills, Projects, Experience, Education, Certs), projects list showing PulseUI and NeuroVision tags, and the Export JSON button. |
| `03-job-matcher-frontend.png` | **Job Matcher** (`/job-matcher`) | Preset 1 loaded (Frontend Intern), overall match score (~90-100%), requirement evidence cards with cited projects and skills. |
| `04-job-matcher-aiml.png` | **Job Matcher** (`/job-matcher`) | Preset 2 loaded (AI/ML Intern), match score, cited PyTorch / NeuroVision / CalTech HackAI evidence citations. |
| `05-resume-studio-split-screen.png` | **Resume Studio** (`/resume-studio`) | Split-screen workspace showing left control inspector (skills/projects toggles, summary) and right floating paper preview (Modern Professional template). |
| `06-resume-studio-ats-template.png` | **Resume Studio** (`/resume-studio`) | Live floating paper preview rendered in **Classic ATS** template mode (clean single column, serif headings, high machine readability). |
| `07-google-sheets-integration.png` | **Google Sheets** (`/sheets`) | Connection overview, worksheet tabs list (`Profile`, `Skills`, `Projects`, etc.), column-A stable ID notice, and sync audit logs. |
| `08-settings-diagnostics.png` | **Settings** (`/settings`) | Engine diagnostics, SQLite status (WAL mode, path), Seed Complete Demo Data button, and full JSON backup options. |

---

## Capture Procedure

1. Launch PortfolioOS:
   ```bash
   cd portfolio-os
   npm run seed
   npm run dev
   ```
2. Open `http://localhost:5173` in your browser at 100% zoom (1920x1080 or standard Retina viewport).
3. Follow the demonstration steps outlined in [`docs/demo-script.md`](../../docs/demo-script.md).
4. Save the captured `.png` files directly into this directory (`submission/screenshots/`).
