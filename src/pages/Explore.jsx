import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Telescope, AlertCircle } from 'lucide-react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import Footer from '../components/footer';
import CohortCard from '../components/CohortCard';
import { cohortAPI } from '../services/api';

const CATEGORIES = [
  'All',
  'Web Development',
  'Mobile Apps',
  'Data Science',
  'UI/UX Design',
  'Cloud Computing',
  'AI & ML',
  'Python',
  'JavaScript',
  'React',
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const rise = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* Skeleton card */
function SkeletonCard() {
  return (
    <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl overflow-hidden">
      <div className="h-36 bg-[#161b22] animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-[#21262d] rounded-full animate-pulse" />
        <div className="h-4 w-3/4 bg-[#21262d] rounded-full animate-pulse" />
        <div className="h-3 w-full bg-[#21262d] rounded-full animate-pulse" />
        <div className="h-3 w-5/6 bg-[#21262d] rounded-full animate-pulse" />
        <div className="flex justify-between pt-2">
          <div className="h-3 w-16 bg-[#21262d] rounded-full animate-pulse" />
          <div className="h-7 w-20 bg-[#21262d] rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function Explore() {
  const navigate = useNavigate();
  const [cohorts, setCohorts] = useState([]);
  const [enrolledCohortIds, setEnrolledCohortIds] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCohorts();
    fetchUserEnrolledCohorts();
  }, []);

  const fetchCohorts = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await cohortAPI.getAllCohorts(selectedCategory);
      setCohorts(response.data || []);
    } catch (err) {
      setError('Failed to load cohorts. Please try again.');
      setCohorts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserEnrolledCohorts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await cohortAPI.getUserEnrolledCohorts();
      setEnrolledCohortIds(new Set(response.data?.map((c) => c._id) || []));
    } catch (err) { /* silent */ }
  };

  useEffect(() => { fetchCohorts(); }, [selectedCategory]);

  const handleEnroll = async (cohortId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      setEnrollingId(cohortId);
      await cohortAPI.enrollInCohort(cohortId);
      setEnrolledCohortIds((prev) => new Set([...prev, cohortId]));
    } catch (err) {
      alert(err.message || 'Failed to enroll in cohort');
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCohorts = cohorts.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasFilters = searchTerm || selectedCategory !== 'All';

  return (
    <div className="min-h-screen bg-[#010409] text-[#e6edf3]">
      <LoggedInNavbar />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(31,111,235,0.07),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1f6feb]/30 to-transparent" />
        <div className="absolute inset-0 opacity-[0.012]"
          style={{ backgroundImage: 'linear-gradient(#58a6ff 1px, transparent 1px), linear-gradient(90deg, #58a6ff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-28 pb-12 px-6 md:px-16 lg:px-24 xl:px-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-3">
            <Telescope className="w-4 h-4 text-[#58a6ff]" />
            <span className="text-[#7d8590] text-xs font-mono uppercase tracking-widest">explore</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#e6edf3] tracking-tight mb-2">
                Browse{' '}
                <span className="relative inline-block">
                  <span className="text-[#58a6ff]">Cohorts</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-[#1f6feb] to-transparent" />
                </span>
              </h1>
              <p className="text-[#7d8590] font-mono text-sm max-w-lg">
                Discover structured learning cohorts led by experts. Join, collaborate, and level up.
              </p>
            </div>
            {/* Live count badge */}
            {!isLoading && cohorts.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#0d1117] border border-[#21262d] rounded-xl shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
                <span className="text-xs font-mono text-[#7d8590]">
                  <span className="text-[#e6edf3] font-semibold">{cohorts.length}</span> cohorts available
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* ── Search + Filters ─────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 xl:px-32 mb-10">
        <div className="max-w-7xl mx-auto space-y-4">

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#484f58] w-4 h-4" />
            <input
              type="text"
              placeholder="Search cohorts by title or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-[#0d1117] border border-[#21262d] rounded-xl text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 transition-all duration-200 font-mono text-sm"
            />
            <AnimatePresence>
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#21262d] rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-[#7d8590]" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Category chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide"
          >
            <div className="flex items-center gap-1.5 text-[#7d8590] shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-xs font-mono uppercase tracking-wider">Filter</span>
            </div>
            <div className="w-px h-4 bg-[#21262d] shrink-0" />
            <div className="flex gap-2 shrink-0">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <motion.button
                    key={cat}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 border whitespace-nowrap ${
                      active
                        ? 'bg-[#1f6feb]/10 border-[#1f6feb]/40 text-[#58a6ff]'
                        : 'bg-[#0d1117] border-[#21262d] text-[#7d8590] hover:text-[#e6edf3] hover:border-[#30363d]'
                    }`}
                  >
                    {cat}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Active filters summary */}
          <AnimatePresence>
            {hasFilters && !isLoading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-xs font-mono text-[#7d8590]"
              >
                <span>Showing</span>
                <span className="text-[#e6edf3] font-semibold">{filteredCohorts.length}</span>
                <span>of</span>
                <span className="text-[#e6edf3] font-semibold">{cohorts.length}</span>
                <span>cohorts</span>
                {hasFilters && (
                  <button
                    onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                    className="ml-1 flex items-center gap-1 text-[#58a6ff] hover:text-[#79c0ff] transition-colors"
                  >
                    <X className="w-3 h-3" /> Clear filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Grid ─────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 xl:px-32 pb-24">
        <div className="max-w-7xl mx-auto">

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <div className="p-4 bg-[#f85149]/5 border border-[#f85149]/20 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-[#f85149]" />
              </div>
              <p className="text-[#f85149] font-mono text-sm">{error}</p>
              <button
                onClick={fetchCohorts}
                className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-xl text-sm font-mono transition-colors"
              >
                Try again
              </button>
            </motion.div>
          ) : filteredCohorts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 gap-3"
            >
              <div className="p-5 bg-[#0d1117] border border-[#21262d] border-dashed rounded-2xl mb-2">
                <Search className="w-8 h-8 text-[#30363d]" />
              </div>
              <p className="text-[#e6edf3] font-semibold">No cohorts found</p>
              <p className="text-[#7d8590] text-sm font-mono text-center max-w-xs">
                {hasFilters
                  ? 'Try adjusting your search or filter to find what you\'re looking for.'
                  : 'No cohorts are available yet. Check back soon!'}
              </p>
              {hasFilters && (
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                  className="mt-2 px-4 py-2 bg-[#1f6feb] hover:bg-[#388bfd] rounded-xl text-sm font-semibold transition-colors"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredCohorts.map((cohort) => (
                <motion.div key={cohort._id} variants={rise}>
                  <CohortCard
                    cohort={cohort}
                    isEnrolled={enrolledCohortIds.has(cohort._id)}
                    onEnroll={() => handleEnroll(cohort._id)}
                    isLoading={enrollingId === cohort._id}
                    onCardClick={() => navigate(`/cohort/${cohort._id}`)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Bottom count — non-filtered state */}
          {!isLoading && !error && filteredCohorts.length > 0 && !hasFilters && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-12 text-xs font-mono text-[#484f58]"
            >
              {filteredCohorts.length} cohorts · updated live
            </motion.p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}