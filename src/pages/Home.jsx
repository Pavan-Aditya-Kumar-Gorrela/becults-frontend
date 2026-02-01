import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Code, Users, Zap, Award, TrendingUp, LogOut,
  ChevronRight, Play, Star, Lock, Globe, MessageSquare
} from 'lucide-react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import Footer from '../components/footer';

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Check if token exists, if not redirect to login
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    window.scrollTo(0, 0);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const courses = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      category: 'Web Development',
      level: 'Beginner',
      students: 2451,
      rating: 4.8,
      image: 'bg-gradient-to-br from-blue-600 to-blue-900',
      progress: 65,
      icon: Code
    },
    {
      id: 2,
      title: 'Advanced JavaScript & React',
      category: 'Frontend',
      level: 'Intermediate',
      students: 1834,
      rating: 4.9,
      image: 'bg-gradient-to-br from-purple-600 to-purple-900',
      progress: 42,
      icon: Zap
    },
    {
      id: 3,
      title: 'Full Stack Development',
      category: 'Full Stack',
      level: 'Advanced',
      students: 1205,
      rating: 4.7,
      image: 'bg-gradient-to-br from-green-600 to-green-900',
      progress: 28,
      icon: Globe
    },
    {
      id: 4,
      title: 'Data Science & Machine Learning',
      category: 'Data Science',
      level: 'Advanced',
      students: 1567,
      rating: 4.9,
      image: 'bg-gradient-to-br from-orange-600 to-orange-900',
      progress: 0,
      icon: TrendingUp
    },
  ];

  const categories = [
    { name: 'Web Development', icon: Code, color: 'from-blue-500 to-blue-600' },
    { name: 'Mobile Apps', icon: Globe, color: 'from-purple-500 to-purple-600' },
    { name: 'Data Science', icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { name: 'UI/UX Design', icon: BookOpen, color: 'from-pink-500 to-pink-600' },
    { name: 'Cloud Computing', icon: Lock, color: 'from-orange-500 to-orange-600' },
    { name: 'AI & ML', icon: Zap, color: 'from-red-500 to-red-600' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <LoggedInNavbar />

      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6 md:px-16 lg:px-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {user?.fullName || 'Learner'}
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Continue your learning journey with our cutting-edge courses and connect with thousands of students worldwide.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
          >
            {[
              { icon: BookOpen, label: 'Courses Enrolled', value: '4', color: 'from-blue-500' },
              { icon: Award, label: 'Certificates Earned', value: '2', color: 'from-purple-500' },
              { icon: TrendingUp, label: 'Learning Streak', value: '12 days', color: 'from-green-500' },
              { icon: Users, label: 'Community Members', value: '24.5k', color: 'from-orange-500' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className={`bg-gradient-to-br ${stat.color} to-transparent p-6 rounded-lg border border-slate-800 hover:border-slate-700 transition`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8 text-white" />
                    <span className="text-xs px-3 py-1 bg-white/10 rounded-full text-slate-300">This month</span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-slate-400">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Continue Learning Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Continue Learning</h2>
              <a href="#" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition">
                View All <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course, idx) => {
                const CourseIcon = course.icon;
                return (
                  <motion.div
                    key={course.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-slate-700 hover:shadow-lg hover:shadow-blue-500/10 transition cursor-pointer"
                  >
                    <div className={`${course.image} h-32 flex items-end justify-end p-4 relative overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CourseIcon className="w-12 h-12 text-white/30 group-hover:scale-110 transition" />
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
                      >
                        <Play className="w-4 h-4 text-white fill-white" />
                      </motion.div>
                    </div>

                    <div className="p-4">
                      <p className="text-xs text-blue-400 mb-2">{course.category}</p>
                      <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">{course.title}</h3>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-slate-400">{course.level}</span>
                          <span className="text-xs text-slate-300 font-semibold">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ delay: idx * 0.1 + 0.3, duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          ></motion.div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-slate-300">{course.rating}</span>
                        </div>
                        <span className="text-xs text-slate-500">{course.students.toLocaleString()} students</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Categories Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">Explore Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className={`bg-gradient-to-br ${cat.color} p-6 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-current/50 transition group`}
                  >
                    <Icon className="w-8 h-8 text-white mb-3 group-hover:scale-110 transition" />
                    <p className="text-sm font-semibold text-white text-center">{cat.name}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 px-6 md:px-16 lg:px-24 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Our Courses?</h2>
            <p className="text-xl text-slate-400">Industry-leading content from expert instructors</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Lock,
                title: 'Industry-Relevant',
                description: 'Learn skills that are in high demand in the current job market'
              },
              {
                icon: Users,
                title: 'Expert Instructors',
                description: 'Learn from professionals working at top tech companies'
              },
              {
                icon: Award,
                title: 'Certifications',
                description: 'Earn recognized certificates to boost your career prospects'
              },
              {
                icon: MessageSquare,
                title: 'Community Support',
                description: 'Connect with thousands of learners and get help when you need it'
              },
              {
                icon: Zap,
                title: 'Flexible Learning',
                description: 'Learn at your own pace with lifetime access to courses'
              },
              {
                icon: TrendingUp,
                title: 'Career Growth',
                description: 'Access job opportunities and career advancement resources'
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-8 hover:border-slate-700 hover:shadow-lg hover:shadow-blue-500/10 transition group"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-16 lg:px-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Level Up Your Skills?</h2>
          <p className="text-xl text-slate-400 mb-8">Explore our full catalog of courses and start learning today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition"
            >
              Explore All Courses
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-8 py-3 bg-slate-800 text-white font-semibold rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-700 transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
