import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
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

export default function Explore() {
  const navigate = useNavigate();
  const [cohorts, setCohorts] = useState([]);
  const [enrolledCohortIds, setEnrolledCohortIds] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [error, setError] = useState('');

  // Fetch all cohorts on component mount
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
      console.error('Error fetching cohorts:', err);
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
      const enrolledIds = new Set(response.data?.map((c) => c._id) || []);
      setEnrolledCohortIds(enrolledIds);
    } catch (err) {
      console.error('Error fetching enrolled cohorts:', err);
    }
  };

  // Refetch cohorts when category changes
  useEffect(() => {
    fetchCohorts();
  }, [selectedCategory]);

  const handleEnroll = async (cohortId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      setEnrollingId(cohortId);
      await cohortAPI.enrollInCohort(cohortId);

      // Update enrolled cohorts
      setEnrolledCohortIds((prev) => new Set([...prev, cohortId]));
    } catch (err) {
      console.error('Error enrolling:', err);
      alert(err.message || 'Failed to enroll in cohort');
    } finally {
      setEnrollingId(null);
    }
  };

  const handleCardClick = (cohortId) => {
    navigate(`/cohort/${cohortId}`);
  };

  // Filter cohorts based on search term
  const filteredCohorts = cohorts.filter(
    (cohort) =>
      cohort.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cohort.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <LoggedInNavbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 md:px-16 lg:px-24 xl:px-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '50px 50px',
            }}
          ></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Explore <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Cohorts
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-12">
            Discover and join learning cohorts led by industry experts
          </p>
        </motion.div>
      </section>

      {/* Search and Filters Section */}
      <section className="px-6 md:px-16 lg:px-24 xl:px-32 mb-16 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cohorts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 overflow-x-auto pb-2"
          >
            <div className="flex items-center gap-2 text-slate-400 flex-shrink-0">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-semibold">Filter:</span>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              {CATEGORIES.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cohorts Grid Section */}
      <section className="px-6 md:px-16 lg:px-24 xl:px-32 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-slate-800 rounded-lg h-64 animate-pulse"
                ></div>
              ))}
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-red-400 text-lg">{error}</p>
            </motion.div>
          ) : filteredCohorts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-slate-400 text-lg mb-2">
                {searchTerm || selectedCategory !== 'All'
                  ? 'No cohorts found matching your search.'
                  : 'No cohorts available yet.'}
              </p>
              <p className="text-slate-500 text-sm">
                Check back soon for new learning opportunities!
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredCohorts.map((cohort) => (
                <CohortCard
                  key={cohort._id}
                  cohort={cohort}
                  isEnrolled={enrolledCohortIds.has(cohort._id)}
                  onEnroll={() => handleEnroll(cohort._id)}
                  isLoading={enrollingId === cohort._id}
                  onCardClick={() => handleCardClick(cohort._id)}
                />
              ))}
            </motion.div>
          )}

          {/* Results Count */}
          {filteredCohorts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12 text-slate-400"
            >
              <p>
                Showing {filteredCohorts.length} of {cohorts.length} cohorts
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
