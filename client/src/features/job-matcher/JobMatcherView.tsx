import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  RotateCcw,
  ArrowRight,
  Cpu,
  History,
  Copy,
} from 'lucide-react';
import { GlassPanel } from '../../components/ui/GlassPanel';
import { PageHeader } from '../../components/ui/PageHeader';
import { JobRequirementItem } from './JobRequirementItem';
import { api } from '../../lib/api';
import { useToast } from '../../components/ui/Toast';
import { JobAnalysisResult, SavedJobAnalysis } from '@portfolio-os/shared';
import { NavigationTab } from '../../components/ui/GlassNavigation';

interface JobMatcherViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onSendToStudio?: (roleType: 'frontend' | 'ai_ml') => void;
}

export const JobMatcherView: React.FC<JobMatcherViewProps> = ({ onNavigate, onSendToStudio }) => {
  const [jobText, setJobText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<JobAnalysisResult | null>(null);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedJobAnalysis[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const { success, error, info } = useToast();

  const loadHistory = async () => {
    try {
      const list = await api.jobs.getSavedAnalyses();
      setSavedAnalyses(list);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Preload Sample 1: Frontend Developer Intern
  const handleLoadFrontendSample = () => {
    setJobTitle('Frontend Developer Intern');
    setCompanyName('Vanguard Digital Labs');
    setJobText(`Position: Frontend Developer Intern
Location: San Francisco, CA (Hybrid)

About the Role:
We are seeking a talented and detail-oriented Frontend Developer Intern to join our web platform team. You will build user-facing features for our high-throughput analytics applications, implement responsive design systems, and ensure accessibility.

Key Requirements:
- Proficiency with React, TypeScript, and modern JavaScript (ES6+).
- Strong command of HTML5, CSS3, and responsive styling with Tailwind CSS.
- Familiarity with modern frontend build pipelines (Vite, Webpack) and RESTful API consumption.
- Understanding of component testing (Vitest, Jest) and code quality standards.
- Currently pursuing a Bachelor's degree in Computer Science, Software Engineering, or related technical field.

Nice to Have:
- Experience building component libraries or spatial user interfaces.
- Familiarity with client-side state management and performance optimization.
- Active GitHub portfolio demonstrating clean code and documentation.`);
    info('Loaded sample: Frontend Developer Intern');
  };

  // Preload Sample 2: AI/ML Intern
  const handleLoadAIMLSample = () => {
    setJobTitle('AI / Machine Learning Intern');
    setCompanyName('DeepScale Applied Intelligence');
    setJobText(`Position: Applied AI / Machine Learning Research Intern
Location: Pasadena, CA

About the Role:
DeepScale Applied Intelligence is seeking an ambitious AI/ML Intern to contribute to our real-time edge computer vision and retrieval-augmented generation (RAG) knowledge pipelines.

Key Requirements:
- Strong programming background in Python with experience in PyTorch or TensorFlow.
- Solid theoretical understanding of machine learning algorithms, deep learning, and model evaluation metrics.
- Experience with edge model optimization, INT8 quantization, or ONNX runtime inference.
- Practical experience with FastAPI, Docker, and vector database embeddings.
- Pursuing a degree in Computer Science, AI, or Computational Mathematics with high academic standing.

Bonus Qualifications:
- Prior research publications or top placements in competitive AI hackathons.
- Experience with OpenCV and streaming video analytics.`);
    info('Loaded sample: AI / Machine Learning Intern');
  };

  const handleAnalyze = async () => {
    if (!jobText.trim() || jobText.trim().length < 20) {
      error('Job description too short', 'Please paste at least 20 characters.');
      return;
    }

    try {
      setAnalyzing(true);
      const res = await api.jobs.analyze({
        job_description: jobText,
        job_title: jobTitle || undefined,
        company_name: companyName || undefined,
        save_analysis: true,
      });
      setAnalysisResult(res);
      success(`Analysis complete! Overall Match Score: ${res.overall_match_score}%`);
      loadHistory();
    } catch (err: any) {
      error('Analysis failed', err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // Calculate stats
  const matches = analysisResult?.matches || [];
  const matchedCount = matches.filter((m) => m.status === 'MATCHED').length;
  const partialCount = matches.filter((m) => m.status === 'PARTIALLY_MATCHED').length;
  const notEvidencedCount = matches.filter((m) => m.status === 'NOT_EVIDENCED').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Job Matcher"
        badge="Gemini AI & Evidence Grounding"
        description="Extract requirements from job descriptions and rigorously compare them with verified portfolio records. Zero hallucinated claims."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-white border border-white/10 transition-colors"
            >
              <History className="w-3.5 h-3.5 text-sky-400" />
              History ({savedAnalyses.length})
            </button>
          </div>
        }
      />

      {/* Input Section */}
      <GlassPanel className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Target Job Description</h3>
            <p className="text-xs text-[#A0A5B0] mt-0.5">Paste any job posting or select an assignment preset below.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadFrontendSample}
              className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-400/20 text-xs font-medium transition-colors"
            >
              Preset 1: Frontend Intern
            </button>
            <button
              onClick={handleLoadAIMLSample}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-400/20 text-xs font-medium transition-colors"
            >
              Preset 2: AI/ML Intern
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-[#737987] uppercase tracking-wide mb-1">
              Job Title (Optional)
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Frontend Developer Intern"
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#737987] uppercase tracking-wide mb-1">
              Company (Optional)
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Vanguard Tech Labs"
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-[#737987] uppercase tracking-wide mb-1">
            Raw Job Description Text
          </label>
          <textarea
            rows={7}
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Paste complete job requirements, qualifications, and responsibilities here..."
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white leading-relaxed placeholder:text-[#737987]"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-[11px] text-[#737987]">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>Runs Gemini model with automatic deterministic rule-based fallback</span>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-sky-500/25 hover:bg-sky-500/35 text-sky-400 border border-sky-400/40 text-xs font-semibold shadow-[0_0_20px_rgba(56,189,248,0.25)] transition-all disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                Analyzing Requirements...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Run Evidence Matcher
              </>
            )}
          </button>
        </div>
      </GlassPanel>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Header & Match Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <GlassPanel className="md:col-span-2 flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-full border-4 border-sky-500/20 flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-white">{analysisResult.overall_match_score}%</span>
                <span className="absolute -bottom-2 px-2 py-0.2 rounded-full text-[9px] bg-sky-500 text-black font-bold uppercase tracking-wider">
                  Score
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">{analysisResult.job_title}</h3>
                {analysisResult.company_name && (
                  <div className="text-xs text-sky-400 mt-0.5">{analysisResult.company_name}</div>
                )}
                <div className="text-[11px] text-[#A0A5B0] mt-1 line-clamp-2">
                  {analysisResult.role_summary}
                </div>
                <div className="text-[10px] text-[#737987] mt-1.5 flex items-center gap-2">
                  <span className="px-1.5 py-0.2 rounded bg-white/10 font-mono">
                    Mode: {analysisResult.analysis_mode}
                  </span>
                  {analysisResult.model_used && <span>Model: {analysisResult.model_used}</span>}
                </div>
              </div>
            </GlassPanel>

            <GlassPanel className="flex flex-col justify-between">
              <span className="text-[10px] font-medium text-[#737987] uppercase tracking-wider">
                Evidence Breakdown
              </span>
              <div className="space-y-1.5 my-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                  </span>
                  <span className="font-semibold text-white">{matchedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Partial
                  </span>
                  <span className="font-semibold text-white">{partialCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-rose-400 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> Not Evidenced
                  </span>
                  <span className="font-semibold text-white">{notEvidencedCount}</span>
                </div>
              </div>
              <div className="text-[10px] text-[#737987]">
                Total requirements: {matches.length}
              </div>
            </GlassPanel>

            <GlassPanel className="flex flex-col justify-between">
              <span className="text-[10px] font-medium text-[#737987] uppercase tracking-wider">
                Resume Bridge
              </span>
              <p className="text-[11px] text-[#A0A5B0] mt-1 leading-snug">
                Ready to synthesize an evidence-grounded resume for this specific position?
              </p>
              <button
                onClick={() => {
                  const isAIML = analysisResult.job_title.toLowerCase().includes('ai') || analysisResult.job_title.toLowerCase().includes('machine learning');
                  if (onSendToStudio) onSendToStudio(isAIML ? 'ai_ml' : 'frontend');
                  onNavigate('resume-studio');
                }}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-400/30 text-xs font-semibold transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                Synthesize in Studio
              </button>
            </GlassPanel>
          </div>

          {/* AI Tailored Summary Recommendation */}
          {analysisResult.suggested_tailored_summary && (
            <GlassPanel className="space-y-2 border-sky-500/20 bg-sky-500/[0.03]">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                <Sparkles className="w-4 h-4" />
                Suggested Role-Tailored Professional Summary (Strictly Grounded)
              </div>
              <p className="text-xs text-[#F3F4F6] leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                "{analysisResult.suggested_tailored_summary}"
              </p>
              <div className="text-[10px] text-[#737987]">
                This summary will be automatically loaded into the Resume Studio editor for this role.
              </div>
            </GlassPanel>
          )}

          {/* Extracted Requirements & Evidence Citations */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Verified Requirement & Portfolio Evidence Citations
              <span className="text-xs font-normal text-[#737987]">({matches.length})</span>
            </h3>

            <div className="space-y-3">
              {matches.map((m) => (
                <JobRequirementItem key={m.requirement_id} match={m} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Drawer Modal */}
      {showHistory && (
        <GlassPanel className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-semibold text-white">Previous Job Analyses</h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-xs text-[#A0A5B0] hover:text-white"
            >
              Close
            </button>
          </div>
          {savedAnalyses.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#737987]">No past analyses found.</div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {savedAnalyses.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setAnalysisResult(item.analysis_result);
                    setJobTitle(item.title);
                    setCompanyName(item.company || '');
                    setJobText(item.raw_job_description);
                    setShowHistory(false);
                  }}
                  className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{item.title}</div>
                    <div className="text-[10px] text-[#737987]">
                      {item.company || 'Company not specified'} • Score: {item.analysis_result.overall_match_score}% • {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#737987]" />
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      )}
    </div>
  );
};
