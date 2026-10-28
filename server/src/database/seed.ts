import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from './connection';
import { runMigrations } from './migrator';
import { PortfolioService } from '../services/portfolio.service';
import { ResumeService } from '../services/resume.service';

export function seedDatabase(dbPath?: string): void {
  const db = getDatabase(dbPath);
  runMigrations(dbPath);

  console.log('Seeding fictional development portfolio data...');

  // Clear existing demo data to prevent duplicates
  db.prepare('DELETE FROM resume_sections').run();
  db.prepare('DELETE FROM resume_documents').run();
  db.prepare('DELETE FROM job_analyses').run();
  db.prepare('DELETE FROM project_skills').run();
  db.prepare('DELETE FROM projects').run();
  db.prepare('DELETE FROM experiences').run();
  db.prepare('DELETE FROM education').run();
  db.prepare('DELETE FROM skills').run();
  db.prepare('DELETE FROM certifications').run();
  db.prepare('DELETE FROM achievements').run();
  db.prepare('DELETE FROM publications').run();
  db.prepare('DELETE FROM languages').run();
  db.prepare('DELETE FROM portfolio_profile').run();

  const profileId = uuidv4();
  db.prepare(`
    INSERT INTO portfolio_profile (id, full_name, headline, email, phone, location, website_url, github_url, linkedin_url, summary, career_objective)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    profileId,
    'Alex Morgan',
    'AI & Full-Stack Software Engineering Student',
    'alex.morgan.demo@example.com',
    '+1 (555) 234-5678',
    'San Francisco, CA',
    'https://alexmorgan-demo.dev',
    'https://github.com/alexmorgan-demo',
    'https://linkedin.com/in/alexmorgan-demo',
    'Computer Science & AI undergraduate with a strong foundation in modern frontend architecture (React, TypeScript) and applied machine learning (PyTorch, NLP, Computer Vision). Proven track record delivering production-grade web applications and high-throughput model inference pipelines.',
    'Seeking an impactful summer internship where I can apply full-stack development and applied AI capabilities to build performant, user-centric software.'
  );

  // Education
  const eduId = uuidv4();
  db.prepare(`
    INSERT INTO education (id, institution, degree, field_of_study, start_date, end_date, is_current, gpa, honors, location, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    eduId,
    'California Institute of Technology & Science',
    'Bachelor of Science',
    'Computer Science & Artificial Intelligence',
    '2023-09-01',
    '2027-06-15',
    1,
    '3.92 / 4.00',
    'Dean’s High Honors List (All Semesters)',
    'Pasadena, CA',
    'Coursework: Data Structures & Algorithms, Deep Learning, Modern Web Architecture, Distributed Systems, Database Systems, Computer Vision.'
  );

  // Skills
  const skillsData = [
    // Languages
    { name: 'TypeScript', category: 'Languages', proficiency: 'Advanced', years: 2.5 },
    { name: 'JavaScript (ES6+)', category: 'Languages', proficiency: 'Expert', years: 3.5 },
    { name: 'Python', category: 'Languages', proficiency: 'Advanced', years: 3.0 },
    { name: 'SQL', category: 'Languages', proficiency: 'Intermediate', years: 2.0 },
    { name: 'HTML5 & CSS3', category: 'Languages', proficiency: 'Expert', years: 4.0 },

    // Frameworks & Libraries
    { name: 'React', category: 'Frameworks & Libraries', proficiency: 'Expert', years: 3.0 },
    { name: 'Next.js', category: 'Frameworks & Libraries', proficiency: 'Advanced', years: 2.0 },
    { name: 'Tailwind CSS', category: 'Frameworks & Libraries', proficiency: 'Expert', years: 2.5 },
    { name: 'Node.js & Express', category: 'Frameworks & Libraries', proficiency: 'Advanced', years: 2.5 },
    { name: 'PyTorch', category: 'Frameworks & Libraries', proficiency: 'Intermediate', years: 2.0 },
    { name: 'TensorFlow', category: 'Frameworks & Libraries', proficiency: 'Intermediate', years: 1.5 },
    { name: 'FastAPI', category: 'Frameworks & Libraries', proficiency: 'Intermediate', years: 1.5 },

    // Databases & Cloud
    { name: 'SQLite', category: 'Databases & Cloud', proficiency: 'Advanced', years: 2.5 },
    { name: 'PostgreSQL', category: 'Databases & Cloud', proficiency: 'Intermediate', years: 2.0 },
    { name: 'Redis', category: 'Databases & Cloud', proficiency: 'Intermediate', years: 1.0 },
    { name: 'Docker', category: 'Databases & Cloud', proficiency: 'Intermediate', years: 1.5 },

    // Tools & DevOps
    { name: 'Git & GitHub', category: 'Tools & DevOps', proficiency: 'Advanced', years: 3.5 },
    { name: 'Vite & Webpack', category: 'Tools & DevOps', proficiency: 'Advanced', years: 2.0 },
    { name: 'REST & GraphQL APIs', category: 'Tools & DevOps', proficiency: 'Advanced', years: 2.5 },
    { name: 'Jest & Vitest', category: 'Tools & DevOps', proficiency: 'Intermediate', years: 2.0 },

    // Core Concepts
    { name: 'Responsive Web Design', category: 'Core Concepts', proficiency: 'Expert', years: 3.0 },
    { name: 'Component Architecture', category: 'Core Concepts', proficiency: 'Expert', years: 3.0 },
    { name: 'Model Evaluation & Optimization', category: 'Core Concepts', proficiency: 'Intermediate', years: 1.5 },

    // Soft Skills
    { name: 'Technical Communication', category: 'Soft Skills', proficiency: 'Advanced', years: 3.0 },
    { name: 'Agile & Sprint Collaboration', category: 'Soft Skills', proficiency: 'Advanced', years: 2.0 }
  ];

  const skillMap = new Map<string, string>();
  const insertSkill = db.prepare(`
    INSERT INTO skills (id, name, category, proficiency, years_experience)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const s of skillsData) {
    const id = uuidv4();
    skillMap.set(s.name, id);
    insertSkill.run(id, s.name, s.category, s.proficiency, s.years);
  }

  // Certifications
  const cert1 = uuidv4();
  const cert2 = uuidv4();
  const insertCert = db.prepare(`
    INSERT INTO certifications (id, title, issuer, issue_date, expiration_date, credential_id, credential_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertCert.run(
    cert1,
    'Meta Front-End Developer Professional Certificate',
    'Meta / Coursera',
    '2024-08-15',
    '',
    'META-FE-98214',
    'https://coursera.org/verify/professional-cert/META-FE-98214'
  );
  insertCert.run(
    cert2,
    'Deep Learning Specialization',
    'DeepLearning.AI',
    '2024-11-20',
    '',
    'DL-SPEC-44312',
    'https://coursera.org/verify/specialization/DL-SPEC-44312'
  );

  // Projects
  const proj1 = uuidv4();
  const proj2 = uuidv4();
  const proj3 = uuidv4();
  const proj4 = uuidv4();

  const insertProject = db.prepare(`
    INSERT INTO projects (id, title, subtitle, role, start_date, end_date, description, bullet_points, technologies, github_url, live_url, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProject.run(
    proj1,
    'PulseUI: Spatial Component System',
    'High-Performance React & Tailwind Design Library',
    'Lead Frontend Architect',
    '2024-05-01',
    '2024-10-15',
    'Designed and implemented an Apple-inspired spatial design system with over 35 accessible headless components, sub-millisecond render benchmarks, and seamless keyboard navigation.',
    JSON.stringify([
      'Engineered 35+ accessible, responsive UI components conforming to WCAG 2.1 AA standards using React, TypeScript, and Tailwind CSS.',
      'Constructed a zero-runtime liquid glass blur and reflection engine with hardware-accelerated CSS composite layers.',
      'Implemented automated regression testing pipeline with Vitest and Playwright achieving 98.5% component code coverage.'
    ]),
    JSON.stringify(['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vitest', 'Framer Motion']),
    'https://github.com/alexmorgan-demo/pulse-ui',
    'https://pulse-ui-demo.dev',
    1
  );

  insertProject.run(
    proj2,
    'NeuroVision: Real-Time Edge Object Detection',
    'Quantized Computer Vision Inference Engine',
    'ML & Systems Engineer',
    '2024-08-01',
    '2024-12-10',
    'Trained, pruned, and quantized lightweight YOLOv8 models for real-time edge computer vision on embedded hardware with high frame-rates and minimal battery consumption.',
    JSON.stringify([
      'Optimized PyTorch object detection architecture using INT8 post-training quantization, cutting model size by 64% with under 1.2% mAP loss.',
      'Achieved 42 frames per second real-time inference on edge edge-compute hardware using ONNX Runtime.',
      'Containerized end-to-end evaluation pipeline with Docker and wrote automated accuracy benchmarking scripts.'
    ]),
    JSON.stringify(['Python', 'PyTorch', 'OpenCV', 'Docker', 'ONNX Runtime']),
    'https://github.com/alexmorgan-demo/neuro-vision',
    'https://neurovision-demo.dev',
    1
  );

  insertProject.run(
    proj3,
    'DocuSphere: Distributed Vector Retrieval RAG Engine',
    'Contextual Semantic Search & Query Engine',
    'Full-Stack AI Developer',
    '2024-02-01',
    '2024-07-20',
    'Engineered an enterprise-grade retrieval-augmented generation (RAG) knowledge engine using vector embeddings, hybrid semantic-keyword ranking, and FastAPI.',
    JSON.stringify([
      'Architected hybrid retrieval system combining dense vector search and BM25 lexical ranking, reducing hallucination rate by 38%.',
      'Developed low-latency asynchronous API server with FastAPI and Redis cache, serving queries under 120ms at p95.',
      'Designed responsive document inspection dashboard in React and Tailwind CSS with real-time streaming LLM completions.'
    ]),
    JSON.stringify(['Python', 'FastAPI', 'React', 'TypeScript', 'Redis', 'Docker', 'Tailwind CSS']),
    'https://github.com/alexmorgan-demo/docusphere-rag',
    'https://docusphere-demo.dev',
    1
  );

  insertProject.run(
    proj4,
    'FinTrack: Financial Analytics & Ledger PWA',
    'Offline-First Personal Wealth Tracking App',
    'Full-Stack Developer',
    '2023-10-01',
    '2024-02-15',
    'Built an offline-first progressive web application for tracking multi-currency personal expenses with interactive charts and automated CSV reconciliation.',
    JSON.stringify([
      'Created interactive SVG data visualization charts with micro-animations and zero external charting bundle overhead.',
      'Implemented offline sync queue using IndexedDB and Service Workers with automatic conflict resolution upon reconnection.',
      'Protected sensitive transaction records with client-side Web Crypto AES-GCM encryption.'
    ]),
    JSON.stringify(['JavaScript', 'React', 'Node.js', 'Express', 'SQLite']),
    'https://github.com/alexmorgan-demo/fintrack-pwa',
    'https://fintrack-demo.dev',
    0
  );

  // Link project skills
  const insertProjectSkill = db.prepare(`
    INSERT INTO project_skills (project_id, skill_id) VALUES (?, ?)
  `);
  const projectSkillLinks: [string, string[]][] = [
    [proj1, ['React', 'TypeScript', 'Tailwind CSS', 'Vite & Webpack', 'Responsive Web Design', 'Component Architecture']],
    [proj2, ['Python', 'PyTorch', 'Docker', 'Model Evaluation & Optimization']],
    [proj3, ['Python', 'FastAPI', 'React', 'TypeScript', 'Docker', 'Redis', 'REST & GraphQL APIs']],
    [proj4, ['React', 'JavaScript (ES6+)', 'Node.js & Express', 'SQLite', 'HTML5 & CSS3']]
  ];

  for (const [projId, skillNames] of projectSkillLinks) {
    for (const sName of skillNames) {
      const sId = skillMap.get(sName);
      if (sId) {
        insertProjectSkill.run(projId, sId);
      }
    }
  }

  // Experience
  const exp1 = uuidv4();
  const exp2 = uuidv4();
  const insertExp = db.prepare(`
    INSERT INTO experiences (id, company, role, location, employment_type, start_date, end_date, is_current, description, bullet_points, technologies)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertExp.run(
    exp1,
    'Vanguard Tech Labs',
    'Full-Stack Engineering Intern',
    'San Francisco, CA',
    'Internship',
    '2024-06-01',
    '2024-08-30',
    0,
    'Developed user-facing dashboards and microservices supporting internal engineering workflow telemetry.',
    JSON.stringify([
      'Refactored legacy customer configuration views into modular React 18 functional components, accelerating page load speeds by 40%.',
      'Created 8 RESTful API endpoints in Express and Node.js with strict Zod validation schemas and comprehensive unit test coverage.',
      'Collaborated in daily bi-weekly sprints, participating in architectural design reviews and PR code reviews.'
    ]),
    JSON.stringify(['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'Git & GitHub'])
  );

  insertExp.run(
    exp2,
    'University Applied AI Research Lab',
    'Undergraduate Research Assistant',
    'Pasadena, CA',
    'Part-time',
    '2024-01-15',
    '2024-05-30',
    0,
    'Conducted empirical experiments on neural network parameter pruning and low-rank matrix adaptation for vision transformers.',
    JSON.stringify([
      'Benchmarked transformer attention latency across varied GPU tensor core configurations using PyTorch and CUDA profiler.',
      'Authored automated data preprocessing pipelines handling 250,000+ labeled academic image samples.',
      'Co-authored research paper presented at the Regional Undergraduate Research Symposium.'
    ]),
    JSON.stringify(['Python', 'PyTorch', 'Data Structures & Algorithms', 'Technical Communication'])
  );

  // Achievements
  const insertAch = db.prepare(`
    INSERT INTO achievements (id, title, issuer, date, description, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertAch.run(
    uuidv4(),
    '1st Place Winner — CalTech HackAI 2024',
    'CalTech Computer Club',
    '2024-10-12',
    'Awarded Grand Prize out of 65 participating teams for developing an offline edge-computing accessibility vision assistant.',
    'Hackathon'
  );
  insertAch.run(
    uuidv4(),
    'Dean’s Honor List with Distinction',
    'School of Computer Science',
    '2024-05-20',
    'Maintained top 5% academic standing across all computer science and mathematics cohorts.',
    'Academic'
  );

  // Publications
  const insertPub = db.prepare(`
    INSERT INTO publications (id, title, publisher, publication_date, url, description, authors)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertPub.run(
    uuidv4(),
    'Efficient Quantization Techniques for Edge Neural Networks',
    'Undergraduate Computing Research Symposium (UCRS)',
    '2024-11-18',
    'https://ucrs-demo.org/papers/2024-alex-morgan',
    'Investigated trade-offs between activation bit-precision and perceptual loss across edge vision devices.',
    'Alex Morgan, Dr. Raymond Chen'
  );

  // Languages
  const insertLang = db.prepare(`
    INSERT INTO languages (id, language, proficiency)
    VALUES (?, ?, ?)
  `);
  insertLang.run(uuidv4(), 'English', 'Native');
  insertLang.run(uuidv4(), 'Spanish', 'Conversational');

  // Synthesize dual tailored demo resumes from seeded records
  const portfolioService = new PortfolioService();
  const resumeService = new ResumeService();
  const seededPortfolio = portfolioService.getCompletePortfolio();
  resumeService.generateDefaultTailoredResume(seededPortfolio, 'frontend');
  resumeService.generateDefaultTailoredResume(seededPortfolio, 'ai_ml');

  console.log('Fictional portfolio data and dual tailored resumes seeded successfully.');
}

// When executed directly via command line
if (require.main === module) {
  try {
    seedDatabase();
    console.log('Database seed completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Database seed failed:', err);
    process.exit(1);
  }
}
