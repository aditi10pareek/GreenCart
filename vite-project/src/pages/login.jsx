import React, { useState } from 'react';
import { Leaf, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/login.css';
import '../styles/style.css';

export default function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setRegisterStep(1);
    setOtp('');
    setFormData({ name: '', email: '', password: '' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanEmail = formData.email.trim().toLowerCase();
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email: cleanEmail,
        password: formData.password
      });
      alert('Logged in successfully! Welcome back.');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/users/send-otp', {
        email: formData.email.trim().toLowerCase()
      });
      setRegisterStep(2);
      alert('OTP sent! Please check your email.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/users/verify-otp', {
        email: formData.email.trim().toLowerCase(),
        otp
      });
      setRegisterStep(3);
      alert('Email verified! You can now create your profile.');
    } catch (err) {
      alert(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', {
        name: formData.name,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        otp
      });
      alert('Account created successfully! Welcome to GreenCart 🌱');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/users/google', {
        token: credentialResponse.credential
      });
      alert('Google Login Successful! Welcome.');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Google Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    alert('Google Login Failed');
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <div className="login-left">
          <div className="login-branding">
            <a href="/">
              <h2 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Leaf /> GreenCart
              </h2>
            </a>
          </div>
          <div className="login-illustration">
            <h1>Join the Green Revolution</h1>
            <p>Your everyday choices have the power to change the world. Track your carbon impact, shop sustainably, and save the planet—one cart at a time.</p>
          </div>
        </div>

        <div className="login-right">
          <div className="auth-box">
            {registerStep === 1 && (
              <div className="auth-tabs">
                <button type="button" className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => handleTabSwitch('login')}>Sign In</button>
                <button type="button" className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`} onClick={() => handleTabSwitch('register')}>Sign Up</button>
              </div>
            )}

            {activeTab === 'login' && registerStep === 1 && (
              <form className="auth-form active-form" onSubmit={handleLogin}>
                <h2>Welcome Back</h2>
                <p className="auth-subtitle">Login with your credentials to continue.</p>

                <div className="input-group">
                  <label>Email Address</label>
                  <div className="input-field">
                    <Mail />
                    <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <div className="input-field">
                    <Lock />
                    <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                  </div>
                </div>

                <div className="auth-actions">
                  <label className="remember-me">
                    <input type="checkbox" /> Remember me
                  </label>
                  <a href="#" className="forgot-pwd">Forgot Password?</a>
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <><Loader2 className="spin" /> Processing...</> : 'Sign In'}
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                  <span style={{ margin: '0 10px', color: '#64748b', fontSize: '0.9rem' }}>or</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                  />
                </div>
              </form>
            )}

            {activeTab === 'register' && registerStep === 1 && (
              <form className="auth-form active-form" onSubmit={handleSendOTP}>
                <h2>Create an Account</h2>
                <p className="auth-subtitle">Start by providing a genuine email address.</p>

                <div className="input-group">
                  <label>Email Address</label>
                  <div className="input-field">
                    <Mail />
                    <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <><Loader2 className="spin" /> Sending...</> : 'Send Verification OTP'}
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                  <span style={{ margin: '0 10px', color: '#64748b', fontSize: '0.9rem' }}>or</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text="signup_with"
                  />
                </div>
              </form>
            )}

            {activeTab === 'register' && registerStep === 2 && (
              <form className="auth-form active-form" onSubmit={handleVerifyOTP}>
                <h2>Verify Your Email</h2>
                <p className="auth-subtitle">We've sent an OTP to {formData.email}.</p>
                <div className="input-group">
                  <label>OTP Code</label>
                  <div className="input-field">
                    <Lock />
                    <input type="text" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} />
                  </div>
                </div>
                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <><Loader2 className="spin" /> Verifying...</> : 'Verify Email'}
                </button>
                <div style={{ textAlign: "center", marginTop: "15px" }}>
                  <a href="#" onClick={(e) => { e.preventDefault(); setRegisterStep(1); }} className="forgot-pwd">Change Email</a>
                </div>
              </form>
            )}

            {activeTab === 'register' && registerStep === 3 && (
              <form className="auth-form active-form" onSubmit={handleRegister}>
                <h2>Complete Profile</h2>
                <p className="auth-subtitle">Great! Now choose a name and password.</p>

                <div className="input-group">
                  <label>Full Name</label>
                  <div className="input-field">
                    <User />
                    <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                  </div>
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <div className="input-field">
                    <Lock />
                    <input type="password" name="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} required />
                  </div>
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <><Loader2 className="spin" /> Creating...</> : 'Complete Registration'}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
