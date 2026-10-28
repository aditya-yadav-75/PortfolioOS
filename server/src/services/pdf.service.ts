import PDFDocument from 'pdfkit';
import {
  ResumeDocument,
  CompletePortfolio,
  PortfolioProfile,
  Skill,
  Project,
  Experience,
  Education,
  Certification,
  Achievement
} from '@portfolio-os/shared';

export class PdfService {
  async generateResumePdf(resume: ResumeDocument, portfolio: CompletePortfolio): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'LETTER',
          margins: {
            top: 40,
            bottom: 40,
            left: 45,
            right: 45,
          },
          bufferPages: true,
          info: {
            Title: resume.name,
            Author: portfolio.profile?.full_name || 'Candidate',
            Subject: resume.target_role,
            Keywords: 'Resume, Curriculum Vitae, PortfolioOS',
          },
        });

        const buffers: Buffer[] = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err) => reject(err));

        if (resume.template === 'classic_ats') {
          this.renderClassicAts(doc, resume, portfolio);
        } else {
          this.renderModernProfessional(doc, resume, portfolio);
        }

        // Add page numbers at the bottom of each page if multi-page
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
          doc.switchToPage(i);
          doc.fontSize(8).fillColor('#64748B').text(
            `${portfolio.profile?.full_name || 'Resume'} — Page ${i + 1} of ${pages.count}`,
            45,
            doc.page.height - 28,
            { align: 'center', width: doc.page.width - 90 }
          );
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  private renderClassicAts(doc: PDFKit.PDFDocument, resume: ResumeDocument, portfolio: CompletePortfolio) {
    const profile = portfolio.profile || ({} as Partial<PortfolioProfile>);
    const fontMain = 'Helvetica';
    const fontBold = 'Helvetica-Bold';

    // Header: Centered, clean, high ATS readability
    doc.font(fontBold).fontSize(20).fillColor('#000000').text(profile.full_name || 'ALEX MORGAN', { align: 'center' });
    doc.moveDown(0.2);

    doc.font(fontMain).fontSize(11).fillColor('#333333').text(resume.target_role, { align: 'center' });
    doc.moveDown(0.3);

    // Contact line
    const contacts: string[] = [];
    if (profile.email) contacts.push(profile.email);
    if (profile.phone) contacts.push(profile.phone);
    if (profile.location) contacts.push(profile.location);
    if (profile.github_url) contacts.push(profile.github_url.replace(/^https?:\/\//, ''));
    if (profile.linkedin_url) contacts.push(profile.linkedin_url.replace(/^https?:\/\//, ''));

    doc.font(fontMain).fontSize(9).fillColor('#444444').text(contacts.join('  |  '), { align: 'center' });
    doc.moveDown(0.5);

    // Divider line
    doc.strokeColor('#000000').lineWidth(1).moveTo(45, doc.y).lineTo(doc.page.width - 45, doc.y).stroke();
    doc.moveDown(0.5);

    // Render sections according to resume.section_order
    for (const sectionType of resume.section_order) {
      this.renderSectionContent(doc, sectionType, resume, portfolio, fontMain, fontBold, '#000000', false);
    }
  }

  private renderModernProfessional(doc: PDFKit.PDFDocument, resume: ResumeDocument, portfolio: CompletePortfolio) {
    const profile = portfolio.profile || ({} as Partial<PortfolioProfile>);
    const fontMain = resume.typography.font_family === 'serif' ? 'Times-Roman' : 'Helvetica';
    const fontBold = resume.typography.font_family === 'serif' ? 'Times-Bold' : 'Helvetica-Bold';
    const accentColor = resume.typography.accent_color || '#0284C7';

    // Header: Modern Left-Aligned with colored accent bar
    doc.font(fontBold).fontSize(22).fillColor('#0F172A').text(profile.full_name || 'ALEX MORGAN');
    doc.moveDown(0.15);

    doc.font(fontBold).fontSize(11).fillColor(accentColor).text(resume.target_role.toUpperCase());
    doc.moveDown(0.3);

    // Contact info horizontal flex
    const contacts: string[] = [];
    if (profile.email) contacts.push(profile.email);
    if (profile.phone) contacts.push(profile.phone);
    if (profile.location) contacts.push(profile.location);
    if (profile.website_url) contacts.push(profile.website_url.replace(/^https?:\/\//, ''));
    if (profile.github_url) contacts.push(profile.github_url.replace(/^https?:\/\//, ''));

    doc.font(fontMain).fontSize(9).fillColor('#475569').text(contacts.join('  •  '));
    doc.moveDown(0.4);

    // Decorative Accent Line
    const curY = doc.y;
    doc.strokeColor(accentColor).lineWidth(2).moveTo(45, curY).lineTo(120, curY).stroke();
    doc.strokeColor('#E2E8F0').lineWidth(0.5).moveTo(120, curY).lineTo(doc.page.width - 45, curY).stroke();
    doc.moveDown(0.6);

    // Render sections
    for (const sectionType of resume.section_order) {
      this.renderSectionContent(doc, sectionType, resume, portfolio, fontMain, fontBold, accentColor, true);
    }
  }

  private renderSectionContent(
    doc: PDFKit.PDFDocument,
    sectionType: string,
    resume: ResumeDocument,
    portfolio: CompletePortfolio,
    fontMain: string,
    fontBold: string,
    accentColor: string,
    isModern: boolean
  ) {
    const checkPageBreak = (neededHeight: number = 50) => {
      if (doc.y + neededHeight > doc.page.height - 50) {
        doc.addPage();
      }
    };

    switch (sectionType) {
      case 'summary': {
        if (!resume.professional_summary) return;
        checkPageBreak(50);
        this.renderHeading(doc, 'PROFESSIONAL SUMMARY', fontBold, accentColor, isModern);
        doc.font(fontMain).fontSize(9.5).fillColor('#1E293B').text(resume.professional_summary, {
          lineGap: 2.5,
          align: 'justify',
        });
        doc.moveDown(0.8);
        break;
      }

      case 'skills': {
        const selectedSkills = portfolio.skills.filter(s => resume.selected_skills.includes(s.id));
        if (selectedSkills.length === 0) return;
        checkPageBreak(60);
        this.renderHeading(doc, 'TECHNICAL SKILLS', fontBold, accentColor, isModern);

        // Group by category
        const categories = Array.from(new Set(selectedSkills.map(s => s.category)));
        for (const cat of categories) {
          const catSkills = selectedSkills.filter(s => s.category === cat).map(s => s.name).join(', ');
          doc.font(fontBold).fontSize(9).fillColor('#0F172A').text(`${cat}: `, { continued: true });
          doc.font(fontMain).fontSize(9).fillColor('#334155').text(catSkills);
          doc.moveDown(0.2);
        }
        doc.moveDown(0.6);
        break;
      }

      case 'experience': {
        const included = resume.selected_experience.filter(e => e.is_included);
        if (included.length === 0) return;
        checkPageBreak(80);
        this.renderHeading(doc, 'WORK EXPERIENCE', fontBold, accentColor, isModern);

        for (const item of included) {
          const exp = portfolio.experiences.find(e => e.id === item.item_id);
          if (!exp) continue;
          checkPageBreak(55);

          const title = item.custom_title || `${exp.role} — ${exp.company}`;
          const dates = `${exp.start_date} – ${exp.is_current ? 'Present' : exp.end_date || ''}`;

          doc.font(fontBold).fontSize(10).fillColor('#0F172A').text(title, { continued: true });
          doc.font(fontMain).fontSize(9).fillColor('#64748B').text(` | ${exp.location || ''}`, { continued: true });
          doc.font(fontMain).fontSize(9).fillColor('#475569').text(dates, { align: 'right' });

          const bullets = item.custom_bullets || exp.bullet_points;
          for (const bullet of bullets) {
            checkPageBreak(25);
            doc.font(fontMain).fontSize(9).fillColor('#1E293B').text(`•  ${bullet}`, {
              indent: 10,
              lineGap: 2,
            });
          }
          doc.moveDown(0.4);
        }
        doc.moveDown(0.4);
        break;
      }

      case 'projects': {
        const included = resume.selected_projects.filter(p => p.is_included);
        if (included.length === 0) return;
        checkPageBreak(80);
        this.renderHeading(doc, 'PROJECTS', fontBold, accentColor, isModern);

        for (const item of included) {
          const proj = portfolio.projects.find(p => p.id === item.item_id);
          if (!proj) continue;
          checkPageBreak(55);

          const title = item.custom_title || proj.title;
          const techStack = proj.technologies.length > 0 ? ` (${proj.technologies.join(', ')})` : '';

          doc.font(fontBold).fontSize(10).fillColor('#0F172A').text(title, { continued: true });
          doc.font(fontMain).fontSize(9).fillColor('#64748B').text(techStack);

          const bullets = item.custom_bullets || proj.bullet_points;
          for (const bullet of bullets) {
            checkPageBreak(25);
            doc.font(fontMain).fontSize(9).fillColor('#1E293B').text(`•  ${bullet}`, {
              indent: 10,
              lineGap: 2,
            });
          }
          doc.moveDown(0.4);
        }
        doc.moveDown(0.4);
        break;
      }

      case 'education': {
        const included = resume.selected_education.filter(e => e.is_included);
        if (included.length === 0) return;
        checkPageBreak(60);
        this.renderHeading(doc, 'EDUCATION', fontBold, accentColor, isModern);

        for (const item of included) {
          const edu = portfolio.education.find(e => e.id === item.item_id);
          if (!edu) continue;
          checkPageBreak(45);

          const dates = `${edu.start_date} – ${edu.is_current ? 'Present' : edu.end_date || ''}`;
          doc.font(fontBold).fontSize(10).fillColor('#0F172A').text(edu.institution, { continued: true });
          doc.font(fontMain).fontSize(9).fillColor('#475569').text(dates, { align: 'right' });

          doc.font(fontMain).fontSize(9).fillColor('#334155').text(
            `${edu.degree} in ${edu.field_of_study}${edu.gpa ? ` — GPA: ${edu.gpa}` : ''}${edu.honors ? ` (${edu.honors})` : ''}`
          );
          if (edu.description) {
            doc.font(fontMain).fontSize(8.5).fillColor('#64748B').text(edu.description);
          }
          doc.moveDown(0.3);
        }
        doc.moveDown(0.4);
        break;
      }

      case 'certifications': {
        const included = resume.selected_certifications.filter(c => c.is_included);
        if (included.length === 0) return;
        checkPageBreak(50);
        this.renderHeading(doc, 'CERTIFICATIONS', fontBold, accentColor, isModern);

        for (const item of included) {
          const cert = portfolio.certifications.find(c => c.id === item.item_id);
          if (!cert) continue;
          checkPageBreak(30);

          doc.font(fontBold).fontSize(9).fillColor('#0F172A').text(cert.title, { continued: true });
          doc.font(fontMain).fontSize(9).fillColor('#475569').text(` — ${cert.issuer} (${cert.issue_date})`);
          doc.moveDown(0.2);
        }
        doc.moveDown(0.4);
        break;
      }

      case 'achievements': {
        const included = resume.selected_achievements.filter(a => a.is_included);
        if (included.length === 0) return;
        checkPageBreak(50);
        this.renderHeading(doc, 'ACHIEVEMENTS & AWARDS', fontBold, accentColor, isModern);

        for (const item of included) {
          const ach = portfolio.achievements.find(a => a.id === item.item_id);
          if (!ach) continue;
          checkPageBreak(30);

          doc.font(fontBold).fontSize(9).fillColor('#0F172A').text(ach.title, { continued: true });
          doc.font(fontMain).fontSize(9).fillColor('#475569').text(` — ${ach.issuer} (${ach.date})`);
          if (ach.description) {
            doc.font(fontMain).fontSize(8.5).fillColor('#64748B').text(ach.description, { indent: 10 });
          }
          doc.moveDown(0.2);
        }
        doc.moveDown(0.4);
        break;
      }
    }
  }

  private renderHeading(
    doc: PDFKit.PDFDocument,
    text: string,
    fontBold: string,
    accentColor: string,
    isModern: boolean
  ) {
    if (isModern) {
      doc.font(fontBold).fontSize(11).fillColor(accentColor).text(text);
      const curY = doc.y + 1;
      doc.strokeColor(accentColor).lineWidth(1).moveTo(45, curY).lineTo(doc.page.width - 45, curY).stroke();
      doc.moveDown(0.4);
    } else {
      // Classic ATS: Plain uppercase heading with simple black underline
      doc.font(fontBold).fontSize(11).fillColor('#000000').text(text);
      const curY = doc.y + 1;
      doc.strokeColor('#000000').lineWidth(0.75).moveTo(45, curY).lineTo(doc.page.width - 45, curY).stroke();
      doc.moveDown(0.4);
    }
  }
}
