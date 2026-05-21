import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAdminUIStore } from '../store/useAdminUIStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const toast = useAdminUIStore((state) => state.toast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success('Successfully authenticated.', 'Welcome Back');
        navigate('/admin/dashboard');
      } else {
        toast.error(res.error || 'Authentication failed.', 'Login Failed');
      }
    } catch (err) {
      toast.error('An unexpected error occurred.', 'Error');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#0d0d0f',
        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Background abstract elements */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          background: 'rgba(99, 102, 241, 0.03)',
          filter: 'blur(120px)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#161618',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '16px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset',
          padding: '40px 32px',
          zIndex: 10,
          position: 'relative',
        }}
      >
        {/* Glow indicator at the top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)',
          }}
        />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.25)',
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f1f1f3', letterSpacing: '-0.3px', margin: 0 }}>
            MMR Security Portal
          </h2>
          <p style={{ fontSize: '12.5px', color: 'rgba(241, 241, 243, 0.45)', marginTop: '6px' }}>
            Authorized administrative personnel only.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Email Input */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 500,
                color: 'rgba(241, 241, 243, 0.65)',
                marginBottom: '8px',
                letterSpacing: '0.01em',
              }}
            >
              Administrative Email
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(241, 241, 243, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="admin@mmr.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${errors.email ? '#ef4444' : 'rgba(255, 255, 255, 0.06)'}`,
                  borderRadius: '8px',
                  padding: '11px 16px 11px 40px',
                  color: '#f1f1f3',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  if (!errors.email) e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.12)';
                }}
                onBlur={(e) => {
                  if (!errors.email) e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            {errors.email && (
              <p style={{ color: '#ef4444', fontSize: '11.5px', marginTop: '6px', margin: 0 }}>{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 500,
                color: 'rgba(241, 241, 243, 0.65)',
                marginBottom: '8px',
                letterSpacing: '0.01em',
              }}
            >
              Access Key
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(241, 241, 243, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${errors.password ? '#ef4444' : 'rgba(255, 255, 255, 0.06)'}`,
                  borderRadius: '8px',
                  padding: '11px 40px 11px 40px',
                  color: '#f1f1f3',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  if (!errors.password) e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.12)';
                }}
                onBlur={(e) => {
                  if (!errors.password) e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(241, 241, 243, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p style={{ color: '#ef4444', fontSize: '11.5px', marginTop: '6px', margin: 0 }}>{errors.password}</p>
            )}
          </div>

          {/* Remember me disclaimer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'rgba(241, 241, 243, 0.45)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                defaultChecked
                style={{
                  accentColor: '#6366f1',
                  cursor: 'pointer',
                }}
              />
              <span>Keep secure session active</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '13.5px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
              transition: 'all 0.2s',
              marginTop: '8px',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#4f46e5';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.35)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#6366f1';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
              }
            }}
          >
            {isLoading ? (
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }}
              />
            ) : (
              <>
                <span>Decrypt Key & Login</span>
                <LogIn size={15} />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Hint */}
        <div
          style={{
            marginTop: '28px',
            padding: '12px 14px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'rgba(241,241,243,0.7)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🔒 Demo Access Credentials</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 8px', fontSize: '11.5px', color: 'rgba(241,241,243,0.45)', marginTop: '8px' }}>
            <span>Portal ID:</span>
            <span style={{ fontFamily: 'monospace', color: '#f1f1f3' }}>admin@mmr.com</span>
            <span>Secret:</span>
            <span style={{ fontFamily: 'monospace', color: '#f1f1f3' }}>mmradmin123</span>
          </div>
        </div>
      </motion.div>

      {/* Spinner Animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
