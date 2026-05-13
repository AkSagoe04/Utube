import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

// Beginners: Context is a way to share data (like user login status) across the whole app
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Beginners: This function runs when the app starts to check if the user is already logged in
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        // Beginners: We ask the backend for the current user's details
        const response = await api.get('/users/me')
        setUser(response.data)
      } catch (err) {
        console.error("Failed to fetch user profile", err)
        localStorage.removeItem('token')
        setUser(null)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const login = async (username, password) => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    const response = await api.post('/token', formData)
    const { access_token } = response.data
    localStorage.setItem('token', access_token)
    
    // After login, fetch the full profile
    await fetchUserProfile()
    return response.data
  }

  const signup = async (username, email, password) => {
    const response = await api.post('/signup', {
      username,
      email,
      password
    })
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  // Beginners: Any data we put in 'value' will be available to all components
  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, refreshUser: fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
