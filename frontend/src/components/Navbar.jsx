import { Search, Bell, Video, User, Menu, LogOut, PlusCircle, Tv } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <nav className="h-14 px-4 flex items-center justify-between bg-background border-b border-white/10 sticky top-0 z-50">
      {/* Left section: Logo and Menu */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-6 bg-accent rounded flex items-center justify-center">
               <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
            </div>
            <span className="text-xl font-bold tracking-tight">Utube</span>
          </div>
        </div>
      </div>

      {/* Middle section: Search bar */}
      <div className="hidden md:flex items-center flex-1 max-w-[600px] ml-10">
        <div className="flex w-full">
          <div className="flex flex-1 items-center bg-white/5 border border-white/10 rounded-l-full px-4 py-1.5 focus-within:border-blue-500 transition-colors">
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent border-none outline-none w-full text-sm placeholder:text-secondary"
            />
          </div>
          <button className="bg-white/10 px-5 border border-l-0 border-white/10 rounded-r-full hover:bg-white/20 transition-colors">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Right section: Action buttons and User Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {user && user.has_channel && (
          <button 
            onClick={() => navigate('/upload')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Create/Upload"
          >
            <PlusCircle size={20} />
          </button>
        )}
        
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
          <Bell size={20} />
        </button>
        
        {user ? (
          <div className="relative">
            {/* User Avatar Button */}
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
            >
              {user.username[0].toUpperCase()}
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-surface border border-white/10 rounded-xl shadow-2xl py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-white/10 mb-2">
                  <p className="text-sm font-semibold">{user.username}</p>
                  <p className="text-xs text-secondary truncate">{user.email}</p>
                </div>
                
                {user.has_channel && user.channel ? (
                  <button 
                    onClick={() => {
                      navigate(`/channel/${user.channel.id}`)
                      setShowUserMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors"
                  >
                    <Tv size={18} />
                    Your channel
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      navigate('/create-channel')
                      setShowUserMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-accent"
                  >
                    <PlusCircle size={18} />
                    Create a channel
                  </button>
                )}

                <button 
                  onClick={() => {
                    logout()
                    setShowUserMenu(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-red-400 mt-2 border-t border-white/10"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-1.5 px-3 transition-colors ml-2"
          >
            <User size={18} />
            <span className="text-xs font-medium">Sign In</span>
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
