import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, BookOpen, Users, AlertCircle, Loader, RefreshCw, Link as LinkIcon, ExternalLink, Clock, CheckCircle2, Circle, Maximize2, Volume2, Settings, ChevronRight } from 'lucide-react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import Footer from '../components/footer';
import CommunityChannel from '../components/CommunityChannel';
import { cohortAPI } from '../services/api';

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
      if (showLoading) {
        setLoading(true);
      }
      const response = await cohortAPI.getCohortDetails(cohortId);
      // Handle API response structure: { success: true, data: {...} }
      const cohortData = response.data || response;
      setCohort(cohortData);
      setError(null);
      lastFetchTimeRef.current = Date.now();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch cohort details';
      setError(errorMessage);
      console.error('Error fetching cohort details:', err);
      
      // Redirect to explore if not enrolled (403)
      if (err.response?.status === 403) {
        setTimeout(() => {
          navigate('/explore');
        }, 2000);
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [cohortId, navigate]);

  useEffect(() => {
    fetchCohortDetails();
  }, [fetchCohortDetails]);

  // Refresh when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Only refresh if it's been more than 5 seconds since last fetch
        const timeSinceLastFetch = Date.now() - lastFetchTimeRef.current;
        if (timeSinceLastFetch > 5000) {
          fetchCohortDetails(false);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchCohortDetails]);

  // Refresh when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      const timeSinceLastFetch = Date.now() - lastFetchTimeRef.current;
      if (timeSinceLastFetch > 5000) {
        fetchCohortDetails(false);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchCohortDetails]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchCohortDetails(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
    } finally {
      setRefreshing(false);
    }
  };

  const convertYoutubeUrl = (url, autoplay = false, controls = true) => {
    if (!url) return null;
    
    let videoId = '';
    
    // Handle youtu.be links
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    // Handle youtube.com links
    else if (url.includes('youtube.com')) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get('v');
    }
    
    if (videoId) {
      const params = new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        controls: controls ? '1' : '0',
        rel: '0',
        modestbranding: '1',
        playsinline: '1',
      });
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    }
    
    return null;
  };

  // Build curriculum items (only show reading materials if they have references)
  const curriculumItems = useMemo(() => {
    if (!cohort) return [];
    
    const sortedRoadmap = [...(cohort.roadmap || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    const sortedVideos = [...(cohort.videos || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    
    const items = [];
    let lessonNumber = 1;
    
    // Add roadmap items only if they have references
    sortedRoadmap.forEach((item) => {
      if (item.references && item.references.length > 0) {
        items.push({
          id: `roadmap-${item._id}`,
          type: 'reading',
          title: item.title,
          description: item.description,
          references: item.references,
          order: item.order || lessonNumber,
          lessonNumber: lessonNumber++,
        });
      }
    });
    
    // Add videos
    sortedVideos.forEach((video) => {
      items.push({
        id: `video-${video._id}`,
        type: 'video',
        title: video.title,
        videoUrl: video.videoUrl,
        duration: video.duration,
        order: video.order || lessonNumber,
        lessonNumber: lessonNumber++,
      });
    });
    
    // Sort by order
    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [cohort]);

  // Set first video as default selected
  useEffect(() => {
    if (curriculumItems.length > 0 && !selectedLesson) {
      const firstVideo = curriculumItems.find(item => item.type === 'video');
      if (firstVideo) {
        setSelectedLesson(firstVideo);
      } else {
        setSelectedLesson(curriculumItems[0]);
      }
    }
  }, [curriculumItems, selectedLesson]);

  const handleFullscreen = () => {
    const videoContainer = document.getElementById('video-player-container');
    if (!isFullscreen) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
      } else if (videoContainer.mozRequestFullScreen) {
        videoContainer.mozRequestFullScreen();
      } else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <LoggedInNavbar />
        <div className="flex items-center justify-center h-[60vh]">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
            <Loader className="w-12 h-12 text-blue-500" />
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && cohort === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <LoggedInNavbar />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/20 border border-red-800 rounded-lg p-8 text-center"
          >
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-slate-300 mb-6">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/explore')}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
            >
              Back to Explore
            </motion.button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cohort) return null;

  const tabs = [
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'community', label: 'Community', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <LoggedInNavbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-12 px-4 border-b border-slate-800"
      >
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </button>

          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full">
                  <span className="text-sm font-semibold text-blue-300">{cohort.category}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh cohort data"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-semibold">Refresh</span>
                </motion.button>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{cohort.title}</h1>
              <p className="text-lg text-slate-300 max-w-3xl">{cohort.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Students Enrolled</p>
                <p className="text-2xl font-bold text-white">{cohort.enrolledUsers?.length || 0}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Created By</p>
                <p className="text-lg font-semibold text-white truncate">{cohort.createdBy?.fullName || 'Instructor'}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Lessons</p>
                <p className="text-2xl font-bold text-white">{cohort.roadmap?.length || 0}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Videos</p>
                <p className="text-2xl font-bold text-white">{cohort.videos?.length || 0}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className={`px-6 py-4 font-semibold transition flex items-center gap-2 whitespace-nowrap border-b-2 ${
                    isActive
                      ? 'text-white border-blue-500'
                      : 'text-slate-400 border-transparent hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={activeTab}
        className="py-12 px-4"
      >
        <div className="w-full">
          {/* Curriculum Tab - Udemy Style Layout */}
          {activeTab === 'curriculum' && (
            <div className="flex h-[calc(100vh-200px)] gap-0">
              {/* Left Sidebar - Curriculum Navigation */}
              <div className="w-80 bg-slate-900/50 border-r border-slate-800 overflow-y-auto flex-shrink-0">
                <div className="p-4 sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 z-10">
                  <h3 className="text-lg font-bold text-white mb-1">Curriculum</h3>
                  <p className="text-xs text-slate-400">
                    {curriculumItems.length} {curriculumItems.length === 1 ? 'lesson' : 'lessons'}
                  </p>
                </div>
                
                <div className="p-2">
                  {curriculumItems.map((item, index) => {
                    const isSelected = selectedLesson?.id === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => setSelectedLesson(item)}
                        className={`w-full text-left p-3 rounded-lg mb-1 transition-all ${
                          isSelected
                            ? 'bg-blue-600/20 border border-blue-500/50 text-white'
                            : 'bg-slate-800/30 hover:bg-slate-800/50 border border-transparent text-slate-300'
                        }`}
                        whileHover={{ x: 2 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 mt-0.5 ${
                            item.type === 'video' ? 'text-purple-400' : 'text-blue-400'
                          }`}>
                            {item.type === 'video' ? (
                              <Play className="w-4 h-4" />
                            ) : (
                              <BookOpen className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold ${
                                item.type === 'video' ? 'text-purple-300' : 'text-blue-300'
                              }`}>
                                {item.lessonNumber}
                              </span>
                              <span className="text-xs text-slate-400">
                                {item.type === 'video' ? 'Video' : 'Reading'}
                              </span>
                              {item.duration && (
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {item.duration}
                                </span>
                              )}
                            </div>
                            <h4 className={`text-sm font-semibold line-clamp-2 ${
                              isSelected ? 'text-white' : 'text-slate-200'
                            }`}>
                              {item.title}
                            </h4>
                          </div>
                          {isSelected && (
                            <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Right Content Area - Video Player & Reading Material */}
              <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
                {selectedLesson ? (
                  <>
                    {selectedLesson.type === 'video' ? (
                      <>
                        {/* Video Player Section */}
                        <div 
                          id="video-player-container"
                          className={`relative bg-black ${isFullscreen ? 'h-screen' : 'aspect-video'} transition-all`}
                        >
                          {convertYoutubeUrl(selectedLesson.videoUrl, true, true) ? (
                            <iframe
                              key={selectedLesson.id}
                              src={convertYoutubeUrl(selectedLesson.videoUrl, true, true)}
                              title={selectedLesson.title}
                              className="w-full h-100"
                              frameBorder="5"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center">
                                <AlertCircle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                                <p className="text-slate-400">Invalid video URL</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Custom Video Controls Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={handleFullscreen}
                                  className="p-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg text-white transition"
                                  title="Fullscreen"
                                >
                                  <Maximize2 className="w-5 h-5" />
                                </button>
                                <div className="relative group">
                                  <button
                                    className="p-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg text-white transition flex items-center gap-2"
                                    title="Playback Speed"
                                  >
                                    <Settings className="w-5 h-5" />
                                    <span className="text-sm">{playbackRate}x</span>
                                  </button>
                                  <div className="absolute bottom-full left-0 mb-2 bg-slate-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                                    <div className="p-2 space-y-1">
                                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                                        <button
                                          key={rate}
                                          onClick={() => setPlaybackRate(rate)}
                                          className={`w-full text-left px-3 py-1 rounded text-sm transition ${
                                            playbackRate === rate
                                              ? 'bg-blue-600 text-white'
                                              : 'text-slate-300 hover:bg-slate-700'
                                          }`}
                                        >
                                          {rate}x
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm text-slate-300">
                                {selectedLesson.duration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {selectedLesson.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Video Info Section */}
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/50">
                          <div className="max-w-4xl">
                            <div className="flex items-center gap-2 mb-4">
                              <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs font-semibold text-purple-300">
                                Lesson {selectedLesson.lessonNumber}
                              </span>
                              <span className="text-sm text-slate-400">Video Tutorial</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">{selectedLesson.title}</h2>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Reading Material Section */
                      <div className="flex-1 overflow-y-auto p-6 bg-slate-900/50">
                        <div className="max-w-4xl">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs font-semibold text-blue-300">
                              Lesson {selectedLesson.lessonNumber}
                            </span>
                            <span className="text-sm text-slate-400">Reading Material</span>
                          </div>
                          <h2 className="text-2xl font-bold text-white mb-4">{selectedLesson.title}</h2>
                          <p className="text-slate-300 mb-6 leading-relaxed">{selectedLesson.description}</p>
                          
                          {selectedLesson.references && selectedLesson.references.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-slate-700">
                              <div className="flex items-center gap-2 mb-4">
                                <LinkIcon className="w-5 h-5 text-blue-400" />
                                <h3 className="text-lg font-semibold text-white">References</h3>
                              </div>
                              <div className="space-y-3">
                                {selectedLesson.references.map((ref, refIndex) => {
                                  const isUrl = /^https?:\/\//i.test(ref);
                                  return (
                                    <a
                                      key={refIndex}
                                      href={isUrl ? ref : '#'}
                                      target={isUrl ? '_blank' : undefined}
                                      rel={isUrl ? 'noopener noreferrer' : undefined}
                                      className="flex items-center gap-3 p-4 bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50 rounded-lg transition group"
                                    >
                                      <ExternalLink className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition flex-shrink-0" />
                                      <span className="text-slate-300 group-hover:text-white transition flex-1">
                                        {ref}
                                      </span>
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
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-300 mb-2">Select a Lesson</h3>
                      <p className="text-slate-400">Choose a lesson from the sidebar to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Community Tab */}
          {activeTab === 'community' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Community</h2>
              <CommunityChannel cohortId={cohortId} />
            </div>
          )}
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
