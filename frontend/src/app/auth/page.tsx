"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import Image from 'next/image';

type Step = 'credentials' | 'otp' | 'profile';

const MOCK_OTP = '123456';
const AVATAR_COLORS = [
  '#5C6BC0', '#7E57C2', '#EC407A', '#42A5F5',
  '#26A69A', '#66BB6A', '#EF5350', '#FFA726',
];

function getInitials(name: string) {
  return name.trim().charAt(0).toUpperCase();
}

export default function AuthPage() {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();

  // Credentials step
  const [isLogin, setIsLogin] = useState(false);
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('alice');
  const [password, setPassword] = useState('pass123');
  const [loading, setLoading] = useState(false);

  // OTP step
  const [step, setStep] = useState<Step>('credentials');
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState(['1','2','3','4','5','6']);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Profile step
  const [displayName, setDisplayName] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ——— Credentials Step ———
  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', {
          phone_or_username: phone || username,
          password
        });
        setToken(res.data.access_token);
        setUser(res.data.user);
        toast.success('Welcome back!');
        router.push('/chat');
      } else {
        const res = await api.post('/auth/register', {
          phone_number: phone,
          username: username || phone,
          display_name: username || phone,
          password
        });
        setUserId(res.data.user_id);
        setStep('otp');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // ——— OTP Step ———
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', {
        user_id: userId,
        otp: otp.join('')
      });
      setToken(res.data.access_token);
      setUser(res.data.user);
      setDisplayName(res.data.user.display_name || '');
      setStep('profile');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // ——— Profile Step ———
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setLoading(true);
    try {
      let avatarUrl: string | undefined;
      // In a real app, you'd upload the file. For now, we'll use a data URL or skip.
      if (avatarPreview) {
        avatarUrl = avatarPreview;
      }
      const res = await api.put('/users/me', {
        display_name: displayName,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      });
      setUser(res.data);
      toast.success('Profile saved! Welcome to Signal.');
      router.push('/chat');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  // ——— Render ———
  return (
    <div className="min-h-screen bg-[#111115] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 mb-4 relative">
            <img
              src="/signal.png"
              alt="Signal"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-white text-2xl font-semibold tracking-tight">Signal</h1>
          <p className="text-[#8696A0] text-sm mt-1">
            {step === 'credentials' && (isLogin ? 'Sign in to your account' : 'Create your account')}
            {step === 'otp' && 'Verify your number'}
            {step === 'profile' && 'Set up your profile'}
          </p>
        </div>

        {/* ——— STEP 1: Credentials ——— */}
        {step === 'credentials' && (
          <div className="bg-[#1C1C1F] rounded-2xl p-6 shadow-xl border border-[#2A2A2E]">
            <div className="flex bg-[#111115] rounded-lg p-1 mb-6">
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-[#3A76F0] text-white shadow-md' : 'text-[#8696A0] hover:text-white'}`}
              >
                Register
              </button>
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-[#3A76F0] text-white shadow-md' : 'text-[#8696A0] hover:text-white'}`}
              >
                Sign In
              </button>
            </div>

            <form onSubmit={handleCredentials} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs text-[#8696A0] mb-1.5 font-medium tracking-wide uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#111115] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A76F0] border border-[#2A2A2E] focus:border-transparent placeholder:text-[#4A5568] transition-all"
                    required={!isLogin}
                  />
                </div>
              )}
              <div>
                <label className="block text-xs text-[#8696A0] mb-1.5 font-medium tracking-wide uppercase">
                  {isLogin ? 'Phone or Username' : 'Username'}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isLogin ? "alice or +91..." : "alice_smith"}
                  className="w-full bg-[#111115] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A76F0] border border-[#2A2A2E] focus:border-transparent placeholder:text-[#4A5568] transition-all"
                  required
                />
                {isLogin && (
                  <p className="text-[10px] text-[#8696A0] mt-1 ml-1">Default: <span className="text-[#3A76F0] font-mono">alice</span></p>
                )}
              </div>
              <div>
                <label className="block text-xs text-[#8696A0] mb-1.5 font-medium tracking-wide uppercase">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111115] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A76F0] border border-[#2A2A2E] focus:border-transparent placeholder:text-[#4A5568] transition-all"
                  required
                />
                {!isLogin && (
                  <p className="text-[10px] text-[#8696A0] mt-1 ml-1">Default: <span className="text-[#3A76F0] font-mono">pass123</span></p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3A76F0] text-white rounded-lg py-3 text-sm font-semibold hover:bg-[#3A76F0]/90 disabled:opacity-50 transition-all mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  isLogin ? 'Sign In' : 'Continue'
                )}
              </button>
            </form>
          </div>
        )}

        {/* ——— STEP 2: OTP ——— */}
        {step === 'otp' && (
          <div className="bg-[#1C1C1F] rounded-2xl p-6 shadow-xl border border-[#2A2A2E]">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#3A76F0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1C8.15 1 5 4.15 5 8v1H3v14h18V9h-2V8c0-3.85-3.15-7-7-7zm0 2c2.76 0 5 2.24 5 5v1H7V8c0-2.76 2.24-5 5-5zm0 9c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="#3A76F0"/>
                </svg>
              </div>
              <p className="text-[#8696A0] text-sm">We sent a code to your number.</p>
              <p className="text-[#3A76F0] text-sm font-medium mt-1">Mock OTP is pre-filled for you ✓</p>
            </div>

            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={otpRefs[i]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-11 h-12 bg-[#111115] border border-[#2A2A2E] focus:border-[#3A76F0] rounded-lg text-white text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#3A76F0] transition-all"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.join('').length < 6}
              className="w-full bg-[#3A76F0] text-white rounded-lg py-3 text-sm font-semibold hover:bg-[#3A76F0]/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Verify & Continue'}
            </button>

            <button
              onClick={() => setStep('credentials')}
              className="w-full text-[#8696A0] hover:text-white text-sm mt-3 py-2 transition-colors"
            >
              ← Back
            </button>
          </div>
        )}

        {/* ——— STEP 3: Profile ——— */}
        {step === 'profile' && (
          <div className="bg-[#1C1C1F] rounded-2xl p-6 shadow-xl border border-[#2A2A2E]">
            <form onSubmit={handleProfileSave} className="space-y-5">
              {/* Avatar picker */}
              <div className="flex flex-col items-center">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white cursor-pointer relative group shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: avatarPreview ? 'transparent' : selectedColor }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>{displayName ? getInitials(displayName) : '?'}</span>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 15.2A3.2 3.2 0 0 1 8.8 12 3.2 3.2 0 0 1 12 8.8 3.2 3.2 0 0 1 15.2 12 3.2 3.2 0 0 1 12 15.2M9 2L7.17 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9m3 15a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5z" fill="white"/>
                    </svg>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <p className="text-[#8696A0] text-xs mt-2">Tap to upload photo</p>
              </div>

              {/* Color swatches */}
              {!avatarPreview && (
                <div className="flex gap-2 justify-center flex-wrap">
                  {AVATAR_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1C1C1F] scale-110' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}

              {/* Display name */}
              <div>
                <label className="block text-xs text-[#8696A0] mb-1.5 font-medium tracking-wide uppercase">Your Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alice Smith"
                  autoFocus
                  className="w-full bg-[#111115] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A76F0] border border-[#2A2A2E] focus:border-transparent placeholder:text-[#4A5568] transition-all"
                  required
                />
                <p className="text-[10px] text-[#8696A0] mt-1 ml-1">This is your display name. You can change it anytime.</p>
              </div>

              <button
                type="submit"
                disabled={loading || !displayName.trim()}
                className="w-full bg-[#3A76F0] text-white rounded-lg py-3 text-sm font-semibold hover:bg-[#3A76F0]/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : '🎉 Save & Start Chatting'}
              </button>
            </form>
          </div>
        )}

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mt-5">
          {(['credentials', 'otp', 'profile'] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${step === s ? 'w-6 bg-[#3A76F0]' : 'w-1.5 bg-[#2A2A2E]'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
