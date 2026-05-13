import { motion } from 'framer-motion'
import { User, Lock, Mail, Loader2, Eye, EyeOff, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

// Page component for user authentication (Login and Signup)
const Login = () => {
  // State to toggle between Login and Signup modes
  const [isLogin, setIsLogin] = useState(true)
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false)
  
  // State for form input values
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  // State for error messages and loading status
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Beginners: Client-side validation before sending data to the server
    if (!isLogin) {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long')
        setLoading(false)
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match. Please retype them.')
        setLoading(false)
        return
      }
    }

    try {
      if (isLogin) {
        // Beginners: In login mode, formData.email can be either username or email (handled by backend)
        await login(formData.email, formData.password)
      } else {
        // Sign up new user
        await signup(formData.username, formData.email, formData.password)
        setRegistrationSuccess(true)
      }
      if (isLogin) navigate('/') // Redirect to home on successful login
    } catch (err) {
      // Extract error message from API response
      setError(err.response?.data?.detail || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Update form state on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      {/* Animated container for the auth card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 bg-surface border border-white/10 rounded-[32px] backdrop-blur-2xl shadow-2xl relative overflow-hidden"
      >
        {/* Design Accents */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex w-14 h-14 bg-accent rounded-2xl items-center justify-center mb-6 shadow-lg shadow-accent/20">
             <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-white border-b-[7px] border-b-transparent ml-1"></div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{isLogin ? 'Sign In' : 'Create Account'}</h2>
          <p className="text-secondary text-sm mt-2">
            {isLogin ? 'Sign in to your Utube account' : 'Join the modern video community'}
          </p>
        </div>

        {/* Error/Success Message Display */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-2xl text-xs font-medium text-center border ${
              error.includes('created') 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {error}
          </motion.div>
        )}

        {/* Auth Form or Success Prompt */}
        {registrationSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 relative z-10"
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-green-500 text-4xl">✓</div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Registration Successful!</h3>
            <p className="text-secondary text-sm mb-8 px-4">
              Your account has been created successfully. You can now sign in with your credentials.
            </p>
            <button 
              onClick={() => {
                setRegistrationSuccess(false)
                setIsLogin(true)
                setError('')
              }}
              className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-accent/20"
            >
              Continue to Sign In
            </button>
          </motion.div>
        ) : (
          <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
            {/* Username field (Signup only) */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-secondary uppercase ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                  <input 
                    name="username"
                    type="text" 
                    placeholder="Choose a username" 
                    value={formData.username}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
                  />
                </div>
              </div>
            )}
            
            {/* Email/Username field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-secondary uppercase ml-1">{isLogin ? 'Login Identity' : 'Email Address'}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                <input 
                  name="email"
                  type="text" 
                  placeholder={isLogin ? "Username or Email" : "your@email.com"} 
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-secondary uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
                />
                {/* Beginners: Show/Hide toggle button */}
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password field (Signup only) */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-secondary uppercase ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                  <input 
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
                  />
                </div>
              </div>
            )}

            {/* Forgot Password link (Login only) */}
            {isLogin && (
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={() => setError('Password reset is not yet available in this version.')}
                  className="text-xs text-secondary hover:text-accent transition-colors flex items-center gap-1"
                >
                  <HelpCircle size={12} />
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all mt-6 shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
        )}

        {/* Toggle between Login and Signup modes */}
        <div className="mt-10 text-center relative z-10">
          <p className="text-secondary text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setShowPassword(false)
              }}
              className="ml-2 text-accent hover:underline font-bold"
            >
              {isLogin ? 'Create one now' : 'Sign in here'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
