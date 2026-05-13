import { Home, Compass, PlaySquare, Clock, ThumbsUp, History, Film, Gamepad2, Trophy, Music2, PlusCircle, Tv } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
      active ? 'bg-white/10 font-bold' : 'hover:bg-white/5 active:scale-95'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-secondary'} />
    <span className="text-sm">{label}</span>
  </div>
)

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const isActive = (path) => location.pathname === path

  return (
    <aside className="w-64 hidden lg:block overflow-y-auto bg-background border-r border-white/5 p-3 space-y-4">
      {/* Top Section: Main Navigation */}
      <div className="space-y-1">
        <SidebarItem icon={Home} label="Home" active={isActive('/')} onClick={() => navigate('/')} />
        <SidebarItem icon={Compass} label="Shorts" active={isActive('/shorts')} onClick={() => navigate('/')} />
        <SidebarItem icon={Film} label="Subscriptions" active={isActive('/subscriptions')} onClick={() => navigate('/')} />
      </div>
      
      <div className="border-t border-white/10 pt-4 space-y-1">
        <h3 className="px-3 mb-2 text-[11px] font-bold text-secondary uppercase tracking-wider">You</h3>
        <SidebarItem icon={History} label="History" onClick={() => navigate('/')} />
        
        {user ? (
          user.has_channel && user.channel ? (
            <SidebarItem icon={Tv} label="Your channel" onClick={() => navigate(`/channel/${user.channel.id}`)} />
          ) : (
            <SidebarItem icon={PlusCircle} label="Create a channel" active={isActive('/create-channel')} onClick={() => navigate('/create-channel')} />
          )
        ) : (
          <SidebarItem icon={PlaySquare} label="Your videos" onClick={() => navigate('/login')} />
        )}
        
        <SidebarItem icon={Clock} label="Watch later" onClick={() => navigate('/')} />
        <SidebarItem icon={ThumbsUp} label="Liked videos" onClick={() => navigate('/')} />
      </div>

      <div className="border-t border-white/10 pt-4 space-y-1">
        <h3 className="px-3 mb-2 text-[11px] font-bold text-secondary uppercase tracking-wider">Explore</h3>
        <SidebarItem icon={Music2} label="Music" onClick={() => navigate('/')} />
        <SidebarItem icon={Gamepad2} label="Gaming" onClick={() => navigate('/')} />
        <SidebarItem icon={Trophy} label="Sports" onClick={() => navigate('/')} />
      </div>
    </aside>
  )
}

export default Sidebar
