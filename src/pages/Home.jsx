import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Code, Users, Zap, Award, TrendingUp,
  ChevronRight, Play, Star, Lock, Globe, MessageSquare,
  ArrowUpRight, Terminal, Cpu, Layers, Activity,
} from 'lucide-react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import Footer from '../components/footer';
import { cohortAPI } from '../services/api';

/* ─── Reusable atoms ──────────────────────────────────────── */
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const rise = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const categoryStyleMap = {
  'Web Development':  { icon: Code,        accent: '#58a6ff', glyph: '</>' },
  'Mobile Apps':      { icon: Globe,       accent: '#a371f7', glyph: '◈'  },
  'Data Science':     { icon: TrendingUp,  accent: '#3fb950', glyph: '∑'  },
  'UI/UX Design':     { icon: Layers,      accent: '#f778ba', glyph: '◉'  },
  'Cloud Computing':  { icon: Lock,        accent: '#ffa657', glyph: '⬡'  },
  'AI & ML':          { icon: Cpu,         accent: '#ff7b72', glyph: '⬡'  },
  default:            { icon: BookOpen,    accent: '#7d8590', glyph: '●'  },
};

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <motion.div
      variants={rise}
      className="relative bg-[#0d1117] border border-[#21262d] rounded-2xl p-5 overflow-hidden group hover:border-[#30363d] transition-all duration-300"
    >
      {/* subtle glow */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ background: accent }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-xl" style={{ background: `${accent}18` }}>
            <Icon className="w-4 h-4" style={{ color: accent }} />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#484f58] bg-[#161b22] px-2 py-0.5 rounded-full border border-[#21262d]">live</span>
        </div>
        <p className="text-2xl font-bold text-[#e6edf3] font-mono mb-0.5">{value}</p>
        <p className="text-xs text-[#7d8590] uppercase tracking-wider">{label}</p>
      </div>
    </motion.div>
  );
}

