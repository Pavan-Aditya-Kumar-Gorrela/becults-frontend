import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Mail, Phone, MapPin, User, Shield, Calendar, Zap, CheckCircle, XCircle, Camera } from 'lucide-react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import Footer from '../components/footer';
import { authAPI } from '../services/api';


const inputClass =
  'w-full px-4 py-3 bg-[#0d1117] border border-[#21262d] rounded-xl text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 transition-all duration-200 font-mono text-sm';

const labelClass = 'block text-xs font-semibold uppercase tracking-widest text-[#7d8590] mb-2';

function StatBadge({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-[#0d1117] border border-[#21262d] rounded-xl group hover:border-[#30363d] transition-colors">
      <div className={`p-2 rounded-lg ${accent}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[#7d8590]">{label}</p>
        <p className="text-sm font-semibold text-[#e6edf3] font-mono">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', bio: '', phone: '', address: '', email: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setFormData({ fullName: userData.fullName || '', bio: userData.bio || '', phone: userData.phone || '', address: userData.address || '', email: userData.email || '' });
        }
        try {
          const response = await authAPI.getCurrentUser();
          if (response.success) {
            setUser(response.user);
            setFormData({ fullName: response.user.fullName || '', bio: response.user.bio || '', phone: response.user.phone || '', address: response.user.address || '', email: response.user.email || '' });
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        } catch (err) {
          if (!storedUser) throw err;
        }
      } catch (err) {
        setError('Failed to load profile');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setIsSaving(true);
    try {
      const response = await authAPI.updateProfile({ fullName: formData.fullName, bio: formData.bio, phone: formData.phone, address: formData.address });
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#010409] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-[#1f6feb]/30"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#58a6ff] animate-spin"></div>
          </div>
          <p className="text-[#7d8590] text-xs uppercase tracking-widest font-mono">Loading profile...</p>
        </div>
      </div>
    );
  }

  const initials = formData.fullName ? formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <>
      <LoggedInNavbar />

      {/* Background */}
      <div className="fixed inset-0 bg-[#010409] -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(31,111,235,0.06),transparent)]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1f6feb]/40 to-transparent"></div>
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: 'linear-gradient(#58a6ff 1px, transparent 1px), linear-gradient(90deg, #58a6ff 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
        </div>
      </div>

      <div className="min-h-screen text-[#e6edf3] pt-24 pb-24">
        <div className="max-w-5xl mx-auto px-6">

          {/* Back nav */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-[#7d8590] hover:text-[#e6edf3] transition-colors mb-8 group text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-mono">back to dashboard</span>
          </motion.button>

          {/* Page title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1.5 h-6 bg-[#1f6feb] rounded-full"></div>
              <h1 className="text-2xl font-bold text-[#e6edf3] tracking-tight">Account Settings</h1>
            </div>
            <p className="text-[#7d8590] text-sm ml-4.5 font-mono pl-4">Manage your identity and personal information</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

            {/* Left sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              {/* Avatar card */}
              <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="relative mb-4 group cursor-pointer">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1f6feb] to-[#388bfd] flex items-center justify-center overflow-hidden shadow-lg shadow-[#1f6feb]/20">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-white font-mono">{initials}</span>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  {/* Online dot */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#3fb950] rounded-full border-2 border-[#0d1117]"></div>
                </div>
                <h2 className="font-semibold text-[#e6edf3] text-base">{formData.fullName || 'Your Name'}</h2>
                <p className="text-[#7d8590] text-xs font-mono mt-0.5">{formData.email}</p>
                {user?.isAdmin && (
                  <span className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 bg-[#fff3cd]/10 border border-[#d29922]/30 rounded-full text-[#d29922] text-[10px] font-semibold uppercase tracking-wider">
                    <Zap className="w-3 h-3" /> Admin
                  </span>
                )}
                {!user?.isAdmin && (
                  <span className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 bg-[#1f6feb]/10 border border-[#1f6feb]/30 rounded-full text-[#58a6ff] text-[10px] font-semibold uppercase tracking-wider">
                    <User className="w-3 h-3" /> Learner
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <StatBadge icon={Calendar} label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'} accent="bg-[#1f6feb]/10 text-[#58a6ff]" />
                <StatBadge icon={Shield} label="Auth Provider" value={user?.authProvider || 'Local'} accent="bg-[#3fb950]/10 text-[#3fb950]" />
              </div>

              {/* Tab nav */}
              <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-2 space-y-1">
                {[{ id: 'profile', label: 'Profile Info', icon: User }, { id: 'contact', label: 'Contact', icon: Phone }].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-[#1f6feb]/10 text-[#58a6ff] border border-[#1f6feb]/20' : 'text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#21262d]'}`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Main form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl overflow-hidden">
                {/* Form header */}
                <div className="px-8 py-5 border-b border-[#21262d] flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#e6edf3]">{activeTab === 'profile' ? 'Personal Information' : 'Contact Details'}</h3>
                    <p className="text-[#7d8590] text-xs font-mono mt-0.5">
                      {activeTab === 'profile' ? 'Update your name and bio' : 'How others can reach you'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                  {/* Notifications */}
                  <AnimatePresence>
                    {message && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        className="flex items-center gap-3 p-4 bg-[#3fb950]/5 border border-[#3fb950]/20 rounded-xl text-[#3fb950] text-sm"
                      >
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span className="font-mono">{message}</span>
                      </motion.div>
                    )}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        className="flex items-center gap-3 p-4 bg-[#f85149]/5 border border-[#f85149]/20 rounded-xl text-[#f85149] text-sm"
                      >
                        <XCircle className="w-4 h-4 shrink-0" />
                        <span className="font-mono">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {activeTab === 'profile' && (
                    <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      {/* Full Name */}
                      <div>
                        <label className={labelClass}>Full Name</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" className={inputClass} />
                      </div>

                      {/* Email readonly */}
                      <div>
                        <label className={labelClass}>
                          <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email Address</span>
                        </label>
                        <div className="relative">
                          <input type="email" value={formData.email} disabled className={`${inputClass} opacity-40 cursor-not-allowed pr-28`} />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-[#484f58] bg-[#21262d] px-2 py-0.5 rounded font-mono">read-only</span>
                        </div>
                      </div>

                      {/* Bio */}
                      <div>
                        <label className={labelClass}>Bio</label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="A short introduction about yourself..."
                          rows="4"
                          className={`${inputClass} resize-none leading-relaxed`}
                        />
                        <p className="text-[#484f58] text-xs font-mono mt-1.5">{formData.bio.length}/280 characters</p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'contact' && (
                    <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      {/* Phone */}
                      <div>
                        <label className={labelClass}>
                          <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> Phone Number</span>
                        </label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" className={inputClass} />
                      </div>

                      {/* Address */}
                      <div>
                        <label className={labelClass}>
                          <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Location / Address</span>
                        </label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="City, Country" className={inputClass} />
                      </div>
                    </motion.div>
                  )}

                  {/* Divider */}
                  <div className="h-px bg-[#21262d]"></div>

                  {/* Submit */}
                  <div className="flex items-center justify-between">
                    <p className="text-[#484f58] text-xs font-mono">Changes are saved to your account</p>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="relative inline-flex items-center gap-2 px-6 py-2.5 bg-[#1f6feb] hover:bg-[#388bfd] disabled:bg-[#1f6feb]/40 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-lg shadow-[#1f6feb]/20 hover:shadow-[#1f6feb]/30 active:scale-[0.98] overflow-hidden group"
                    >
                      {/* Shimmer effect */}
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></span>
                      <Save className="w-4 h-4" />
                      {isSaving ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></span>
                          Saving...
                        </span>
                      ) : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Security hint */}
              <div className="mt-4 flex items-start gap-3 p-4 bg-[#d29922]/5 border border-[#d29922]/15 rounded-xl">
                <Shield className="w-4 h-4 text-[#d29922] shrink-0 mt-0.5" />
                <p className="text-[#d29922]/80 text-xs font-mono leading-relaxed">
                  Your profile data is encrypted and stored securely. Email changes require re-verification through account settings.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}