import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import Logo from '../assets/logo.jpg';
import toast from 'react-hot-toast';

const companyLinks = [
  { label: 'About Us',       href: '/' },
  { label: 'Careers',        href: '/careers', badge: "We're hiring" },
  { label: 'Contact Us',     href: '/' },
  { label: 'Privacy Policy', href: '/' },
];

const socialLinks = [
  { icon: Github,   href: '#',   label: 'GitHub'   },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/becults/', label: 'LinkedIn' },
  { icon: Twitter,  href: '#',   label: 'Twitter'  },
];

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Subscribed to NewsLetter");
    
    // hook up real logic here
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative mt-24 border-t border-[#21262d] bg-[#010409]"
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1f6feb]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">

          {/* ── Brand col ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="/home" className="inline-block  opacity-80 hover:opacity-100 transition-opacity">
              <img src={Logo} alt="logo" className="h-20 w-auto" />
            </a>
            <p className="text-xs font-mono text-[#7d8590] leading-relaxed max-w-xs">
              A structured cohort-based learning platform where students collaborate,
              build real skills, and grow together under expert guidance.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-[#0d1117] border border-[#21262d] rounded-lg text-[#7d8590] hover:text-[#e6edf3] hover:border-[#30363d] transition-all duration-200">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Company links ── */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-4 bg-[#1f6feb] rounded-full" />
              <h2 className="text-xs font-mono font-semibold text-[#e6edf3] uppercase tracking-widest">Company</h2>
            </div>
            <ul className="space-y-2.5">
              {companyLinks.map(({ label, href, badge }) => (
                <li key={label}>
                  <a href={href}
                    className="group inline-flex items-center gap-2 text-xs font-mono text-[#7d8590] hover:text-[#e6edf3] transition-colors duration-200">
                    <span>{label}</span>
                    {badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-[#1f6feb]/15 border border-[#1f6feb]/25 text-[#58a6ff] rounded-md">
                        {badge}
                      </span>
                    )}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Newsletter ── */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-4 bg-[#3fb950] rounded-full" />
              <h2 className="text-xs font-mono font-semibold text-[#e6edf3] uppercase tracking-widest">Community</h2>
            </div>
            <p className="text-xs font-mono text-[#7d8590] leading-relaxed mb-5">
            Latest cohort launches, curated learning resources, exclusive opportunities, and important updates — delivered straight to your inbox every week.

Stay connected with mentors, discover new events, access member-only content, and never miss announcements that help you grow professionally and personally.
            </p>
            
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3  border-t border-[#21262d]">
          <p className="text-[10px] font-mono text-[#484f58]">
            © 2026 All rights reserved · Built with ❤️
          </p>
          <div className="flex items-center gap-4">
            {['Terms', 'Privacy', 'Cookies'].map((item) => (
              <a key={item} href="#"
                className="text-[10px] font-mono text-[#484f58] hover:text-[#7d8590] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}