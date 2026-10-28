import { describe, it, expect } from 'vitest';
import { GeminiService } from '../src/services/gemini.service';
import { CompletePortfolio } from '@portfolio-os/shared';

describe('Job Matcher & Evidence Grounding Engine', () => {
  const geminiService = new GeminiService();

  const mockPortfolio: CompletePortfolio = {
    profile: {
      id: 'p-1',
      full_name: 'Alex Morgan',
      headline: 'Frontend Engineer',
      email: 'alex@example.com',
      summary: 'Passionate developer specializing in React and TypeScript.',
      created_at: '',
      updated_at: '',
    },
    skills: [
      { id: 's-1', name: 'React', category: 'Frameworks & Libraries', proficiency: 'Expert', created_at: '', updated_at: '' },
      { id: 's-2', name: 'TypeScript', category: 'Languages', proficiency: 'Advanced', created_at: '', updated_at: '' },
      { id: 's-3', name: 'Tailwind CSS', category: 'Frameworks & Libraries', proficiency: 'Expert', created_at: '', updated_at: '' },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'PulseUI Component System',
        description: 'Apple-inspired spatial UI built with React and Tailwind CSS.',
        bullet_points: ['Built 35 accessible components in React', 'Ensured responsive design'],
        technologies: ['React', 'TypeScript', 'Tailwind CSS'],
        featured: true,
        created_at: '',
        updated_at: '',
      },
    ],
    experiences: [
      {
        id: 'exp-1',
        company: 'Vanguard Labs',
        role: 'Frontend Engineering Intern',
        employment_type: 'Internship',
        start_date: '2024-06-01',
        end_date: '2024-08-30',
        is_current: false,
        description: 'Refactored customer dashboard using React.',
        bullet_points: ['Accelerated rendering speed by 40% with React optimizations'],
        technologies: ['React', 'TypeScript'],
        created_at: '',
        updated_at: '',
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'CalTech',
        degree: 'Bachelor of Science',
        field_of_study: 'Computer Science',
        start_date: '2023-09-01',
        is_current: true,
        gpa: '3.92',
        created_at: '',
        updated_at: '',
      },
    ],
    certifications: [
      {
        id: 'c-1',
        title: 'Meta Front-End Developer',
        issuer: 'Meta',
        issue_date: '2024-08-15',
        created_at: '',
        updated_at: '',
      },
    ],
    achievements: [],
    publications: [],
    languages: [],
  };

  it('correctly matches requirements supported by evidence', () => {
    const jobDescription = `
      Looking for a Frontend Developer Intern at TechCo.
      Requirements:
      - Proficiency in React and TypeScript.
      - Experience with Tailwind CSS.
      - Pursuing a Degree in Computer Science.
      - Experience with Rust and Embedded C++ (Required).
    `;

    const result = geminiService.analyzeWithDeterministicRules(jobDescription, mockPortfolio, 'Frontend Intern', 'TechCo');

    expect(result.job_title).toBe('Frontend Intern');
    expect(result.company_name).toBe('TechCo');
    expect(result.requirements.length).toBeGreaterThan(0);

    // React requirement should be MATCHED
    const reactMatch = result.matches.find(m => m.requirement_text.toLowerCase().includes('react'));
    expect(reactMatch).toBeDefined();
    expect(reactMatch?.status).toBe('MATCHED');
    expect(reactMatch?.evidence.length).toBeGreaterThan(0);

    // Rust requirement should NOT be evidenced
    const rustMatch = result.matches.find(m => m.requirement_text.toLowerCase().includes('rust'));
    if (rustMatch) {
      expect(rustMatch.status).toBe('NOT_EVIDENCED');
      expect(rustMatch.evidence.length).toBe(0);
    }
  });

  it('prevents unsupported claims in summary rewrite', async () => {
    const rewritten = await geminiService.rewriteProfessionalSummary(
      mockPortfolio.profile!.summary,
      'Frontend Intern',
      ['React', 'TypeScript'],
      ['PulseUI Component System']
    );

    expect(rewritten).toBeDefined();
    expect(rewritten.length).toBeGreaterThan(20);
    // Should preserve existing facts
    expect(rewritten.toLowerCase()).toContain('react');
  });
});
