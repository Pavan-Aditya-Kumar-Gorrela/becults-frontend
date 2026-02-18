import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Play, BookOpen, Users, AlertCircle, Loader,
  RefreshCw, Link as LinkIcon, ExternalLink, Clock,
  Maximize2, Settings, ChevronRight, Image as ImageIcon,
  FileText, Terminal, GraduationCap, Video, BarChart2,
} from 'lucide-react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import Footer from '../components/footer';
import CommunityChannel from '../components/CommunityChannel';
import { cohortAPI } from '../services/api';

/* ─── Shared design tokens ─────────────────────────────────── */
const rise = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ─── Helpers ──────────────────────────────────────────────── */
function convertYoutubeUrl(url) {
  if (!url) return null;
  let videoId = '';
  if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
  else if (url.includes('youtube.com')) {
    try { videoId = new URLSearchParams(new URL(url).search).get('v'); } catch { return null; }
  }
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1`;
}

/* ─── Sub-components ───────────────────────────────────────── */
function StatTile({ label, value, accent = '#58a6ff' }) {
  return (
    <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4 group hover:border-[#30363d] transition-colors">
      <p className="text-[10px] uppercase tracking-widest text-[#7d8590] mb-1 font-mono">{label}</p>
      <p className="text-xl font-bold font-mono" style={{ color: accent }}>{value}</p>
    </div>
  );
}

function LessonRow({ item, isSelected, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left px-3 py-3 rounded-xl mb-1 transition-all duration-200 group border ${
        isSelected
          ? 'bg-[#1f6feb]/10 border-[#1f6feb]/30 text-[#e6edf3]'
          : 'bg-transparent border-transparent hover:bg-[#161b22] hover:border-[#21262d] text-[#7d8590]'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* type icon */}
        <div className={`shrink-0 mt-0.5 p-1.5 rounded-lg transition-colors ${
          isSelected
            ? item.type === 'video' ? 'bg-[#a371f7]/15 text-[#a371f7]' : 'bg-[#58a6ff]/15 text-[#58a6ff]'
            : 'bg-[#21262d] text-[#484f58] group-hover:text-[#7d8590]'
        }`}>
          {item.type === 'video'
            ? <Play className="w-3 h-3" />
            : <BookOpen className="w-3 h-3" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[10px] font-mono font-semibold ${
              isSelected
                ? item.type === 'video' ? 'text-[#a371f7]' : 'text-[#58a6ff]'
                : 'text-[#484f58]'
            }`}>#{item.lessonNumber}</span>
            <span className={`text-[10px] uppercase tracking-wider font-mono ${
              isSelected ? 'text-[#7d8590]' : 'text-[#30363d]'
            }`}>{item.type}</span>
            {item.duration && (
              <span className="text-[10px] font-mono text-[#484f58] flex items-center gap-1 ml-auto">
                <Clock className="w-2.5 h-2.5" />{item.duration}
              </span>
            )}
          </div>
          <p className={`text-xs font-semibold line-clamp-2 leading-snug ${
            isSelected ? 'text-[#e6edf3]' : 'text-[#7d8590] group-hover:text-[#c9d1d9]'
          }`}>{item.title}</p>
        </div>

        {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#58a6ff] shrink-0 mt-1" />}
      </div>
    </motion.button>
  );
}

