# Submission Resumes Artifacts

This folder stores the two real downloadable PDF resumes generated from **PortfolioOS** for the Semester III assignment submission.

> **Integrity Notice:** As required by academic and prompt engineering guidelines, these files are not pre-fabricated or mock-generated. They must be downloaded directly from the live running application to reflect real vector PDF generation.

---

## Required Artifacts

### 1. `Alex_Morgan_Frontend_Developer_Intern_Resume.pdf`
- **Target Position:** Frontend Developer Intern (Vanguard Digital Labs)
- **Template Style:** Modern Professional (refined left-aligned header, ice-blue accent bar, balanced spacing)
- **Evidence Focus:**
  - Lead projects: *PulseUI: Spatial Component System* and *FinTrack: Financial Analytics PWA*.
  - Work Experience: *Full-Stack Engineering Intern at Vanguard Tech Labs*.
  - Key Skills: *TypeScript, JavaScript, React, Next.js, Tailwind CSS, Vite & Webpack*.
  - Certification: *Meta Front-End Developer Professional Certificate*.

### 2. `Alex_Morgan_AIML_Intern_Resume.pdf`
- **Target Position:** AI / Machine Learning Research Intern (DeepScale Applied Intelligence)
- **Template Style:** Classic ATS (single column, conservative serif typography, high machine readability)
- **Evidence Focus:**
  - Lead projects: *NeuroVision: Real-Time Edge Object Detection* and *DocuSphere: Distributed Vector Retrieval RAG Engine*.
  - Work Experience: *Undergraduate Research Assistant at University Applied AI Research Lab*.
  - Key Skills: *Python, PyTorch, TensorFlow, FastAPI, Docker, Model Evaluation & Optimization*.
  - Award: *1st Place Grand Prize Winner — CalTech HackAI 2024*.
  - Certification & Paper: *DeepLearning.AI Specialization* and *Efficient Quantization Techniques for Edge Neural Networks*.

---

## How to Export and Save These Artifacts

1. Start PortfolioOS:
   ```bash
   cd portfolio-os
   npm run seed    # Populates portfolio records & dual tailored presets
   npm run dev     # Launches Server on :4000 and Client on :5173
   ```
2. Open `http://localhost:5173` in your browser.
3. Navigate to **Resume Studio**:
   - To export the Frontend resume:
     - Select **Tailor Preset -> Frontend Developer Intern** (or choose it from Overview).
     - Click **"Download PDF"** in the top toolbar.
     - Move the downloaded file into this directory: `submission/resumes/Alex_Morgan_Frontend_Developer_Intern_Resume.pdf`.
   - To export the AI/ML resume:
     - Select **Tailor Preset -> AI / Machine Learning Intern**.
     - Click **"Download PDF"** in the top toolbar.
     - Move the downloaded file into this directory: `submission/resumes/Alex_Morgan_AIML_Intern_Resume.pdf`.

4. Alternatively, download directly from the backend API:
   ```bash
   # Retrieve resume ID list
   curl -s http://localhost:4000/api/resumes | jq
   # Download PDF directly by ID
   curl -s -o submission/resumes/Alex_Morgan_Frontend_Developer_Intern_Resume.pdf http://localhost:4000/api/resumes/<FRONTEND_RESUME_ID>/pdf
   curl -s -o submission/resumes/Alex_Morgan_AIML_Intern_Resume.pdf http://localhost:4000/api/resumes/<AIML_RESUME_ID>/pdf
   ```