function CourseCard({ course, idx, onClick }) {
  const CourseIcon = course.icon;
  return (
    <motion.div
      variants={rise}
      onClick={onClick}
      className="group bg-[#0d1117] border border-[#21262d] rounded-2xl overflow-hidden hover:border-[#30363d] hover:shadow-xl hover:shadow-black/40 transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative h-36 overflow-hidden flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${course.accent}22, ${course.accent}08)` }}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#e6edf3 1px, transparent 1px), linear-gradient(90deg, #e6edf3 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <span className="text-6xl font-bold opacity-10 font-mono select-none" style={{ color: course.accent }}>
          {course.glyph}
        </span>
        <CourseIcon className="absolute w-10 h-10 opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-300"
          style={{ color: course.accent }} />
        <div className="absolute top-3 right-3 bg-[#0d1117]/80 backdrop-blur-sm border border-[#21262d] rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="w-3 h-3 fill-current text-[#e6edf3]" />
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border"
            style={{ color: course.accent, borderColor: `${course.accent}40`, background: `${course.accent}15` }}>
            {course.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#e6edf3] mb-3 line-clamp-2 leading-snug">{course.title}</h3>
        <div className="flex items-center justify-between text-xs border-t border-[#21262d] pt-3">
          <div className="flex items-center gap-1 text-[#d29922]">
            <Star className="w-3 h-3 fill-current" />
            <span className="font-mono text-[#e6edf3]">{course.rating}</span>
          </div>
          <span className="text-[#484f58] font-mono">{course.students.toLocaleString()} enrolled</span>
          <ArrowUpRight className="w-3 h-3 text-[#484f58] group-hover:text-[#58a6ff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}

function CategoryPill({ name, style, onClick }) {
  const Icon = style.icon;
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group flex flex-col items-center gap-2 p-5 bg-[#0d1117] border border-[#21262d] rounded-2xl hover:border-[#30363d] transition-all duration-200 cursor-pointer"
    >
      <div className="p-2.5 rounded-xl transition-colors" style={{ background: `${style.accent}18` }}>
        <Icon className="w-5 h-5 transition-colors" style={{ color: style.accent }} />
      </div>
      <span className="text-xs font-medium text-[#7d8590] group-hover:text-[#e6edf3] transition-colors text-center leading-tight">{name}</span>
    </motion.button>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
export default function Home() {
  const [user, setUser] = useState(null);
  const [allCohorts, setAllCohorts] = useState([]);
  const [enrolledCohorts, setEnrolledCohorts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [progressMap, setProgressMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const userData = localStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      setIsLoading(true);
      try {
        const [allRes, enrolledRes] = await Promise.all([
          cohortAPI.getAllCohorts(),
          cohortAPI.getUserEnrolledCohorts().catch(() => ({ data: [] })),
        ]);
        setAllCohorts(allRes.data || []);
        setEnrolledCohorts(enrolledRes.data || []);
        setProgressMap(JSON.parse(localStorage.getItem('cohortProgress') || '{}'));
      } catch (err) {
        setError(err.message || 'Failed to load dashboard.');
      } finally {
        setIsLoading(false);
        window.scrollTo(0, 0);
      }
    };
    init();
  }, [navigate]);

  const categoryList = useMemo(() => {
    const names = new Set(allCohorts.map((c) => c.category).filter(Boolean));
    return names.size === 0
      ? ['Web Development', 'Mobile Apps', 'Data Science', 'UI/UX Design', 'Cloud Computing', 'AI & ML']
      : Array.from(names);
  }, [allCohorts]);

  const quickStats = useMemo(() => [
    { icon: BookOpen,   label: 'Enrolled',       value: String(enrolledCohorts.length),                                                          accent: '#58a6ff' },
    { icon: Award,      label: 'Active Cohorts',  value: String(allCohorts.length),                                                               accent: '#a371f7' },
    { icon: Users,      label: 'Community',       value: String(new Set(allCohorts.flatMap((c) => c.enrolledUsers || [])).size || 0),              accent: '#3fb950' },
    { icon: Activity,   label: 'Status',          value: enrolledCohorts.length > 0 ? 'Active' : 'Start now',                                     accent: '#ffa657' },
  ], [allCohorts, enrolledCohorts]);

  const courses = useMemo(() => {
    const base = enrolledCohorts.length > 0 ? enrolledCohorts : allCohorts;
    return (base || []).slice(0, 4).map((cohort) => {
      const style = categoryStyleMap[cohort.category] || categoryStyleMap.default;
      return {
        id: cohort._id,
        title: cohort.title,
        category: cohort.category || 'General',
        students: (cohort.enrolledUsers || []).length,
        rating: 4.8,
        icon: style.icon,
        accent: style.accent,
        glyph: style.glyph,
        progress: typeof progressMap[cohort._id] === 'number' ? Math.min(Math.max(progressMap[cohort._id], 0), 100) : 0,
      };
    });
  }, [allCohorts, enrolledCohorts, progressMap]);

  const firstName = user?.fullName?.split(' ')[0] || 'Learner';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#010409] flex flex-col">
        <LoggedInNavbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-[#1f6feb]/20"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#58a6ff] animate-spin"></div>
          </div>
          <p className="text-[#7d8590] text-xs uppercase tracking-widest font-mono">Initializing dashboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010409] text-[#e6edf3]">
      <LoggedInNavbar />

      {/* Fixed background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(31,111,235,0.07),transparent)]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1f6feb]/30 to-transparent"></div>
        <div className="absolute inset-0 opacity-[0.012]"
          style={{ backgroundImage: 'linear-gradient(#58a6ff 1px, transparent 1px), linear-gradient(90deg, #58a6ff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-28 pb-16 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">

          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-[#58a6ff]" />
              <span className="text-[#7d8590] text-xs font-mono uppercase tracking-widest">dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#e6edf3] tracking-tight mb-3">
              Welcome back,{' '}
              <span className="relative inline-block">
                <span className="text-[#58a6ff]">{firstName}</span>
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-[#1f6feb] to-transparent"></span>
              </span>
            </h1>
            <p className="text-[#7d8590] text-base max-w-xl font-mono leading-relaxed">
              Pick up where you left off — your cohorts and community are waiting.
            </p>
          </motion.div>

          {/* Stats */}
          {error ? (
            <div className="mb-10 p-4 bg-[#f85149]/5 border border-[#f85149]/20 rounded-xl text-[#f85149] text-sm font-mono">{error}</div>
          ) : (
            <motion.div
              variants={stagger} initial="hidden" animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
            >
              {quickStats.map((s) => <StatCard key={s.label} {...s} />)}
            </motion.div>
          )}

          {/* Continue Learning */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-[#1f6feb] rounded-full"></div>
                <h2 className="text-lg font-semibold text-[#e6edf3]">
                  {enrolledCohorts.length > 0 ? 'Continue Learning' : 'Explore Cohorts'}
                </h2>
              </div>
              <button
                onClick={() => navigate('/explore')}
                className="flex items-center gap-1.5 text-xs text-[#58a6ff] hover:text-[#79c0ff] font-mono uppercase tracking-wider transition-colors group"
              >
                View all <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-[#0d1117] border border-[#21262d] border-dashed rounded-2xl">
                <BookOpen className="w-8 h-8 text-[#30363d] mb-3" />
                <p className="text-[#7d8590] text-sm font-mono">No cohorts available yet</p>
                <button onClick={() => navigate('/explore')}
                  className="mt-4 px-4 py-2 bg-[#1f6feb] hover:bg-[#388bfd] rounded-lg text-sm font-semibold transition-colors">
                  Browse Courses
                </button>
              </div>
            ) : (
              <motion.div variants={stagger} initial="hidden" animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {courses.map((course, idx) => (
                  <CourseCard key={course.id} course={course} idx={idx}
                    onClick={() => navigate(`/cohort/${course.id}`)} />
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-5 bg-[#a371f7] rounded-full"></div>
              <h2 className="text-lg font-semibold text-[#e6edf3]">Explore Categories</h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {categoryList.map((name) => {
                const style = categoryStyleMap[name] || categoryStyleMap.default;
                return (
                  <CategoryPill key={name} name={name} style={style}
                    onClick={() => navigate(`/explore?category=${encodeURIComponent(name)}`)} />
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us ───────────────────────────────────── */}
      <section className="py-20 px-6 md:px-16 lg:px-24 mt-8">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 bg-[#3fb950] rounded-full"></div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#7d8590]">Platform benefits</span>
            </div>
            <h2 className="text-2xl font-bold text-[#e6edf3]">Why learn with us?</h2>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { icon: MessageSquare, accent: '#58a6ff', title: 'Community Support', desc: 'Connect with thousands of learners. Get unblocked fast with peer and mentor help in dedicated channels.' },
              { icon: Zap,           accent: '#a371f7', title: 'Flexible Learning',  desc: 'Self-paced cohorts with lifetime access. Learn on your schedule without falling behind.' },
              { icon: TrendingUp,    accent: '#3fb950', title: 'Career Growth',       desc: 'Real-world projects, portfolio reviews, and direct access to hiring partners.' },
            ].map(({ icon: Icon, accent, title, desc }) => (
              <motion.div key={title} variants={rise}
                className="group relative bg-[#0d1117] border border-[#21262d] rounded-2xl p-6 hover:border-[#30363d] transition-all duration-300 overflow-hidden">
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ background: accent }} />
                <div className="relative">
                  <div className="p-2.5 rounded-xl w-fit mb-4" style={{ background: `${accent}18` }}>
                    <Icon className="w-5 h-5" style={{ color: accent }} />
                  </div>
                  <h3 className="font-semibold text-[#e6edf3] mb-2">{title}</h3>
                  <p className="text-sm text-[#7d8590] leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA strip ───────────────────────────────────────── */}
      <section className="py-16 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-[#0d1117] border border-[#21262d] rounded-2xl p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_0%_50%,rgba(31,111,235,0.06),transparent)]"></div>
            <div className="relative">
              <p className="text-xs font-mono uppercase tracking-widest text-[#7d8590] mb-2">Ready to level up?</p>
              <h3 className="text-2xl font-bold text-[#e6edf3]">Start your next cohort today</h3>
              <p className="text-[#7d8590] text-sm mt-1">Join thousands of learners accelerating their careers.</p>
            </div>
            <div className="relative flex gap-3 shrink-0">
              <button
                onClick={() => navigate('/explore')}
                className="px-5 py-2.5 bg-[#1f6feb] hover:bg-[#388bfd] rounded-xl font-semibold text-sm text-white transition-all shadow-lg shadow-[#1f6feb]/20 hover:shadow-[#1f6feb]/30 active:scale-[0.98]"
              >
                Browse Cohorts
              </button>
              
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}