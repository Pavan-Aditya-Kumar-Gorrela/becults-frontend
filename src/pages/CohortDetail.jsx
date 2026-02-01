import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, BookOpen, Users, AlertCircle, Loader } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('roadmap');

  useEffect(() => {
    const fetchCohortDetails = async () => {
      try {
        setLoading(true);
        const data = await cohortAPI.getCohortDetails(cohortId);
        setCohort(data);
        setError(null);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
        
        // Redirect to explore if not enrolled (403)
        if (err.response?.status === 403) {
          setTimeout(() => {
            navigate('/explore');
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCohortDetails();
  }, [cohortId, navigate]);

  const convertYoutubeUrl = (url) => {
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
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return null;
  };

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
    { id: 'roadmap', label: 'Roadmap', icon: BookOpen },
    { id: 'videos', label: 'Video Series', icon: Play },
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
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full mb-4">
                <span className="text-sm font-semibold text-blue-300">{cohort.category}</span>
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
        <div className="max-w-6xl mx-auto">
          {/* Roadmap Tab */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-8">Learning Roadmap</h2>
              {cohort.roadmap && cohort.roadmap.length > 0 ? (
                <div className="space-y-4">
                  {cohort.roadmap
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                              <span className="text-white font-bold text-lg">{index + 1}</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                            <p className="text-slate-300">{item.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              ) : (
                <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-lg p-12 text-center">
                  <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">No roadmap items yet</p>
                </div>
              )}
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-8">Video Series</h2>
              {cohort.videos && cohort.videos.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {cohort.videos
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((video, index) => {
                      const embedUrl = convertYoutubeUrl(video.videoUrl);
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-3"
                        >
                          {embedUrl ? (
                            <div className="relative group rounded-lg overflow-hidden bg-slate-800 aspect-video">
                              <iframe
                                src={embedUrl}
                                title={video.title}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition opacity-0 group-hover:opacity-100 pointer-events-none" />
                            </div>
                          ) : (
                            <div className="bg-slate-800 border border-dashed border-slate-700 rounded-lg p-8 text-center aspect-video flex items-center justify-center">
                              <AlertCircle className="w-8 h-8 text-slate-500" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-white text-lg">{video.title}</h3>
                            {video.duration && (
                              <p className="text-sm text-slate-400">Duration: {video.duration}</p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              ) : (
                <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-lg p-12 text-center">
                  <Play className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">No videos yet</p>
                </div>
              )}
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
