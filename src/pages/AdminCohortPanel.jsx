import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, CheckCircle, Circle, AlertCircle, Loader, X, Link as LinkIcon } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

export default function AdminCohortPanel() {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCohortId, setEditingCohortId] = useState(null);
  const [expandedCohortId, setExpandedCohortId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
  });

  const [roadmapForm, setRoadmapForm] = useState({
    cohortId: null,
    title: '',
    description: '',
    references: [],
  });
  const [newReference, setNewReference] = useState('');

  const [videoForm, setVideoForm] = useState({
    cohortId: null,
    title: '',
    videoUrl: '',
    duration: '',
  });

  const categories = [
    'Web Development',
    'Mobile Apps',
    'Data Science',
    'UI/UX Design',
    'Cloud Computing',
    'AI & ML',
    'Python',
    'JavaScript',
    'React',
    'Other',
  ];

  // Fetch all cohorts
  useEffect(() => {
    fetchCohorts();
  }, []);

  const fetchCohorts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/admin/cohorts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Response status:', response.status);
        console.error('Response text:', text);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setCohorts(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cohorts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create cohort
  const handleCreateCohort = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/cohorts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Response:', text);
        throw new Error('Failed to create cohort');
      }

      const data = await response.json();
      setCohorts([data.data, ...cohorts]);
      setFormData({ title: '', description: '', category: 'Web Development' });
      setShowCreateForm(false);
      alert('Cohort created successfully!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Toggle cohort status
  const handleToggleStatus = async (cohortId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/cohorts/${cohortId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle cohort status');
      }

      const data = await response.json();
      setCohorts(cohorts.map(c => c._id === cohortId ? data.data : c));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Delete cohort
  const handleDeleteCohort = async (cohortId) => {
    if (!window.confirm('Are you sure you want to delete this cohort? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/cohorts/${cohortId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete cohort');
      }

      setCohorts(cohorts.filter(c => c._id !== cohortId));
      alert('Cohort deleted successfully!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Add reference to roadmap form
  const handleAddReference = () => {
    if (newReference.trim()) {
      setRoadmapForm({
        ...roadmapForm,
        references: [...roadmapForm.references, newReference.trim()],
      });
      setNewReference('');
    }
  };

  // Remove reference from roadmap form
  const handleRemoveReference = (index) => {
    setRoadmapForm({
      ...roadmapForm,
      references: roadmapForm.references.filter((_, i) => i !== index),
    });
  };

  // Add roadmap item
  const handleAddRoadmapItem = async (e) => {
    e.preventDefault();

    if (!roadmapForm.title || !roadmapForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/cohorts/${roadmapForm.cohortId}/roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: roadmapForm.title,
          description: roadmapForm.description,
          references: roadmapForm.references,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add roadmap item');
      }

      const data = await response.json();
      setCohorts(cohorts.map(c => c._id === roadmapForm.cohortId ? data.data : c));
      setRoadmapForm({ cohortId: null, title: '', description: '', references: [] });
      setNewReference('');
      alert('Roadmap item added!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Delete roadmap item
  const handleDeleteRoadmapItem = async (cohortId, itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/cohorts/${cohortId}/roadmap/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete roadmap item');
      }

      const data = await response.json();
      setCohorts(cohorts.map(c => c._id === cohortId ? data.data : c));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Add video
  const handleAddVideo = async (e) => {
    e.preventDefault();

    if (!videoForm.title || !videoForm.videoUrl) {
      alert('Please fill in title and video URL');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/cohorts/${videoForm.cohortId}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: videoForm.title,
          videoUrl: videoForm.videoUrl,
          duration: videoForm.duration || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add video');
      }

      const data = await response.json();
      setCohorts(cohorts.map(c => c._id === videoForm.cohortId ? data.data : c));
      setVideoForm({ cohortId: null, title: '', videoUrl: '', duration: '' });
      alert('Video added!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Delete video
  const handleDeleteVideo = async (cohortId, videoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/cohorts/${cohortId}/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete video');
      }

      const data = await response.json();
      setCohorts(cohorts.map(c => c._id === cohortId ? data.data : c));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
            <Loader className="w-12 h-12 text-blue-500" />
          </motion.div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white p-6 md:p-12">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Cohort Management</h1>
              <p className="text-slate-400">Create and manage learning cohorts</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
            >
              <Plus className="w-5 h-5" />
              New Cohort
            </motion.button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-300">{error}</p>
            </motion.div>
          )}

          {/* Create Cohort Form */}
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-slate-800/50 border border-slate-700 rounded-lg p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Create New Cohort</h2>
              <form onSubmit={handleCreateCohort} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., React Fundamentals Bootcamp"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the cohort..."
                    rows="3"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                  >
                    Create Cohort
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Cohorts List */}
          <div className="space-y-4">
            {cohorts.length === 0 ? (
              <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-lg p-12 text-center">
                <p className="text-slate-400 mb-4">No cohorts yet. Create your first cohort to get started!</p>
              </div>
            ) : (
              cohorts.map((cohort) => (
                <motion.div
                  key={cohort._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition"
                >
                  {/* Cohort Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{cohort.title}</h3>
                          <button
                            onClick={() => handleToggleStatus(cohort._id)}
                            className={`p-1 rounded transition ${cohort.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                          >
                            {cohort.isActive ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <p className="text-slate-300 mb-2">{cohort.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          <span className="inline-block px-2 py-1 bg-slate-700 rounded">{cohort.category}</span>
                          <span>📚 {cohort.roadmap?.length || 0} roadmap items</span>
                          <span>🎥 {cohort.videos?.length || 0} videos</span>
                          <span>👥 {cohort.enrolledUsers?.length || 0} students</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setExpandedCohortId(expandedCohortId === cohort._id ? null : cohort._id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                        >
                          {expandedCohortId === cohort._id ? 'Hide' : 'Manage'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteCohort(cohort._id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedCohortId === cohort._id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 pt-6 border-t border-slate-700 space-y-6"
                      >
                        {/* Roadmap Section */}
                        <div>
                          <h4 className="text-lg font-bold text-white mb-4">Roadmap Items</h4>
                          <div className="space-y-3 mb-4">
                            {cohort.roadmap?.map((item, idx) => (
                              <div key={item._id} className="flex items-start justify-between bg-slate-700/50 p-3 rounded">
                                <div className="flex-1">
                                  <p className="font-semibold text-white">{idx + 1}. {item.title}</p>
                                  <p className="text-sm text-slate-300">{item.description}</p>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeleteRoadmapItem(cohort._id, item._id)}
                                  className="ml-2 p-1 text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            ))}
                          </div>

                          {roadmapForm.cohortId === cohort._id ? (
                            <form onSubmit={handleAddRoadmapItem} className="space-y-3 bg-slate-700/30 p-4 rounded">
                              <input
                                type="text"
                                value={roadmapForm.title}
                                onChange={(e) => setRoadmapForm({ ...roadmapForm, title: e.target.value })}
                                placeholder="Roadmap item title"
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
                              />
                              <textarea
                                value={roadmapForm.description}
                                onChange={(e) => setRoadmapForm({ ...roadmapForm, description: e.target.value })}
                                placeholder="Description"
                                rows="2"
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
                              />
                              
                              {/* References Section */}
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                                  <LinkIcon className="w-3 h-3" />
                                  References (Optional)
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newReference}
                                    onChange={(e) => setNewReference(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddReference();
                                      }
                                    }}
                                    placeholder="Add reference URL or text"
                                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
                                  />
                                  <button
                                    type="button"
                                    onClick={handleAddReference}
                                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                                {roadmapForm.references.length > 0 && (
                                  <div className="space-y-1">
                                    {roadmapForm.references.map((ref, idx) => (
                                      <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-slate-800 rounded text-sm">
                                        <LinkIcon className="w-3 h-3 text-blue-400 flex-shrink-0" />
                                        <span className="flex-1 text-slate-300 truncate">{ref}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveReference(idx)}
                                          className="text-red-400 hover:text-red-300 transition"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <button
                                  type="submit"
                                  className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold transition"
                                >
                                  Add Item
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRoadmapForm({ cohortId: null, title: '', description: '', references: [] });
                                    setNewReference('');
                                  }}
                                  className="px-4 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded text-sm transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setRoadmapForm({ cohortId: cohort._id, title: '', description: '', references: [] })}
                              className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold transition flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add Roadmap Item
                            </motion.button>
                          )}
                        </div>

                        {/* Videos Section */}
                        <div>
                          <h4 className="text-lg font-bold text-white mb-4">Videos</h4>
                          <div className="space-y-3 mb-4">
                            {cohort.videos?.map((video, idx) => (
                              <div key={video._id} className="flex items-start justify-between bg-slate-700/50 p-3 rounded">
                                <div className="flex-1">
                                  <p className="font-semibold text-white">{idx + 1}. {video.title}</p>
                                  <p className="text-xs text-slate-400 truncate">{video.videoUrl}</p>
                                  {video.duration && <p className="text-sm text-slate-300">Duration: {video.duration}</p>}
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeleteVideo(cohort._id, video._id)}
                                  className="ml-2 p-1 text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            ))}
                          </div>

                          {videoForm.cohortId === cohort._id ? (
                            <form onSubmit={handleAddVideo} className="space-y-3 bg-slate-700/30 p-4 rounded">
                              <input
                                type="text"
                                value={videoForm.title}
                                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                                placeholder="Video title"
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
                              />
                              <input
                                type="text"
                                value={videoForm.videoUrl}
                                onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                                placeholder="YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
                              />
                              <input
                                type="text"
                                value={videoForm.duration}
                                onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                                placeholder="Duration (optional, e.g., 15:30)"
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
                              />
                              <div className="flex gap-2">
                                <button
                                  type="submit"
                                  className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold transition"
                                >
                                  Add Video
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setVideoForm({ cohortId: null, title: '', videoUrl: '', duration: '' })}
                                  className="px-4 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded text-sm transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setVideoForm({ cohortId: cohort._id, title: '', videoUrl: '', duration: '' })}
                              className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold transition flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add Video
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.section>
        </div>
      </AdminLayout>
    );
  }

