import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarClock, AlertCircle, ArrowUpRight, Clock, Tag, Terminal } from 'lucide-react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import Footer from '../components/footer';
import { cohortAPI } from '../services/api';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const rise = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#161b22] animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-[#161b22] rounded-full animate-pulse" />
          <div className="h-3 w-full bg-[#161b22] rounded-full animate-pulse" />
          <div className="h-3 w-5/6 bg-[#161b22] rounded-full animate-pulse" />
        </div>
      </div>
      <div className="flex justify-between pt-2">
        <div className="h-5 w-20 bg-[#161b22] rounded-full animate-pulse" />
        <div className="h-5 w-24 bg-[#161b22] rounded-full animate-pulse" />
      </div>
    </div>
  );
}

/* ── Category accent map ── */
const categoryAccents = {
  'Web Development': '#58a6ff',
  'Mobile Apps':     '#a371f7',
  'Data Science':    '#3fb950',
  'UI/UX Design':    '#f778ba',
  'Cloud Computing': '#ffa657',
  'AI & ML':         '#ff7b72',
};
const getAccent = (cat) => categoryAccents[cat] || '#7d8590';

/* ── Cohort card ── */
function CohortCard({ cohort, onClick }) {
  const accent = getAccent(cohort.category);
  const date = cohort.createdAt
    ? new Date(cohort.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  return (
    <motion.button
      variants={rise}
      onClick={onClick}
      className="group w-full text-left bg-[#0d1117] border border-[#21262d] rounded-2xl p-5 hover:border-[#30363d] transition-all duration-300 flex flex-col gap-4 hover:shadow-xl hover:shadow-black/30 relative overflow-hidden"
    >
      {/* Accent glow */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ background: accent }} />

      {/* Header */}
      <div className="flex items-start gap-3 relative">
        <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border transition-colors"
          style={{ background: `${accent}12`, borderColor: `${accent}25` }}>
          <CalendarClock className="w-5 h-5" style={{ color: accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-[#e6edf3] mb-1.5 line-clamp-2 leading-snug group-hover:text-white transition-colors">
            {cohort.title}
          </h2>
          <p className="text-xs text-[#7d8590] font-mono line-clamp-3 leading-relaxed">
            {cohort.description}
          </p>
        </div>
        <ArrowUpRight className="w-4 h-4 text-[#484f58] group-hover:text-[#58a6ff] opacity-0 group-hover:opacity-100 shrink-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200" />
      </div>

      {/* Footer meta */}
      <div className="flex items-center justify-between pt-3 border-t border-[#21262d]">
        {cohort.category && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-mono uppercase tracking-wider"
            style={{ color: accent, borderColor: `${accent}30`, background: `${accent}0d` }}>
            <Tag className="w-2.5 h-2.5" />
            {cohort.category}
          </span>
        )}
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#484f58] ml-auto">
          <Clock className="w-3 h-3" />
          {date}
        </span>
      </div>
    </motion.button>
  );
}

/* ── Main ── */
export default function UpcomingCohorts() {
  const navigate = useNavigate();
  const [cohorts, setCohorts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await cohortAPI.getUpcomingCohorts();
        setCohorts(response.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load upcoming cohorts.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <div className="min-h-screen bg-[#010409] text-[#e6edf3]">
      <LoggedInNavbar />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(31,111,235,0.07),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1f6feb]/30 to-transparent" />
        <div className="absolute inset-0 opacity-[0.012]"
          style={{ backgroundImage: 'linear-gradient(#58a6ff 1px,transparent 1px),linear-gradient(90deg,#58a6ff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* ── Hero ── */}
      <section className="pt-28 pb-12 px-6 md:px-16 lg:px-24 xl:px-32">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-4 h-4 text-[#58a6ff]" />
            <span className="text-[#7d8590] text-xs font-mono uppercase tracking-widest">upcoming</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#e6edf3] tracking-tight mb-2">
                Coming{' '}
                <span className="relative inline-block">
                  <span className="text-[#58a6ff]">Soon</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-[#1f6feb] to-transparent" />
                </span>
              </h1>
              <p className="text-[#7d8590] font-mono text-sm max-w-lg">
                Sneak peek at future cohorts launching soon. Register your interest early.
              </p>
            </div>

            {/* Live count */}
            {!isLoading && cohorts.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#0d1117] border border-[#21262d] rounded-xl shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffa657] animate-pulse" />
                <span className="text-xs font-mono text-[#7d8590]">
                  <span className="text-[#e6edf3] font-semibold">{cohorts.length}</span> cohort{cohorts.length !== 1 ? 's' : ''} announced
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* ── Grid ── */}
      <section className="px-6 md:px-16 lg:px-24 xl:px-32 pb-24">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div key="loading" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 gap-4"
              >
                <div className="p-4 bg-[#f85149]/5 border border-[#f85149]/20 rounded-2xl">
                  <AlertCircle className="w-8 h-8 text-[#f85149]" />
                </div>
                <p className="text-[#f85149] font-mono text-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-xl text-sm font-mono transition-colors"
                >
                  Try again
                </button>
              </motion.div>
            ) : cohorts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 gap-3"
              >
                <div className="p-5 bg-[#0d1117] border border-[#21262d] border-dashed rounded-2xl mb-2">
                  <CalendarClock className="w-8 h-8 text-[#30363d]" />
                </div>
                <p className="text-[#e6edf3] font-semibold text-sm">Nothing announced yet</p>
                <p className="text-[#7d8590] text-xs font-mono text-center max-w-xs">
                  New cohort batches will appear here once announced. Check back soon.
                </p>
                <button
                  onClick={() => navigate('/explore')}
                  className="mt-3 px-5 py-2.5 bg-[#1f6feb] hover:bg-[#388bfd] rounded-xl text-sm font-semibold transition-colors"
                >
                  Browse Active Cohorts
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {cohorts.map((cohort) => (
                  <CohortCard
                    key={cohort._id}
                    cohort={cohort}
                    onClick={() => navigate(`/cohort/${cohort._id}`)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom CTA */}
          {!isLoading && !error && cohorts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-[#0d1117] border border-[#21262d] rounded-2xl"
            >
              <div>
                <p className="text-sm font-semibold text-[#e6edf3]">Want to start learning now?</p>
                <p className="text-xs font-mono text-[#7d8590]">Browse cohorts that are already open for enrollment.</p>
              </div>
              <button
                onClick={() => navigate('/explore')}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1f6feb] hover:bg-[#388bfd] rounded-xl text-sm font-semibold transition-all shrink-0 shadow-lg shadow-[#1f6feb]/10 hover:shadow-[#1f6feb]/20 active:scale-[0.98]"
              >
                Explore Active Cohorts
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}