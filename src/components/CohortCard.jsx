import { motion } from 'framer-motion';
import { Users, BookOpen, CalendarDays } from 'lucide-react';

export default function CohortCard({ cohort, isEnrolled, onEnroll, isLoading, onCardClick }) {
  const categoryColors = {
    'Web Development': 'from-blue-500 to-blue-600',
    'Mobile Apps': 'from-purple-500 to-purple-600',
    'Data Science': 'from-green-500 to-green-600',
    'UI/UX Design': 'from-pink-500 to-pink-600',
    'Cloud Computing': 'from-orange-500 to-orange-600',
    'AI & ML': 'from-red-500 to-red-600',
    'Python': 'from-yellow-500 to-yellow-600',
    'JavaScript': 'from-yellow-400 to-yellow-500',
    'React': 'from-cyan-500 to-cyan-600',
    'Other': 'from-gray-500 to-gray-600',
  };

  const categoryColor = categoryColors[cohort.category] || categoryColors['Other'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onCardClick}
      className="group cursor-pointer"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-slate-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all h-full flex flex-col">
        {/* Category Badge */}
        <div className={`bg-gradient-to-r ${categoryColor} px-4 py-3 text-white text-sm font-semibold`}>
          {cohort.category}
        </div>

        {/* Card Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition">
            {cohort.title}
          </h3>

          {/* Description */}
          <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
            {cohort.description}
          </p>

          {/* Metadata */}
          <div className="space-y-2 mb-6 text-xs text-slate-500">
            {cohort.createdBy && (
              <div className="flex items-center gap-2">
                <BookOpen className="w-3 h-3" />
                <span>By {cohort.createdBy.fullName}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3" />
              <span>{cohort.enrolledUsers?.length || 0} students enrolled</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-3 h-3" />
              <span>{new Date(cohort.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Enroll Button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onEnroll();
            }}
            whileHover={!isEnrolled ? { scale: 1.02 } : {}}
            whileTap={!isEnrolled ? { scale: 0.98 } : {}}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
              isEnrolled
                ? 'bg-green-500/20 text-green-400 border border-green-500 cursor-default'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Enrolling...
              </span>
            ) : isEnrolled ? (
              '✓ Enrolled'
            ) : (
              'Enroll Now'
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