/* ─── Main ─────────────────────────────────────────────────── */
export default function CohortDetail() {
  const { cohortId } = useParams();
  const navigate = useNavigate();
  const [cohort, setCohort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('curriculum');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lastFetchTimeRef = useRef(0);

  const fetchCohortDetails = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await cohortAPI.getCohortDetails(cohortId);
      setCohort(response.data || response);
      setError(null);
      lastFetchTimeRef.current = Date.now();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch cohort details';
      setError(msg);
      if (err.response?.status === 403) setTimeout(() => navigate('/explore'), 2000);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [cohortId, navigate]);

  useEffect(() => { fetchCohortDetails(); }, [fetchCohortDetails]);

  useEffect(() => {
    const check = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastFetchTimeRef.current > 5000)
        fetchCohortDetails(false);
    };
    document.addEventListener('visibilitychange', check);
    window.addEventListener('focus', check);
    return () => { document.removeEventListener('visibilitychange', check); window.removeEventListener('focus', check); };
  }, [fetchCohortDetails]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCohortDetails(false);
    setRefreshing(false);
  };

  const curriculumItems = useMemo(() => {
    if (!cohort) return [];
    const sortedRoadmap = [...(cohort.roadmap || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    const sortedVideos  = [...(cohort.videos  || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    const items = [];
    let n = 1;
    sortedRoadmap.forEach((item) => {
      if (item.references?.length > 0)
        items.push({ id: `roadmap-${item._id}`, type: 'reading', title: item.title, description: item.description, references: item.references, order: item.order || n, lessonNumber: n++ });
    });
    sortedVideos.forEach((video) => {
      items.push({ id: `video-${video._id}`, type: 'video', title: video.title, videoUrl: video.videoUrl, duration: video.duration, order: video.order || n, lessonNumber: n++ });
    });
    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [cohort]);

  useEffect(() => {
    if (curriculumItems.length > 0 && !selectedLesson) {
      setSelectedLesson(curriculumItems.find(i => i.type === 'video') || curriculumItems[0]);
    }
  }, [curriculumItems, selectedLesson]);

  // Fullscreen
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
      .forEach(e => document.addEventListener(e, onChange));
    return () => ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
      .forEach(e => document.removeEventListener(e, onChange));
  }, []);

  const handleFullscreen = () => {
    const el = document.getElementById('video-player-container');
    if (!isFullscreen) {
      (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen)?.call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen)?.call(document);
    }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#010409] flex flex-col">
      <LoggedInNavbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-[#1f6feb]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#58a6ff] animate-spin" />
        </div>
        <p className="text-[#7d8590] text-xs font-mono uppercase tracking-widest">Loading cohort...</p>
      </div>
      <Footer />
    </div>
  );

  /* ── Error ── */
  if (error && !cohort) return (
    <div className="min-h-screen bg-[#010409] flex flex-col">
      <LoggedInNavbar />
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#0d1117] border border-[#f85149]/20 rounded-2xl p-8 text-center">
          <div className="p-4 bg-[#f85149]/5 rounded-2xl w-fit mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-[#f85149]" />
          </div>
          <h2 className="text-lg font-bold text-[#e6edf3] mb-2">Access Denied</h2>
          <p className="text-[#7d8590] text-sm font-mono mb-6">{error}</p>
          <button onClick={() => navigate('/explore')}
            className="px-5 py-2.5 bg-[#1f6feb] hover:bg-[#388bfd] rounded-xl font-semibold text-sm text-white transition-all">
            Back to Explore
          </button>
        </motion.div>
      </div>
      <Footer />
    </div>
  );

  if (!cohort) return null;

  const tabs = [
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'community',  label: 'Community',  icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#010409] text-[#e6edf3]">
      <LoggedInNavbar />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_30%_at_50%_0%,rgba(31,111,235,0.06),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1f6feb]/30 to-transparent" />
        <div className="absolute inset-0 opacity-[0.012]"
          style={{ backgroundImage: 'linear-gradient(#58a6ff 1px,transparent 1px),linear-gradient(90deg,#58a6ff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* ── Hero header ──────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-24 pb-8 px-6 md:px-10 border-b border-[#21262d]"
      >
        <div className="max-w-screen-xl mx-auto">
          {/* Back + refresh */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate('/explore')}
              className="flex items-center gap-2 text-[#7d8590] hover:text-[#e6edf3] transition-colors text-sm font-mono group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              back to explore
            </button>
            <button onClick={handleRefresh} disabled={refreshing}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#0d1117] hover:bg-[#161b22] border border-[#21262d] rounded-lg text-xs font-mono text-[#7d8590] hover:text-[#e6edf3] transition-all disabled:opacity-40">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              refresh
            </button>
          </div>

          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-3.5 h-3.5 text-[#58a6ff]" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#7d8590]">cohort</span>
                {cohort.category && (
                  <>
                    <span className="text-[#30363d]">/</span>
                    <span className="text-[10px] font-mono text-[#58a6ff]">{cohort.category}</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#e6edf3] tracking-tight mb-3 leading-tight">
                {cohort.title}
              </h1>
              <p className="text-[#7d8590] text-sm leading-relaxed max-w-2xl font-mono">{cohort.description}</p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatTile label="Students" value={cohort.enrolledUsers?.length || 0} accent="#58a6ff" />
            <StatTile label="Instructor" value={cohort.createdBy?.fullName || 'Instructor'} accent="#e6edf3" />
            <StatTile label="Lessons" value={cohort.roadmap?.length || 0} accent="#3fb950" />
            <StatTile label="Videos" value={cohort.videos?.length || 0} accent="#a371f7" />
          </div>
        </div>
      </motion.section>

      {/* ── Sticky Tab Bar ───────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-[#010409]/95 backdrop-blur-md border-b border-[#21262d]">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 flex gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-2 px-4 py-3.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                activeTab === id ? 'text-[#58a6ff]' : 'text-[#7d8590] hover:text-[#c9d1d9]'
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {label}
              {activeTab === id && (
                <motion.div layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-px bg-[#1f6feb]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* CURRICULUM */}
          {activeTab === 'curriculum' && (
            <div className="flex h-[calc(100vh-180px)]">

              {/* Sidebar */}
              <div className="w-72 shrink-0 bg-[#0d1117] border-r border-[#21262d] flex flex-col overflow-hidden">
                {/* Sidebar header */}
                <div className="px-4 py-4 border-b border-[#21262d] sticky top-0 bg-[#0d1117] z-10">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-1 h-4 bg-[#1f6feb] rounded-full" />
                    <h3 className="text-sm font-semibold text-[#e6edf3]">Curriculum</h3>
                  </div>
                  <p className="text-[10px] font-mono text-[#7d8590] pl-3">
                    {curriculumItems.length} {curriculumItems.length === 1 ? 'lesson' : 'lessons'}
                  </p>
                </div>

                {/* Lesson list */}
                <div className="flex-1 overflow-y-auto p-2">
                  {curriculumItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
                      <GraduationCap className="w-8 h-8 text-[#7d8590]" />
                      <p className="text-xs font-mono text-[#7d8590]">No lessons yet</p>
                    </div>
                  ) : (
                    curriculumItems.map((item) => (
                      <LessonRow
                        key={item.id}
                        item={item}
                        isSelected={selectedLesson?.id === item.id}
                        onClick={() => setSelectedLesson(item)}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Main content area */}
              <div className="flex-1 flex flex-col bg-[#010409] overflow-hidden">
                {selectedLesson ? (
                  <>
                    {/* VIDEO */}
                    {selectedLesson.type === 'video' && (
                      <>
                        {/* Player */}
                        <div id="video-player-container"
                          className={`relative bg-black ${isFullscreen ? 'h-screen' : 'aspect-video'} transition-all shrink-0`}>
                          {convertYoutubeUrl(selectedLesson.videoUrl) ? (
                            <iframe
                              key={selectedLesson.id}
                              src={convertYoutubeUrl(selectedLesson.videoUrl)}
                              title={selectedLesson.title}
                              className="w-full h-100"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <div className="w-100 h-100 flex items-center justify-center">
                              <div className="text-center">
                                <Video className="w-12 h-20 text-[#30363d] mx-auto mb-3" />
                                <p className="text-[#7d8590] text-sm font-mono">Invalid video URL</p>
                              </div>
                            </div>
                          )}

                          {/* Controls overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button onClick={handleFullscreen}
                                  className="p-2 bg-[#0d1117]/80 hover:bg-[#21262d] border border-[#21262d] rounded-lg text-[#e6edf3] transition">
                                  <Maximize2 className="w-4 h-4" />
                                </button>
                                {/* Speed picker */}
                                <div className="relative group/speed">
                                  <button className="flex items-center gap-1.5 p-2 bg-[#0d1117]/80 hover:bg-[#21262d] border border-[#21262d] rounded-lg text-[#e6edf3] transition text-xs font-mono">
                                    <Settings className="w-4 h-4" />
                                    {playbackRate}×
                                  </button>
                                  <div className="absolute bottom-full left-0 mb-2 bg-[#0d1117] border border-[#21262d] rounded-xl shadow-2xl overflow-hidden opacity-0 pointer-events-none group-hover/speed:opacity-100 group-hover/speed:pointer-events-auto transition-opacity">
                                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                                      <button key={rate} onClick={() => setPlaybackRate(rate)}
                                        className={`block w-full text-left px-4 py-2 text-xs font-mono transition ${
                                          playbackRate === rate
                                            ? 'bg-[#1f6feb]/20 text-[#58a6ff]'
                                            : 'text-[#7d8590] hover:bg-[#161b22] hover:text-[#e6edf3]'
                                        }`}>
                                        {rate}×
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {selectedLesson.duration && (
                                <span className="flex items-center gap-1.5 text-xs font-mono text-[#7d8590]">
                                  <Clock className="w-3 h-3" />{selectedLesson.duration}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Video info */}
                        <div className="flex-1 overflow-y-auto p-6">
                          <div className="max-w-3xl">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="px-2 py-1 bg-[#a371f7]/10 border border-[#a371f7]/20 rounded-lg text-[10px] font-mono font-semibold text-[#a371f7] uppercase tracking-wider">
                                Lesson {selectedLesson.lessonNumber}
                              </span>
                              <span className="text-[#484f58] text-[10px] font-mono uppercase tracking-wider">video tutorial</span>
                            </div>
                            <h2 className="text-xl font-bold text-[#e6edf3] mb-2">{selectedLesson.title}</h2>
                          </div>
                        </div>
                      </>
                    )}

                    {/* READING */}
                    {selectedLesson.type === 'reading' && (
                      <div className="flex-1 overflow-y-auto p-8">
                        <div className="max-w-3xl">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="px-2 py-1 bg-[#58a6ff]/10 border border-[#58a6ff]/20 rounded-lg text-[10px] font-mono font-semibold text-[#58a6ff] uppercase tracking-wider">
                              Lesson {selectedLesson.lessonNumber}
                            </span>
                            <span className="text-[#484f58] text-[10px] font-mono uppercase tracking-wider">reading material</span>
                          </div>
                          <h2 className="text-2xl font-bold text-[#e6edf3] mb-4">{selectedLesson.title}</h2>
                          <p className="text-[#7d8590] leading-relaxed font-mono text-sm mb-8">{selectedLesson.description}</p>

                          {selectedLesson.references?.length > 0 && (
                            <div className="border-t border-[#21262d] pt-6">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-4 bg-[#58a6ff] rounded-full" />
                                <h3 className="text-sm font-semibold text-[#e6edf3]">References</h3>
                                <span className="text-[10px] font-mono text-[#484f58] bg-[#21262d] px-2 py-0.5 rounded-full">
                                  {selectedLesson.references.length}
                                </span>
                              </div>
                              <div className="space-y-2">
                                {selectedLesson.references.map((ref, i) => {
                                  const isUrl = /^https?:\/\//i.test(ref);
                                  return (
                                    <a key={i}
                                      href={isUrl ? ref : '#'}
                                      target={isUrl ? '_blank' : undefined}
                                      rel={isUrl ? 'noopener noreferrer' : undefined}
                                      className="flex items-center gap-3 p-3 bg-[#0d1117] hover:bg-[#161b22] border border-[#21262d] hover:border-[#30363d] rounded-xl transition-all group"
                                    >
                                      <ExternalLink className="w-4 h-4 text-[#58a6ff] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                      <span className="text-sm font-mono text-[#7d8590] group-hover:text-[#e6edf3] transition-colors flex-1 truncate">{ref}</span>
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-40">
                    <GraduationCap className="w-12 h-12 text-[#30363d]" />
                    <p className="text-[#7d8590] text-sm font-mono">Select a lesson to get started</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RESOURCES (kept for when tab is added back) */}
          {activeTab === 'resources' && (
            <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-5 bg-[#ffa657] rounded-full" />
                <h2 className="text-lg font-semibold text-[#e6edf3]">Resources</h2>
              </div>
              {cohort.resources?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cohort.resources.sort((a, b) => (a.order || 0) - (b.order || 0)).map((res) => {
                    const isUrl = /^https?:\/\//i.test(res.url);
                    const Icon = res.type === 'image' ? ImageIcon : res.type === 'pdf' || res.type === 'document' ? FileText : LinkIcon;
                    const accent = res.type === 'image' ? '#58a6ff' : res.type === 'pdf' ? '#a371f7' : '#7d8590';
                    return (
                      <a key={res._id} href={isUrl ? res.url : '#'} target={isUrl ? '_blank' : undefined}
                        rel={isUrl ? 'noopener noreferrer' : undefined}
                        className="flex flex-col gap-3 p-4 bg-[#0d1117] hover:bg-[#161b22] border border-[#21262d] hover:border-[#30363d] rounded-xl transition-all group">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg" style={{ background: `${accent}18` }}>
                            <Icon className="w-4 h-4" style={{ color: accent }} />
                          </div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#7d8590]">{res.type}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#c9d1d9] group-hover:text-[#e6edf3] transition-colors mb-1 line-clamp-2">{res.title}</p>
                          {res.description && <p className="text-xs text-[#7d8590] line-clamp-2 font-mono">{res.description}</p>}
                        </div>
                        <p className="text-[10px] text-[#484f58] font-mono truncate">{res.url}</p>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-[#0d1117] border border-[#21262d] border-dashed rounded-2xl gap-3">
                  <LinkIcon className="w-8 h-8 text-[#30363d]" />
                  <p className="text-[#7d8590] text-sm font-mono">No resources yet</p>
                  <p className="text-[#484f58] text-xs font-mono text-center max-w-xs">Your instructor will add learning resources here.</p>
                </div>
              )}
            </div>
          )}

          {/* COMMUNITY */}
          {activeTab === 'community' && (
            <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-5 bg-[#3fb950] rounded-full" />
                <h2 className="text-lg font-semibold text-[#e6edf3]">Community</h2>
              </div>
              <CommunityChannel cohortId={cohortId} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <Footer />
    </div>
  );
}