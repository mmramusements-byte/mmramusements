import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ShieldCheck, LogIn, ArrowRight, RefreshCcw } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAdminUIStore } from '../store/useAdminUIStore';
import api from '../../lib/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, setLoading } = useAuthStore();
  const toast = useAdminUIStore((state) => state.toast);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  
  // Premium OTP State
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(0);

  // Timer for cooldown
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const validateEmailForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!validateEmailForm()) return;

    setLoading(true);
    try {
      await api.post('/auth/send-otp', { email });
      toast.success('OTP sent successfully to your email.', 'OTP Sent');
      setStep(2);
      setCountdown(30);
      setErrors({});
      // Clear OTP boxes if resending
      setOtpValues(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otpValues.join('');
    
    if (otpString.length !== 6) {
      setErrors({ otp: 'Please enter all 6 digits.' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp: otpString });
      
      login(res.token, res.admin);
      toast.success('Successfully authenticated.', 'Welcome Back');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid OTP.', 'Authentication Failed');
      setErrors({ otp: err.message || 'Invalid OTP' });
      // Reset OTP on error
      setOtpValues(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // OTP Input Handlers
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otpValues];
    newOtp[index] = value.substring(value.length - 1); // Take last char if multiple
    setOtpValues(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return; // Only numeric paste

    const newOtp = [...otpValues];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) newOtp[i] = pastedData[i];
    }
    setOtpValues(newOtp);
    
    // Focus appropriate input
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
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

        {step === 1 ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                  placeholder="admin@mmramusements.com"
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
                  <span>Send OTP</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
             <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'rgba(241, 241, 243, 0.65)',
                  marginBottom: '16px',
                  letterSpacing: '0.01em',
                  textAlign: 'center'
                }}
              >
                Enter the 6-digit code sent to<br/>
                <strong style={{ color: '#f1f1f3' }}>{email}</strong>
              </label>
              
              {/* Premium 6-box OTP */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }} onPaste={handleOtpPaste}>
                {otpValues.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    disabled={isLoading}
                    style={{
                      width: '45px',
                      height: '50px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${errors.otp ? '#ef4444' : (digit ? '#6366f1' : 'rgba(255, 255, 255, 0.06)')}`,
                      borderRadius: '8px',
                      color: '#f1f1f3',
                      fontSize: '20px',
                      fontWeight: '600',
                      textAlign: 'center',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxShadow: digit ? '0 0 12px rgba(99, 102, 241, 0.1)' : 'none'
                    }}
                    onFocus={(e) => {
                      if (!errors.otp) e.target.style.borderColor = '#6366f1';
                      e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.12)';
                      e.target.select();
                    }}
                    onBlur={(e) => {
                      if (!errors.otp) {
                        e.target.style.borderColor = digit ? '#6366f1' : 'rgba(255, 255, 255, 0.06)';
                      }
                      e.target.style.boxShadow = digit ? '0 0 12px rgba(99, 102, 241, 0.1)' : 'none';
                    }}
                  />
                ))}
              </div>

              {errors.otp && (
                <p style={{ color: '#ef4444', fontSize: '11.5px', marginTop: '12px', marginBottom: 0, textAlign: 'center' }}>{errors.otp}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || otpValues.join('').length !== 6}
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
                cursor: (isLoading || otpValues.join('').length !== 6) ? 'not-allowed' : 'pointer',
                opacity: otpValues.join('').length === 6 ? 1 : 0.6,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                transition: 'all 0.2s',
                marginTop: '4px',
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
                  <span>Verify & Login</span>
                  <LogIn size={15} />
                </>
              )}
            </button>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isLoading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(241,241,243,0.5)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Use a different email
              </button>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading || countdown > 0}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: countdown > 0 ? 'rgba(241,241,243,0.3)' : '#6366f1',
                  fontSize: '12px',
                  cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCcw size={12} />
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

      </motion.div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
