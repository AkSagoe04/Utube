import { Home, Compass, PlaySquare, Clock, ThumbsUp, History, Film, Gamepad2, Trophy, Music2 } from 'lucide-react'

const SidebarItem = ({ icon: Icon, label, active = false }) => (
  <div className={`flex items-center gap-5 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${active ? 'bg-white/10 font-medium' : 'hover:bg-white/5'}`}>
    <Icon size={20} className={active ? 'text-white' : 'text-secondary'} />
    <span className="text-sm">{label}</span>
  </div>
)

const Sidebar = () => {
  return (
    <aside className="w-64 hidden lg:block overflow-y-auto bg-background border-r border-white/5 p-3 space-y-4">
      <div className="space-y-1">
        <SidebarItem icon={Home} label="Home" active />
        <SidebarItem icon={Compass} label="Shorts" />
        <SidebarItem icon={Film} label="Subscriptions" />
      </div>
      
      <div className="border-t border-white/10 pt-4 space-y-1">
        <h3 className="px-3 mb-2 text-sm font-semibold text-secondary uppercase text-[11px]">You</h3>
        <SidebarItem icon={History} label="History" />
        <SidebarItem icon={PlaySquare} label="Your videos" />
        <SidebarItem icon={Clock} label="Watch later" />
        <SidebarItem icon={ThumbsUp} label="Liked videos" />
      </div>

      <div className="border-t border-white/10 pt-4 space-y-1">
        <h3 className="px-3 mb-2 text-sm font-semibold text-secondary uppercase text-[11px]">Explore</h3>
        <SidebarItem icon={Music2} label="Music" />
        <SidebarItem icon={Gamepad2} label="Gaming" />
        <SidebarItem icon={Trophy} label="Sports" />
      </div>
    </aside>
  )
}

export default Sidebar
