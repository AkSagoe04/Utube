import { motion } from 'framer-motion'
import { User, Lock, Mail, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

// Page component for user authentication (Login and Signup)
const Login = () => {
  // State to toggle between Login and Signup modes
  const [isLogin, setIsLogin] = useState(true)
  // State for form input values
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  // State for error messages and loading status
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // Log in existing user
        await login(formData.email, formData.password)
      } else {
        // Sign up new user
        await signup(formData.username, formData.email, formData.password)
        setIsLogin(true) // Switch back to login mode after successful signup
        setError('Account created! Please sign in.')
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
    <div className="flex items-center justify-center min-h-[80vh]">
      {/* Animated container for the auth card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl"
      >
        <div className="text-center mb-8">
          {/* Logo Placeholder */}
          <div className="inline-flex w-12 h-12 bg-accent rounded-2xl items-center justify-center mb-4">
             <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
          </div>
          <h2 className="text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-secondary text-sm mt-2">
            {isLogin ? 'Sign in to your Utube account' : 'Join the modern video community'}
          </p>
        </div>

        {/* Error/Success Message Display */}
        {error && (
          <div className={`mb-4 p-3 rounded-xl text-xs text-center ${error.includes('created') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username field (Signup only) */}
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
              <input 
                name="username"
                type="text" 
                placeholder="Username" 
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
          )}
          
          {/* Email/Username field */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input 
              name="email"
              type="text" 
              placeholder={isLogin ? "Username or Email" : "Email address"} 
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-colors text-sm"
            />
          </div>

          {/* Password field */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input 
              name="password"
              type="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-colors text-sm"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-colors mt-6 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Toggle between Login and Signup modes */}
        <div className="mt-8 text-center">
          <p className="text-secondary text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="ml-2 text-blue-500 hover:underline font-medium"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
