# PortfolioOS — Semester III AI Tools Demonstration Script

This document provides a step-by-step walkthrough to demonstrate all technical requirements, UI interactions, AI evidence grounding, and dual-resume generation for the Semester III AI Tools & Prompt Engineering assignment.

---

## Prerequisites & Startup

1. **Navigate to the project root:**
   ```bash
   cd portfolio-os
   ```

2. **Verify installation & build:**
   ```bash
   npm run build
   npm run test
   ```
   *(All 12 automated unit and integration tests should pass)*

3. **Start the application (Server + Client):**
   ```bash
   npm run dev
   ```
   - **Backend API:** `http://localhost:4000`
   - **Frontend UI:** `http://localhost:5173`

4. Open `http://localhost:5173` in a modern browser (Google Chrome, Safari, or Arc recommended).

---

## Step 1: System Inspection & Seeding

1. **Arrive at Overview (`/`):**
   - Note the Apple-inspired liquid glass dark spatial theme, subtle background depth glows, and hardware-accelerated translucent panels.
   - Look at the top right of the Overview page and click **"Seed Demo Portfolio"** (or go to Settings -> "Seed Complete Fictional Demo Data").
   - A success notification will appear.
2. **Observe the Overview Dashboard:**
   - Skills count updates to ~24 categorized skills.
   - Projects count updates to 4 projects.
   - Experience updates to 2 entries (Vanguard Tech Labs & Applied AI Research Lab).
   - Active Resumes shows two pre-synthesized dual-tailored resumes.

---

## Step 2: Explore the Portfolio Database (`My Portfolio`)

1. Click **"My Portfolio"** in the floating navigation rail.
2. **Browse Tabs:**
   - **Profile:** Alex Morgan, AI & Full-Stack Engineering student, contact details, links, summary.
   - **Skills:** Categorized into Languages, Frameworks, Databases & Cloud, Tools, Core Concepts, Soft Skills with proficiency levels.
   - **Projects:**
     - *PulseUI: Spatial Component System* (React, TypeScript, Tailwind CSS).
     - *NeuroVision: Real-Time Edge Object Detection* (Python, PyTorch, Docker, INT8).
     - *DocuSphere: Distributed Vector Retrieval RAG Engine* (Python, FastAPI, Redis, Vector embeddings).
     - *FinTrack: Financial Analytics PWA* (JavaScript, React, SQLite).
   - **Experience:** Full-Stack Intern at Vanguard Tech Labs & Research Assistant at Applied AI Lab.
   - **Education:** B.S. in Computer Science & AI (GPA: 3.92, CalTech).
   - **Certifications:** Meta Front-End Developer & DeepLearning.AI Specialization.
3. **Test CRUD:** Click **"Add Skill"**, enter a test skill (e.g., "GraphQL", "Tools & DevOps", "Intermediate"), and save. Then edit or delete it.
4. **Test JSON Export:** Click **"Export JSON"** in the top header to download `portfolio_backup.json`.

---

## Step 3: Job Matcher — AI Requirement & Evidence Extraction

1. Click **"Job Matcher"** in the navigation rail.
2. **Demonstration A — Frontend Developer Role:**
   - Click the preset button **"Preset 1: Frontend Intern"**.
   - Review the preloaded Job Description from Vanguard Digital Labs.
   - Click **"Run Evidence Matcher"**.
   - Notice the live overall match score (**~90-100%**).
   - Inspect the Requirement Cards:
     - *React & TypeScript:* Shows **Matched** with cited evidence from the `PulseUI` project, `Skill: React (Expert)`, and `Vanguard Tech Labs` internship.
     - *Tailwind CSS:* Shows **Matched** with cited evidence from `Skill: Tailwind CSS (Expert)`.
     - *Computer Science Degree:* Shows **Matched** with evidence from `CalTech Education`.
   - Inspect the **Suggested Role-Tailored Summary** highlighting frontend architecture.
