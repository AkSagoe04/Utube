import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // We can add a /me endpoint later, for now we just trust the token
          // or simulate a user object
          const savedUser = JSON.parse(localStorage.getItem('user'))
          if (savedUser) setUser(savedUser)
        } catch (err) {
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    fetchUser()
  }, [])

  const login = async (username, password) => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    const response = await api.post('/token', formData)
    const { access_token } = response.data
    localStorage.setItem('token', access_token)
    
    const userData = { username }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
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
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
