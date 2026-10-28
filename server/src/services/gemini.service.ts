import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { getDatabase } from '../database/connection';
import {
  CompletePortfolio,
  JobAnalysisResult,
  RequirementMatch,
  ExtractedRequirement,
  EvidenceItem,
  SavedJobAnalysis,
} from '@portfolio-os/shared';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private db = getDatabase();

  constructor() {
    if (config.geminiApiKey) {
      this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
    }
  }

  isConfigured(): boolean {
    return Boolean(config.geminiApiKey && config.geminiApiKey.trim().length > 0);
  }

  async analyzeJobDescription(
    rawText: string,
    portfolio: CompletePortfolio,
    hintTitle?: string,
    hintCompany?: string
  ): Promise<JobAnalysisResult> {
    if (this.isConfigured() && this.genAI) {
      try {
        return await this.analyzeWithGemini(rawText, portfolio, hintTitle, hintCompany);
      } catch (error) {
        console.warn('Gemini API call failed or encountered error, falling back to deterministic analyzer:', error);
        return this.analyzeWithDeterministicRules(rawText, portfolio, hintTitle, hintCompany);
      }
    } else {
      return this.analyzeWithDeterministicRules(rawText, portfolio, hintTitle, hintCompany);
    }
  }

  private async analyzeWithGemini(
    rawText: string,
    portfolio: CompletePortfolio,
    hintTitle?: string,
    hintCompany?: string
  ): Promise<JobAnalysisResult> {
    const model = this.genAI!.getGenerativeModel({
      model: config.geminiModel,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const portfolioSummary = JSON.stringify({
      skills: portfolio.skills.map(s => ({ name: s.name, category: s.category, proficiency: s.proficiency })),
      projects: portfolio.projects.map(p => ({ title: p.title, description: p.description, technologies: p.technologies })),
      experiences: portfolio.experiences.map(e => ({ role: e.role, company: e.company, description: e.description, technologies: e.technologies })),
      education: portfolio.education.map(ed => ({ degree: ed.degree, field: ed.field_of_study, institution: ed.institution })),
      certifications: portfolio.certifications.map(c => ({ title: c.title, issuer: c.issuer }))
    });

    const prompt = `
You are an expert AI Career Strategist and Technical Recruiter.
Analyze the following Job Description (untrusted user input) and extract structured requirements, comparing them with the candidate's real portfolio records.

CRITICAL NON-NEGOTIABLE GROUNDING RULES:
1. NEVER hallucinate or invent skills, degrees, employers, certifications, employment durations, metrics, or achievements.
2. Only claim evidence that explicitly exists in the candidate's portfolio.
3. Every requirement must be classified into status: "MATCHED", "PARTIALLY_MATCHED", or "NOT_EVIDENCED".
4. If the portfolio does NOT have evidence for a requirement, label it "NOT_EVIDENCED" with empty evidence array and an honest rationale.

JOB DESCRIPTION:
"""
${rawText}
"""

CANDIDATE PORTFOLIO RECORDS:
${portfolioSummary}

Output valid JSON matching this exact structure:
{
  "job_title": "string (inferred job title, or '${hintTitle || ''}')",
  "company_name": "string (company name if found, or '${hintCompany || ''}')",
  "location": "string (location if specified or null)",
  "role_summary": "string (concise 2-3 sentence overview of what this role entails)",
  "required_skills": ["skill1", "skill2"],
  "preferred_skills": ["skillA", "skillB"],
  "qualifications": ["degree requirement", "experience requirement"],
  "experience_requirements": ["years of experience requirement"],
  "responsibilities": ["key responsibility 1", "key responsibility 2"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "requirements": [
    {
      "id": "req-1",
      "category": "required_skill" | "preferred_skill" | "qualification" | "experience" | "responsibility",
      "text": "specific requirement text",
      "importance": "high" | "medium" | "low"
    }
  ],
  "matches": [
    {
      "requirement_id": "req-1",
      "requirement_text": "specific requirement text",
      "category": "required_skill",
      "status": "MATCHED" | "PARTIALLY_MATCHED" | "NOT_EVIDENCED",
      "confidence_score": 90,
      "evidence": [
        {
          "record_type": "skill" | "project" | "experience" | "education" | "certification",
          "record_id": "string",
          "record_title": "title of item",
          "matched_text": "exact snippet or skill name from portfolio",
          "relevance_explanation": "why this portfolio item satisfies the requirement"
        }
      ],
      "rationale": "Clear explanation of match status"
    }
  ],
  "overall_match_score": 85,
  "suggested_tailored_summary": "Tailored 2-3 sentence summary highlighting candidate's truthful relevant strengths for this specific role."
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    return {
      job_title: parsed.job_title || hintTitle || 'Target Position',
      company_name: parsed.company_name || hintCompany || undefined,
      location: parsed.location || undefined,
      role_summary: parsed.role_summary || 'Analysis completed.',
      required_skills: Array.isArray(parsed.required_skills) ? parsed.required_skills : [],
      preferred_skills: Array.isArray(parsed.preferred_skills) ? parsed.preferred_skills : [],
      qualifications: Array.isArray(parsed.qualifications) ? parsed.qualifications : [],
      experience_requirements: Array.isArray(parsed.experience_requirements) ? parsed.experience_requirements : [],
      responsibilities: Array.isArray(parsed.responsibilities) ? parsed.responsibilities : [],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      requirements: Array.isArray(parsed.requirements) ? parsed.requirements : [],
      matches: Array.isArray(parsed.matches) ? parsed.matches : [],
      overall_match_score: typeof parsed.overall_match_score === 'number' ? parsed.overall_match_score : 50,
      analysis_mode: 'gemini_ai',
      model_used: config.geminiModel,
      suggested_tailored_summary: parsed.suggested_tailored_summary,
    };
  }

  // Deterministic Rule-Based Fallback
  analyzeWithDeterministicRules(
    rawText: string,
    portfolio: CompletePortfolio,
    hintTitle?: string,
    hintCompany?: string
  ): JobAnalysisResult {
    const textLower = rawText.toLowerCase();

    // Inferred Title
    let jobTitle = hintTitle || '';
    if (!jobTitle) {
      if (textLower.includes('frontend') || textLower.includes('front-end')) jobTitle = 'Frontend Developer Intern';
      else if (textLower.includes('machine learning') || textLower.includes('ai') || textLower.includes('ml')) jobTitle = 'AI / Machine Learning Intern';
      else if (textLower.includes('full stack') || textLower.includes('fullstack')) jobTitle = 'Full Stack Software Engineer';
      else jobTitle = 'Software Engineering Candidate';
    }

    // Inferred Company
    let companyName = hintCompany || '';
    if (!companyName) {
      const atMatch = rawText.match(/\bat\s+([A-Z][a-zA-Z0-9\s]{2,30}?)(?:,|\.|\n|$)/);
      if (atMatch && atMatch[1]) companyName = atMatch[1].trim();
    }

    // Common skill taxonomy
    const techDictionary = [
      'react', 'next.js', 'vue', 'angular', 'svelte', 'typescript', 'javascript', 'html', 'html5', 'css', 'css3', 'tailwind', 'tailwind css',
      'node', 'node.js', 'express', 'python', 'pytorch', 'tensorflow', 'scikit-learn', 'fastapi', 'flask', 'django',
      'sql', 'sqlite', 'postgresql', 'mysql', 'mongodb', 'redis', 'docker', 'kubernetes', 'aws', 'gcp', 'azure',
      'git', 'github', 'ci/cd', 'rest', 'restful', 'graphql', 'vitest', 'jest', 'playwright', 'testing',
      'data structures', 'algorithms', 'deep learning', 'nlp', 'computer vision', 'opencv', 'rag'
    ];

    const detectedTech: string[] = [];
    for (const tech of techDictionary) {
      const regex = new RegExp(`\\b${tech.replace('.', '\\.')}\\b`, 'i');
      if (regex.test(textLower)) {
        detectedTech.push(tech);
      }
    }

    // Extract bullet points or sentences from JD
    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 5);
    const requirements: ExtractedRequirement[] = [];
    const matches: RequirementMatch[] = [];

    let reqIndex = 1;

    // Categorize detected skills
    const requiredSkills: string[] = [];
    const preferredSkills: string[] = [];
    const keywords: string[] = [];

    detectedTech.forEach((tech, idx) => {
      const isPreferred = textLower.includes(`preferred: ${tech}`) || textLower.includes(`bonus: ${tech}`) || idx > 5;
      const formattedName = tech.charAt(0).toUpperCase() + tech.slice(1);
      if (isPreferred) {
        preferredSkills.push(formattedName);
      } else {
        requiredSkills.push(formattedName);
      }
      keywords.push(formattedName);

      const reqId = `req-${reqIndex++}`;
      requirements.push({
        id: reqId,
        category: isPreferred ? 'preferred_skill' : 'required_skill',
        text: `Proficiency with ${formattedName}`,
        importance: isPreferred ? 'medium' : 'high',
      });
    });

    // Extract education / experience lines
    lines.forEach(line => {
      const lLower = line.toLowerCase();
      if (lLower.includes('degree') || lLower.includes('bachelor') || lLower.includes('master') || lLower.includes('computer science') || lLower.includes('pursuing')) {
        const reqId = `req-${reqIndex++}`;
        requirements.push({
          id: reqId,
          category: 'qualification',
          text: line.replace(/^[•\-\*]\s*/, ''),
          importance: 'high',
        });
      } else if (lLower.includes('experience') || lLower.includes('year') || lLower.includes('internship')) {
        const reqId = `req-${reqIndex++}`;
        requirements.push({
          id: reqId,
          category: 'experience',
          text: line.replace(/^[•\-\*]\s*/, ''),
          importance: 'medium',
        });
      } else if (lLower.startsWith('develop') || lLower.startsWith('build') || lLower.startsWith('maintain') || lLower.startsWith('collaborate') || lLower.startsWith('design')) {
        if (requirements.filter(r => r.category === 'responsibility').length < 4) {
          const reqId = `req-${reqIndex++}`;
          requirements.push({
            id: reqId,
            category: 'responsibility',
            text: line.replace(/^[•\-\*]\s*/, ''),
            importance: 'medium',
          });
        }
      }
    });

    // Ensure we have at least some requirements
    if (requirements.length === 0) {
      requirements.push({
        id: `req-${reqIndex++}`,
        category: 'required_skill',
        text: 'Software Engineering Fundamentals',
        importance: 'high',
      });
    }

    // Now match against portfolio
    let matchedCount = 0;
    let partialCount = 0;

    for (const req of requirements) {
      const reqTextLower = req.text.toLowerCase();
      const evidence: EvidenceItem[] = [];

      // Check Skills
      for (const skill of portfolio.skills) {
        if (reqTextLower.includes(skill.name.toLowerCase()) || skill.name.toLowerCase().includes(reqTextLower.replace('proficiency with ', ''))) {
          evidence.push({
            record_type: 'skill',
            record_id: skill.id,
            record_title: skill.name,
            matched_text: `${skill.name} (${skill.proficiency})`,
            relevance_explanation: `Candidate has verified skill in ${skill.name} at ${skill.proficiency} level.`,
          });
        }
      }

      // Check Projects
      for (const proj of portfolio.projects) {
        const projTech = proj.technologies.map(t => t.toLowerCase());
        const hasTech = projTech.some(t => reqTextLower.includes(t));
        const hasTextInDesc = proj.description.toLowerCase().includes(reqTextLower.replace('proficiency with ', ''));
        if (hasTech || hasTextInDesc) {
          evidence.push({
            record_type: 'project',
            record_id: proj.id,
            record_title: proj.title,
            matched_text: proj.title,
            relevance_explanation: `Demonstrated through project "${proj.title}" using ${proj.technologies.slice(0, 3).join(', ')}.`,
          });
        }
      }

      // Check Experiences
      for (const exp of portfolio.experiences) {
        const expTech = (exp.technologies || []).map(t => t.toLowerCase());
        const hasTech = expTech.some(t => reqTextLower.includes(t));
        const hasTextInDesc = exp.description.toLowerCase().includes(reqTextLower.replace('proficiency with ', '').trim());
        const roleTokens = exp.role.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const hasRoleToken = roleTokens.some(t => reqTextLower.includes(t));

        if (hasTech || hasTextInDesc || (req.category === 'experience' && hasRoleToken)) {
          evidence.push({
            record_type: 'experience',
            record_id: exp.id,
            record_title: `${exp.role} at ${exp.company}`,
            matched_text: `${exp.role} at ${exp.company}`,
            relevance_explanation: `Relevant work experience gained as ${exp.role} at ${exp.company}.`,
          });
        }
      }

      // Check Education
      for (const edu of portfolio.education) {
        const eduField = edu.field_of_study.toLowerCase();
        const eduDegree = edu.degree.toLowerCase();
        const hasDegreeMention = reqTextLower.includes('degree') || reqTextLower.includes('bachelor') || reqTextLower.includes('master');
        const hasFieldMatch = reqTextLower.includes(eduField) || (eduField.includes('computer science') && reqTextLower.includes('computer science'));

        if (req.category === 'qualification' && (hasFieldMatch || (hasDegreeMention && hasFieldMatch))) {
          evidence.push({
            record_type: 'education',
            record_id: edu.id,
            record_title: `${edu.degree} in ${edu.field_of_study}`,
            matched_text: `${edu.degree} in ${edu.field_of_study} at ${edu.institution}`,
            relevance_explanation: `Academic qualification: ${edu.degree} in ${edu.field_of_study} (GPA: ${edu.gpa || 'Strong'}).`,
          });
        }
      }

      // Check Certifications
      for (const cert of portfolio.certifications) {
        if (reqTextLower.includes(cert.title.toLowerCase()) || cert.title.toLowerCase().includes(reqTextLower.replace('proficiency with ', ''))) {
          evidence.push({
            record_type: 'certification',
            record_id: cert.id,
            record_title: cert.title,
            matched_text: cert.title,
            relevance_explanation: `Holds verified certification: ${cert.title} issued by ${cert.issuer}.`,
          });
        }
      }

      let status: 'MATCHED' | 'PARTIALLY_MATCHED' | 'NOT_EVIDENCED' = 'NOT_EVIDENCED';
      let confidence = 0;
      let rationale = 'No corresponding portfolio record or project evidence identified.';

      if (evidence.length >= 2) {
        status = 'MATCHED';
        confidence = 95;
        matchedCount++;
        rationale = `Strong multi-record evidence corroborated across ${evidence.map(e => e.record_type).join(' & ')}.`;
      } else if (evidence.length === 1) {
        status = 'MATCHED';
        confidence = 85;
        matchedCount++;
        rationale = `Direct evidence identified in ${evidence[0].record_type}: ${evidence[0].record_title}.`;
      } else {
        // check partial
        const reqTokens = req.text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const hasAnyToken = portfolio.skills.some(s => reqTokens.some(t => s.name.toLowerCase().includes(t)));
        if (hasAnyToken) {
          status = 'PARTIALLY_MATCHED';
          confidence = 60;
          partialCount++;
          rationale = 'Found related technical background, but direct specific evidence is not explicitly documented.';
        }
      }

      matches.push({
        requirement_id: req.id,
        requirement_text: req.text,
        category: req.category,
        status,
        confidence_score: confidence,
        evidence,
        rationale,
      });
    }

    const totalReqs = Math.max(requirements.length, 1);
    const overallScore = Math.min(100, Math.round(((matchedCount * 1.0 + partialCount * 0.5) / totalReqs) * 100));

    // Tailored summary recommendation
    const topSkills = portfolio.skills.slice(0, 4).map(s => s.name).join(', ');
    const tailoredSummary = portfolio.profile?.summary
      ? `${portfolio.profile.summary} Targeted specifically for ${jobTitle} by emphasizing proven expertise in ${topSkills}.`
      : `High-achieving computer science student targeting ${jobTitle} with practical engineering experience in ${topSkills}.`;

    return {
      job_title: jobTitle,
      company_name: companyName || undefined,
      role_summary: `Job analysis generated via deterministic rule-based matching across ${requirements.length} detected requirements.`,
      required_skills: requiredSkills,
      preferred_skills: preferredSkills,
      qualifications: requirements.filter(r => r.category === 'qualification').map(r => r.text),
      experience_requirements: requirements.filter(r => r.category === 'experience').map(r => r.text),
      responsibilities: requirements.filter(r => r.category === 'responsibility').map(r => r.text),
      keywords,
      requirements,
      matches,
      overall_match_score: overallScore,
      analysis_mode: 'deterministic_fallback',
      model_used: undefined,
      suggested_tailored_summary: tailoredSummary,
    };
  }

  // Summary Rewriter
  async rewriteProfessionalSummary(
    currentSummary: string,
    targetRole: string,
    targetKeywords: string[],
    keyAchievements: string[]
  ): Promise<string> {
    if (this.isConfigured() && this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({ model: config.geminiModel });
        const prompt = `
You are an expert technical resume writer.
Rewrite the candidate's professional summary to emphasize relevance for the target role: "${targetRole}".

CRITICAL TRUTHFULNESS DIRECTIVES:
- NEVER invent facts, skills, companies, degrees, or metrics not present in the input.
- Keep the length between 2 to 4 punchy, professional sentences.
- Seamlessly integrate these target keywords IF supported: ${targetKeywords.join(', ')}.
- Highlight these candidate achievements: ${keyAchievements.join(', ')}.

CURRENT SUMMARY:
"${currentSummary}"

Return ONLY the rewritten summary paragraph. No meta-commentary, no quotes.
`;
        const res = await model.generateContent(prompt);
        return res.response.text().trim();
      } catch (err) {
        console.warn('Gemini summary rewrite error, falling back:', err);
      }
    }

    // Deterministic fallback
    const kwText = targetKeywords.length > 0 ? ` with specialized focus on ${targetKeywords.slice(0, 3).join(', ')}` : '';
    return `${currentSummary.trim()} Tailored for ${targetRole}${kwText}, bringing disciplined development practices and rigorous software craft.`;
  }

  // Project Bullet Improver
  async rewriteProjectBullet(
    originalBullet: string,
    roleOrProject?: string,
    targetKeyword?: string
  ): Promise<string> {
    if (this.isConfigured() && this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({ model: config.geminiModel });
        const prompt = `
Rewrite this resume bullet point to start with a strong action verb, quantify impact where possible, and emphasize technical depth without adding fictitious claims.
Role/Project: ${roleOrProject || 'Technical Project'}
Target Skill/Keyword to highlight: ${targetKeyword || 'Technical Excellence'}

ORIGINAL BULLET:
"${originalBullet}"

Return ONLY the single polished bullet point.
`;
        const res = await model.generateContent(prompt);
        return res.response.text().trim().replace(/^[•\-\*]\s*/, '');
      } catch (err) {
        console.warn('Gemini bullet rewrite error:', err);
      }
    }

    // Deterministic fallback
    let improved = originalBullet.trim();
    if (!/^[A-Z][a-z]+ed\b/.test(improved)) {
      improved = `Engineered and delivered: ${improved}`;
    }
    return improved;
  }

  // Save Job Analysis to Database
  saveJobAnalysis(
    rawText: string,
    result: JobAnalysisResult,
    title?: string,
    company?: string
  ): SavedJobAnalysis {
    const id = uuidv4();
    const now = new Date().toISOString();
    const resolvedTitle = title || result.job_title || 'Analyzed Job';
    const resolvedCompany = company || result.company_name || null;

    this.db.prepare(`
      INSERT INTO job_analyses (id, title, company, raw_job_description, analysis_result, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      resolvedTitle,
      resolvedCompany,
      rawText,
      JSON.stringify(result),
      now,
      now
    );

    return {
      id,
      title: resolvedTitle,
      company: resolvedCompany || undefined,
      raw_job_description: rawText,
      analysis_result: result,
      created_at: now,
      updated_at: now,
    };
  }

  getSavedAnalyses(): SavedJobAnalysis[] {
    const rows = this.db.prepare('SELECT * FROM job_analyses ORDER BY created_at DESC').all() as any[];
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      company: r.company || undefined,
      raw_job_description: r.raw_job_description,
      analysis_result: JSON.parse(r.analysis_result),
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  }

  getAnalysisById(id: string): SavedJobAnalysis | null {
    const r = this.db.prepare('SELECT * FROM job_analyses WHERE id = ?').get(id) as any;
    if (!r) return null;
    return {
      id: r.id,
      title: r.title,
      company: r.company || undefined,
      raw_job_description: r.raw_job_description,
      analysis_result: JSON.parse(r.analysis_result),
      created_at: r.created_at,
      updated_at: r.updated_at,
    };
  }

  deleteAnalysis(id: string): boolean {
    const res = this.db.prepare('DELETE FROM job_analyses WHERE id = ?').run(id);
    return res.changes > 0;
  }
}