3. **Demonstration B — AI / Machine Learning Role:**
   - Click the preset button **"Preset 2: AI/ML Intern"**.
   - Click **"Run Evidence Matcher"**.
   - Notice that the matching engine shifts context:
     - *PyTorch & Python:* Shows **Matched** with citations to `NeuroVision` and `University Applied AI Research Lab`.
     - *Quantization & Edge Vision:* Shows **Matched** citing `NeuroVision INT8 post-training quantization`.
     - *RAG & FastAPI:* Shows **Matched** citing `DocuSphere Vector Retrieval Engine`.
   - Note the completely different suggested professional summary tailored for ML research.

---

## Step 4: Resume Studio — The Signature Split-Screen Environment

1. Click **"Resume Studio"** in the navigation rail.
2. **Dual-Tailored Resumes from a Single Candidate Portfolio:**
   - Click **"Tailor Preset"** in the floating toolbar:
     - Select **"Frontend Developer Intern"**:
       - Notice the template automatically selects **"Modern Professional"** with clean ice-blue accent lines.
       - Selected projects prioritize `PulseUI: Spatial Component System` and `FinTrack`.
       - Selected skills emphasize `TypeScript`, `React`, `Next.js`, `Tailwind CSS`.
       - Section order emphasizes Work Experience and Projects.
     - Select **"AI / Machine Learning Intern"**:
       - Notice the template switches to **"Classic ATS"** (single column, high-legibility black & charcoal, conservative serif typography).
       - Selected projects prioritize `NeuroVision: Real-Time Edge Object Detection` and `DocuSphere RAG Engine`.
       - Selected skills prioritize `Python`, `PyTorch`, `TensorFlow`, `FastAPI`, `Docker`.
       - Selected awards emphasize `CalTech HackAI 2024 (1st Place Winner)`.
3. **Interactive WYSIWYG Adjustments:**
   - In the left panel, edit a bullet point under the active project. Observe the floating white paper preview on the right update instantly.
   - Reorder sections: Go to "Section Order", click the "Down" button on "Work Experience", and watch the section move below Projects in the live paper preview.
   - Toggle templates: Switch between **Modern** and **Classic ATS** via the toolbar pill buttons.
   - Adjust typography: Switch font family from **Sans-Serif** to **Serif**, change spacing from **Standard** to **Compact**, and pick an accent color.
4. **Real Vector PDF Download:**
   - Click the **"Download PDF"** button in the toolbar.
   - Your browser downloads a genuine, vector-rendered PDF document (e.g., `Alex_Morgan_Frontend_Developer_Intern_Resume.pdf`).
   - Open the downloaded PDF in Acrobat, Preview, or Chrome to verify:
     - Clean vector typography (crisp at any zoom level).
     - Standard US Letter margins and multi-page pagination ("Page 1 of 1" or "Page 1 of 2").
     - Exact fidelity to the preview.

---

## Step 5: Google Sheets Bi-Directional Integration

1. Click **"Google Sheets"** in the navigation rail.
2. Review the connection diagnostic status:
   - When credentials are not yet configured in `.env`, the UI clearly explains the setup required and displays the complete worksheet tabs schema (`Profile`, `Education`, `Skills`, `Projects`, `Experience`, `Certifications`, `Achievements`).
   - Click **"Export All Tabs to Sheets"**. If credentials or sheet ID are unconfigured, PortfolioOS records an explicit failure in the **Synchronization Audit Logs** table rather than faking success.
3. Review the **Audit Logs** table showing logged sync attempts, timestamps, and error diagnostics.

---

## Step 6: Settings, Diagnostics & Backup

1. Click **"Settings"** in the navigation rail.
2. Verify:
   - Google Gemini API status (Active or Fallback mode).
   - SQLite Relational Database health (WAL mode, table row counts).
3. Test **Download Complete JSON Backup** to verify full local data ownership.
