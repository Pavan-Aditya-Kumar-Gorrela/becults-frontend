import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Terminal } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
  

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#010409]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(31,111,235,0.06),transparent)]" />
        <div className="absolute inset-0 opacity-[0.012]"
          style={{ backgroundImage: 'linear-gradient(#58a6ff 1px,transparent 1px),linear-gradient(90deg,#58a6ff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">

        {/* Glowing 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-6 select-none"
        >
          <span className="text-[120px] md:text-[160px] font-bold font-mono text-[#0d1117] leading-none">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-[120px] md:text-[160px] font-bold font-mono leading-none text-transparent"
            style={{ WebkitTextStroke: '1px #21262d' }}>
            404
          </span>
          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-16 bg-[#1f6feb]/15 blur-3xl rounded-full" />
          </div>
        </motion.div>

        {/* Terminal block */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="bg-[#0d1117] border border-[#21262d] rounded-2xl px-6 py-4 mb-8 w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex items-center gap-1.5 ml-2">
              <Terminal className="w-3 h-3 text-[#484f58]" />
              <span className="text-[10px] font-mono text-[#484f58]">shell</span>
            </div>
          </div>
          <div className="text-left space-y-1.5">
            <p className="text-xs font-mono text-[#7d8590]">
              <span className="text-[#3fb950]">→</span> GET <span className="text-[#f78166]">{typeof window !== 'undefined' ? window.location.pathname : '/unknown'}</span>
            </p>
            <p className="text-xs font-mono text-[#f85149]">
              Error 404: Route not found
            </p>
            <p className="text-xs font-mono text-[#484f58]">
              The page you requested does not exist or has been moved.
            </p>
          </div>
        </motion.div>

        {/* Heading + sub */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-[#e6edf3] tracking-tight mb-2">
            Page not found
          </h1>
          <p className="text-sm font-mono text-[#7d8590] max-w-sm">
            Looks like this route doesn't exist in our system. Head back home and keep learning.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => navigate('/home')}
            className="group flex items-center gap-2 px-6 py-2.5 bg-[#1f6feb] hover:bg-[#388bfd] rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow-lg shadow-[#1f6feb]/20 hover:shadow-[#1f6feb]/30 active:scale-[0.97]"
          >
            Back to Home
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0d1117] hover:bg-[#161b22] border border-[#21262d] hover:border-[#30363d] rounded-xl text-sm font-semibold text-[#7d8590] hover:text-[#e6edf3] transition-all duration-200 active:scale-[0.97]"
          >
            Explore Cohorts
          </button>
        </motion.div>
      </div>

    </>
  );
}